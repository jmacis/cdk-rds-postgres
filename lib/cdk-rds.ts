import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as rds from '@aws-cdk/aws-rds';
import * as kms from '@aws-cdk/aws-kms';
import { Tag } from '@aws-cdk/core';
import { Vpc, IVpc, InstanceType, SubnetType, Port, SecurityGroup, Peer } from '@aws-cdk/aws-ec2';
import { RemovalPolicy } from '@aws-cdk/core';
import { SecretsStack } from './cdk-secrets';
import { ParameterGroupStack } from './cdk-parameter-group';
import { ReadReplicaStack } from './cdk-read-replica';
import { kmsKeys, kmsArnSuffix } from '../bin/cdk-config';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import * as lambda from '@aws-cdk/aws-lambda';

export interface RdsProps {
    vpc: IVpc;
    // vpc: Vpc;
    databaseName: string;
    secretName: string;
}

export class RdsStack extends cdk.Construct {
    public readonly db: rds.DatabaseInstance;
    public readonly dbParameterGroup: ParameterGroupStack;
    public readonly replica: rds.DatabaseInstanceReadReplica;
    public readonly dbSecret: SecretsStack;
    constructor(scope: cdk.Construct, id: string, props: RdsProps, config: Config) {
        super(scope, id);

        // create secrets manager resource
        this.dbSecret = new SecretsStack(this, 'DbSecret', props, config);

        // create rds parameter group resource
        this.dbParameterGroup = new ParameterGroupStack(this, 'ParameterGroup', props, config);

        // const arnSuffixId = kmsArnSuffix[`${process.env.NODE_ENV}`][`${process.env.CDK_DEPLOY_ACCOUNT}`];
        // const dbKmsArn = `arn:aws:kms:${process.env.CDK_DEPLOY_REGION}:${process.env.CDK_DEPLOY_ACCOUNT}:key/${arnSuffixId}`;
        // const dbKmsArn = `arn:aws:kms:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:key/${arnSuffixId}`;
        // const dbKmsKey = (config.database.storageEncrypted === true) ? kms.Key.fromKeyArn(this, 'KmsKey', dbKmsArn) : undefined;

        // create db managed kms key from config
        const dbKmsArn = kmsKeys[`${process.env.NODE_ENV}`][`${process.env.CDK_DEPLOY_REGION}`][`${process.env.CDK_DEPLOY_ACCOUNT}`];
        const dbKmsKey = (config.database.storageEncrypted === true) ? kms.Key.fromKeyArn(this, 'KmsKey', dbKmsArn) : undefined;

        // create db security group resource
        const dbSecurityGroup = SecurityGroup.fromSecurityGroupId(this, 'RdsInstanceSG', config.database.rdsinstanceSecurityGroupId, {
            mutable: true
        });

        // create rds resource
        this.db = new rds.DatabaseInstance(this, 'RdsInstance', {
            instanceIdentifier: 'cdk-rds-postgres',
            engine: rds.DatabaseInstanceEngine.postgres({
                version: config.database.engineVersion
            }),
            // masterUsername: config.database.masterUsername,
            masterUsername: this.dbSecret.secret.secretValueFromJson('username').toString(),
            masterUserPassword: this.dbSecret.secret.secretValueFromJson(config.secretsManager.generateStringKey),
            databaseName: props.databaseName,
            instanceType: new InstanceType(config.database.instanceType),
            // instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            vpc: props.vpc,
            multiAz: config.database.multiAz,
            parameterGroup: this.dbParameterGroup.parameterGroup,
            vpcPlacement: { subnetType: SubnetType.ISOLATED },
            securityGroups: [dbSecurityGroup],
            preferredBackupWindow: config.database.preferredBackupWindow,
            preferredMaintenanceWindow: config.database.preferredMaintenanceWindow,
            backupRetention: cdk.Duration.days(config.database.backupRetention),
            cloudwatchLogsRetention: config.database.cloudwatchLogsRetention,
            autoMinorVersionUpgrade: false,
            allocatedStorage: config.database.allocatedStorage,
            maxAllocatedStorage: config.database.maxAllocatedStorage,
            deleteAutomatedBackups: config.database.deleteAutomatedBackups,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: config.database.deletionProtection,
            storageEncrypted: config.database.storageEncrypted,
            // storageEncryptionKey: dbKmsKey
        });

        // create secrets attachment target
        const target: secretsManager.ISecretAttachmentTarget = {
            asSecretAttachmentTarget: () => ({
                targetId: this.db.instanceIdentifier,
                targetType: secretsManager.AttachmentTargetType.INSTANCE
            })
        };

        // add target attachment to secret
        this.dbSecret.secret.addTargetAttachment('AttachedSecret', {
            target: target
        });

        // get rotate lambda function arn
        const func = lambda.Function.fromFunctionArn(this, config.secretsManager.lambdaScheduleRotateFunc,
            `arn:aws:lambda:${this.dbSecret.secret.stack.region}:${this.dbSecret.secret.stack.account}:function:${config.secretsManager.lambdaScheduleRotateFunc}`);

        // add secrets manager rotation schedule
        this.dbSecret.secret.addRotationSchedule('RotateSecrets', {
            rotationLambda: func,
            automaticallyAfter: cdk.Duration.days(config.secretsManager.scheduleRotateDays),
        });

        // add tags to db master
        Tag.add(this.db, 'Name', 'Master Database');

        // create ec2 bastion security group resource
        const ec2SecurityGroup = SecurityGroup.fromSecurityGroupId(this, 'Ec2BastionInstanceSG', config.database.ec2bastionSecurityGroupId, {
            mutable: true
        });

        // create ingress rule port 5432 ec2 bastion
        this.db.connections.allowFrom(ec2SecurityGroup.connections, Port.tcp(config.database.tcpPort), 'from ec2 bastion to rds');

        // create secrets lambda security group resource
        const secretslambdaSecurityGroup = SecurityGroup.fromSecurityGroupId(this, 'SecretsLambdaSG', config.database.secretslambdaSecurityGroupId, {
            mutable: true
        });

        // create ingress rule port 5432 secrets manager lambda
        this.db.connections.allowFrom(secretslambdaSecurityGroup.connections, Port.tcp(config.database.tcpPort), 'from secrets lambda function to rds');

        // create ingress rule port 5432
        // this.db.connections.allowDefaultPortFromAnyIpv4();
        // this.asg.connections.allowFrom(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'from 0.0.0.0/0:22');

        // create ingress rule port 5432 secrets manager rotate lambda
        // this.db.connections.allowFrom(Peer.ipv4(config.vpc.cidr), Port.tcp(5432), `from ${config.vpc.cidr}:5432`);

        // create cfn output db end point address
        new cdk.CfnOutput(this, 'DbInstanceEndPoint', {
            description: 'CDK RDS Endpoint Address',
            value: this.db.dbInstanceEndpointAddress,
            exportName: 'DbInstanceEndPoint'
        });

        // create cfn output db end point address
        new cdk.CfnOutput(this, 'DbInstanceIdentifier', {
            description: 'CDK RDS Instance Identifier',
            value: `${config.awsConsole}/rds/home?region=${this.db.stack.region}#database:id=${this.db.instanceIdentifier};is-cluster=false`
        });

        const readReplicaProps = {
            vpc: props.vpc,
            db: this.db
        };

        // create rds db read replica
        if (config.database.readReplicaEnabled)
            new ReadReplicaStack(this, 'ReadReplica', readReplicaProps, config);
    }
}