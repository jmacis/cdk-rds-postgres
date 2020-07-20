import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as logs from '@aws-cdk/aws-logs';
import { VpcStack } from './cdk-vpc';
import { RdsStack } from './cdk-rds';

export class CdkRdsStack extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const env = scope.node.tryGetContext('env');
        const vpcProps = {
            name: `VPC-${env}`,
            cidr: '10.1.0.0/16',
            maxAzs: 2
        };

        // create vpc resource
        const vpc = new VpcStack(this, 'Vpc', vpcProps);

        // const rdsProps = {
        //     vpc: vpc,
        //     name: 'test'
        // };

        // create rds resource
        const rds = new RdsStack(this, 'Rds', vpc);
    }
}