import * as cdk from '@aws-cdk/core';
import { VpcStack } from './cdk-vpc';
import { RdsStack } from './cdk-rds';
import { CloudWatchStack } from './cdk-sns-cloudwatch';

export class CdkRdsStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // cmd line arg env
        const env = scope.node.tryGetContext('env');

        const vpcProps = {
            name: `Vpc-${env}`,
            cidr: '10.1.0.0/16',
            maxAzs: 2
        };

        // create vpc resource
        const vpcStackEntity = new VpcStack(this, 'Vpc', vpcProps);

        const rdsProps = {
            vpc: vpcStackEntity.vpc,
            masterUsername: 'dcpsadmin',
            databaseName: 'demo'
        };

        // create rds resource
        const rdsStackEntity = new RdsStack(this, 'Rds', rdsProps);

        const snsCloudWatchProps = {
            db: rdsStackEntity.db,
            email: 'johnmacis@gmail.com'
        };

        // create sns cloudwatch resource
        const snsStackEntity = new CloudWatchStack(this, 'SnsCloudWatch', snsCloudWatchProps);

        // debug
        console.log("CPU_METRIC:", snsStackEntity.topic.metric(snsStackEntity.cpuMetric.metricName));
        console.log("IOPS_METRIC:", snsStackEntity.topic.metric(snsStackEntity.iopsMetric.metricName));
    }
}