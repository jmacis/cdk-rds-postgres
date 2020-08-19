import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as rds from '@aws-cdk/aws-rds';
import { Tag, CfnOutput } from '@aws-cdk/core';
import { Vpc, IVpc, InstanceType, SubnetType, SecurityGroup, Port } from '@aws-cdk/aws-ec2'
import { RemovalPolicy } from '@aws-cdk/core';

export interface ReadReplicaProps {
    // vpc: Vpc;
    vpc: IVpc,
    db: rds.DatabaseInstance;
}

export class ReadReplicaStack extends cdk.Construct {
    public readonly replica: rds.DatabaseInstanceReadReplica;

    constructor(scope: cdk.Construct, id: string, props: ReadReplicaProps, config: Config) {
        super(scope, id);

        // create db security group resource
        const dbSecurityGroup = SecurityGroup.fromSecurityGroupId(this, 'ReadReplicaSG', config.database.readreplicaSecurityGroupId, {
            mutable: true
        });

        //create rds db read replica
        this.replica = new rds.DatabaseInstanceReadReplica(this, 'ReadReplica', {
            instanceIdentifier: 'cdk-rds-postgres-read',
            instanceType: new InstanceType(config.database.instanceType),
            // instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            sourceDatabaseInstance: props.db,
            vpc: props.vpc,
            vpcPlacement: { subnetType: SubnetType.ISOLATED },
            securityGroups: [dbSecurityGroup],
            deleteAutomatedBackups: config.database.deleteAutomatedBackups,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: config.database.deletionProtection
        });

        // add tags to db replica
        Tag.add(this.replica, 'Name', 'Read Replica Database');

        // create master rds security group resource
        const rdsInstanceSecurityGroup = SecurityGroup.fromSecurityGroupId(this, 'RdsInstanceSecurityGroup', config.database.rdsinstanceSecurityGroupId, {
            mutable: true
        });

        // create ingress rule port 5432 master rds
        this.replica.connections.allowFrom(rdsInstanceSecurityGroup.connections, Port.tcp(config.database.tcpPort), 'from master rds to read replica');

        // create ec2 bastion security group resource
        const ec2SecurityGroup = SecurityGroup.fromSecurityGroupId(this, 'Ec2BastionInstanceSG', config.database.ec2bastionSecurityGroupId, {
            mutable: true
        });

        // create ingress rule port 5432 ec2 bastion
        this.replica.connections.allowFrom(ec2SecurityGroup.connections, Port.tcp(config.database.tcpPort), 'from ec2 bastion to read replica');

        // create ingress rule port 5432
        // this.replica.connections.allowDefaultPortFromAnyIpv4();

        // create cfn output db end point address
        new CfnOutput(this, 'ReadReplicaEndPoint', {
            description: 'CDK Read Replica Endpoint Address',
            value: this.replica.dbInstanceEndpointAddress,
            exportName: 'ReadReplicaEndPoint'
        });
    }
}