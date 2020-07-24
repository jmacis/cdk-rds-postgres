import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as rds from '@aws-cdk/aws-rds';
import * as logs from '@aws-cdk/aws-logs';
// import { Vpc, InstanceType, SecurityGroup, ISubnet } from "@aws-cdk/aws-ec2";
// import { ParameterGroup, DatabaseInstance, DatabaseInstanceEngine, StorageType } from "@aws-cdk/aws-rds";
// import * as ec2 from '@aws-cdk/aws-ec2';
import { Vpc, InstanceType, SubnetType } from '@aws-cdk/aws-ec2'
import { RemovalPolicy } from '@aws-cdk/core';

export interface RdsProps {
    vpc: Vpc;
    databaseName: string;
}

export class RdsStack extends cdk.Construct {
    public readonly db: rds.DatabaseInstance;
    public readonly paramterGroup: rds.ParameterGroup;
    public readonly replica: rds.DatabaseInstanceReadReplica;

    constructor(scope: cdk.Construct, id: string, props: RdsProps, config: Config) {
        super(scope, id);

        // create rds paramter group
        this.paramterGroup = new rds.ParameterGroup(this, 'ParamterGroup', {
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_11_6
            }),
            description: 'CloudFormation AWS RDS PostgreSQL Database Parameter Group',
            parameters: {
                shared_preload_libraries: 'auto_explain,pg_stat_statements,pg_hint_plan,pgaudit',
                log_statement: 'ddl',
                log_connections: '1',
                log_disconnections: '1',
                log_lock_waits: '1',
                log_min_duration_statement: '5000',
                'auto_explain.log_min_duration': '5000',
                'auto_explain.log_verbose': '1',
                log_rotation_age: '1440',
                log_rotation_size: '102400',
                'rds.log_retention_period': '10080',
                random_page_cost: '1',
                track_activity_query_size: '16384',
                idle_in_transaction_session_timeout: '7200000',
                statement_timeout: '7200000'
            }
        });

        // create rds resource
        this.db = new rds.DatabaseInstance(this, 'RdsInstance', {
            instanceIdentifier: 'cdk-rds-postgres',
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_11_6
            }),
            masterUsername: config.database.masterUsername,
            databaseName: props.databaseName,
            instanceType: new InstanceType(config.database.instanceType),
            // instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            vpc: props.vpc,
            multiAz: config.database.multiAz,
            parameterGroup: this.paramterGroup,
            vpcPlacement: { subnetType: SubnetType.PUBLIC },
            backupRetention: cdk.Duration.days(config.database.backupRetention),
            cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
            autoMinorVersionUpgrade: false,
            allocatedStorage: config.database.allocatedStorage,
            maxAllocatedStorage: config.database.maxAllocatedStorage,
            deleteAutomatedBackups: true,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false
        });

        // create ingress rule port 5432
        this.db.connections.allowDefaultPortFromAnyIpv4();

        //create rds db read replica
        this.replica = new rds.DatabaseInstanceReadReplica(this, 'ReadReplica', {
            instanceIdentifier: 'cdk-rds-postgres-read',
            instanceType: new InstanceType(config.database.instanceType),
            // instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            sourceDatabaseInstance: this.db,
            vpc: props.vpc,
            vpcPlacement: { subnetType: SubnetType.PUBLIC },
            deleteAutomatedBackups: true,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false
        });

        // create ingress rule port 5432
        this.replica.connections.allowDefaultPortFromAnyIpv4();
    }
}