import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as rds from '@aws-cdk/aws-rds';
import { Tag } from '@aws-cdk/core';
import { Vpc, InstanceType, SubnetType } from '@aws-cdk/aws-ec2'
import { RemovalPolicy } from '@aws-cdk/core';

export interface ReadReplicaProps {
    vpc: Vpc;
    db: rds.DatabaseInstance;
}

export class ReadReplicaStack extends cdk.Construct {
    public readonly replica: rds.DatabaseInstanceReadReplica;

    constructor(scope: cdk.Construct, id: string, props: ReadReplicaProps, config: Config) {
        super(scope, id);

        //create rds db read replica
        this.replica = new rds.DatabaseInstanceReadReplica(this, 'ReadReplica', {
            instanceIdentifier: 'cdk-rds-postgres-read',
            instanceType: new InstanceType(config.database.instanceType),
            // instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            sourceDatabaseInstance: props.db,
            vpc: props.vpc,
            vpcPlacement: { subnetType: SubnetType.PUBLIC },
            deleteAutomatedBackups: true,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false
        });

        // add tags to db replica
        Tag.add(this.replica, 'Name', 'Read Replica Database');

        // create ingress rule port 5432
        this.replica.connections.allowDefaultPortFromAnyIpv4();
    }
}