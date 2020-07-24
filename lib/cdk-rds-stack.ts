import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import { VpcStack } from './cdk-vpc';
import { RdsStack } from './cdk-rds';
import { CloudWatchStack } from './cdk-sns-cloudwatch';

export class CdkRdsStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps, config: Config) {
        super(scope, id, props);

        // cmd line arg env
        const env = scope.node.tryGetContext('env');

        const vpcProps = {
            name: `Vpc-${env}`,
            maxAzs: 2
        };

        // create vpc resource
        const vpcStackEntity = new VpcStack(this, 'Vpc', vpcProps, config);

        const rdsProps = {
            vpc: vpcStackEntity.vpc,
            databaseName: 'demo'
        };

        // create rds resource
        const rdsStackEntity = new RdsStack(this, 'Rds', rdsProps, config);

        const snsCloudWatchProps = {
            db: rdsStackEntity.db,
            email: 'johnmacis@gmail.com'
        };

        // create sns cloudwatch resource
        const snsStackEntity = new CloudWatchStack(this, 'SnsCloudWatch', snsCloudWatchProps, config);
    }
}