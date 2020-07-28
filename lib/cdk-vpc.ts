import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as ec2 from '@aws-cdk/aws-ec2';
// import { Vpc, InstanceType, SecurityGroup, ISubnet } from "@aws-cdk/aws-ec2";

export interface VpcProps {
    name: string;
    maxAzs: number;
}

export class VpcStack extends cdk.Construct {
    public readonly vpc: ec2.Vpc;
    public readonly privateSubnetConfiguration: ec2.SubnetConfiguration;
    public readonly publicSubnetConfiguration: ec2.SubnetConfiguration;

    constructor(scope: cdk.Construct, id: string, props: VpcProps, config: Config) {
        super(scope, id);

        // create vpc resource
        this.privateSubnetConfiguration = {
            cidrMask: config.vpc.subnetPrivateCidrMask,
            name: config.vpc.subnetPrivateName,
            subnetType: ec2.SubnetType.ISOLATED,
        };

        this.publicSubnetConfiguration = {
            cidrMask: config.vpc.subnetPublicCidrMask,
            name: config.vpc.subnetPublicName,
            subnetType: ec2.SubnetType.PUBLIC,
        };

        this.vpc = new ec2.Vpc(this, props.name, {
            cidr: config.vpc.cidr,
            maxAzs: props.maxAzs,
            subnetConfiguration: [
                this.privateSubnetConfiguration,
                this.publicSubnetConfiguration
            ],
            natGateways: 0
        })
    }
}