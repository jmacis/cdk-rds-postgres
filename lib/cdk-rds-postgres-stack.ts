import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as logs from '@aws-cdk/aws-logs';
import { RemovalPolicy } from '@aws-cdk/core';
import { Subnet } from '@aws-cdk/aws-ec2';

export class CdkRdsPostgresStack extends cdk.Stack {
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

    // create rds db instance
    const db = new rds.DatabaseInstance(this, 'RdsInstance', {
      instanceIdentifier: 'cdk-rds-postgres',
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      engineVersion: '11.6',
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

    // create ingress rule port 5432
    db.connections.allowDefaultPortFromAnyIpv4();
  }
}
