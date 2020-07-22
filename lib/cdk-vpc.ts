import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
// import { Vpc, InstanceType, SecurityGroup, ISubnet } from "@aws-cdk/aws-ec2";

export interface VpcProps {
    name: string,
    cidr: string,
    maxAzs: number
}

export class VpcStack extends cdk.Construct {
    public readonly vpc: ec2.Vpc;
    public readonly privateSubnetConfiguration: ec2.SubnetConfiguration;
    public readonly publicSubnetConfiguration: ec2.SubnetConfiguration;

    constructor(scope: cdk.Construct, id: string, props: VpcProps) {
        super(scope, id);

        // create vpc resource
        this.privateSubnetConfiguration = {
            cidrMask: 26,
            name: 'private',
            subnetType: ec2.SubnetType.ISOLATED,
        };

        this.publicSubnetConfiguration = {
            cidrMask: 26,
            name: 'public',
            subnetType: ec2.SubnetType.PUBLIC,
        };

        this.vpc = new ec2.Vpc(this, props.name, {
            cidr: props.cidr,
            maxAzs: props.maxAzs,
            subnetConfiguration: [
                this.privateSubnetConfiguration,
                this.publicSubnetConfiguration
            ],
            natGateways: 0
        })
    }
}