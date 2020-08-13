import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as ec2 from '@aws-cdk/aws-ec2';

export interface VpcProps {
    name: string;
    maxAzs: number;
}

export class VpcStack extends cdk.Construct {
    public readonly vpc: ec2.IVpc;

    constructor(scope: cdk.Construct, id: string, props: VpcProps, config: Config) {
        super(scope, id);

        // cmdline arg vpcid
        const vpcId: string | undefined = this.node.tryGetContext('vpcid');

        // check vpcid 
        if (!vpcId) {
            throw new Error('vpcid undefined');
        } else {
            console.log("use existing vpcId");
            this.vpc = ec2.Vpc.fromLookup(this, props.name, {
                vpcId: vpcId
            });
        }
    }
}