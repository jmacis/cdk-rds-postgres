import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as logs from '@aws-cdk/aws-logs';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import cloudwatch_actions = require('@aws-cdk/aws-cloudwatch-actions')
import { RemovalPolicy } from '@aws-cdk/core';

; export class CdkRdsPostgresStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const privateSubnetConfiguration = {
      cidrMask: 26,
      name: 'private',
      subnetType: ec2.SubnetType.ISOLATED,
    };

    const publicSubnetConfiguration = {
      cidrMask: 26,
      name: 'public',
      subnetType: ec2.SubnetType.PUBLIC,
    };

    // create vpc resource
    const vpc = new ec2.Vpc(this, "Vpc", {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [privateSubnetConfiguration, publicSubnetConfiguration],
      maxAzs: 2,
      natGateways: 0
    });

    // create rds paramter group
    const paramterGroup = new rds.ParameterGroup(this, 'ParamterGroup', {
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

    // create rds db instance
    const db = new rds.DatabaseInstance(this, 'RdsInstance', {
      instanceIdentifier: 'cdk-rds-postgres',
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_11_6
      }),
      masterUsername: 'dcpsadmin',
      databaseName: 'demo',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      vpc: vpc,
      vpcPlacement: { subnetType: ec2.SubnetType.PUBLIC },
      backupRetention: cdk.Duration.days(7),
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      autoMinorVersionUpgrade: false,
      allocatedStorage: 20,
      maxAllocatedStorage: 30,
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false
    });

    // const metric = new cloudwatch.Metric({
    //   period: cdk.Duration.seconds(300),
    //   statistic: 'Average',
    //   metricName: 'CPUUtilization',
    //   namespace: 'AWS/RDS'
    // });

    // const alarm = metric.createAlarm(this, 'RdsAlarm', {
    //   evaluationPeriods: 1,
    //   threshold: 1,
    //   actionsEnabled: true,
    //   statistic: 'average'
    // });

    // create sns resource
    const topic = new sns.Topic(this, 'SnsTopic', {
      // displayName: 'cdk-rds-postgres',
      // topicName: 'cdk-rds-postgres'
    });

    // subscribe to sns topic
    topic.addSubscription(new subs.EmailSubscription('johnmacis@gmail.com'));

    // create rds cloudwatch cpu metric
    const cpuMetric = db.metric('CPUUtilization');

    // create rds cloudwatch iopsWrite metric
    const ioMetric = db.metric('WriteIOPS');

    // create cpu cloudwatch alarm
    const cpuAlarm = new cloudwatch.Alarm(this, 'CpuAlarm', {
      evaluationPeriods: 2,
      metric: cpuMetric,
      threshold: 75,
      period: cdk.Duration.seconds(300)
    });

    // add rds cpu alarm to sns topic
    cpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(topic));

    // create rds cloudwatch iopsWrite metric
    const iopsMetric = db.metric('WriteIOPS');

    // create iops cloudwatch alarm
    const iopsAlarm = new cloudwatch.Alarm(this, 'IopsAlarm', {
      evaluationPeriods: 2,
      metric: iopsMetric,
      threshold: 7000,
      statistic: 'max',
      period: cdk.Duration.seconds(60)
    });

    // add rds iops alarm to sns topic
    iopsAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(topic));

    // create ingress rule port 5432
    db.connections.allowDefaultPortFromAnyIpv4();

    //create rds db read replica
    const replica = new rds.DatabaseInstanceReadReplica(this, 'ReadReplica', {
      instanceIdentifier: 'cdk-rds-postgres-read',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      sourceDatabaseInstance: db,
      vpc: vpc,
      vpcPlacement: { subnetType: ec2.SubnetType.PUBLIC },
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false
    });

    // create ingress rule port 5432
    replica.connections.allowDefaultPortFromAnyIpv4();
  }
}
