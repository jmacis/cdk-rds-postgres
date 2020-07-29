import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as rds from '@aws-cdk/aws-rds';
import * as logs from '@aws-cdk/aws-logs';
import * as kms from '@aws-cdk/aws-kms';
import { Tag, ScopedAws } from '@aws-cdk/core';
import { Vpc, InstanceType, SubnetType } from '@aws-cdk/aws-ec2'
import { RemovalPolicy } from '@aws-cdk/core';
import { SecretsStack } from './cdk-secrets';
import { ParameterGroupStack } from './cdk-parameter-group';
import { ReadReplicaStack } from './cdk-read-replica';
import { kmsKeys, kmsArnSuffix } from '../bin/cdk-config';

export interface RdsProps {
    vpc: Vpc;
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

        // create rds resource
        this.db = new rds.DatabaseInstance(this, 'RdsInstance', {
            instanceIdentifier: 'cdk-rds-postgres',
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_11_6
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
            vpcPlacement: { subnetType: SubnetType.PUBLIC },
            preferredBackupWindow: config.database.preferredBackupWindow,
            preferredMaintenanceWindow: config.database.preferredMaintenanceWindow,
            backupRetention: cdk.Duration.days(config.database.backupRetention),
            cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
            autoMinorVersionUpgrade: false,
            allocatedStorage: config.database.allocatedStorage,
            maxAllocatedStorage: config.database.maxAllocatedStorage,
            deleteAutomatedBackups: true,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false,
            storageEncrypted: config.database.storageEncrypted,
            storageEncryptionKey: dbKmsKey
        });

        // add tags to db master
        Tag.add(this.db, 'Name', 'Master Database');

        // create ingress rule port 5432
        this.db.connections.allowDefaultPortFromAnyIpv4();

        const readReplicaProps = {
            vpc: props.vpc,
            db: this.db
        };

        // create rds db read replica
        if (config.database.readReplicaEnabled)
            new ReadReplicaStack(this, 'ReadReplica', readReplicaProps, config);
    }
}