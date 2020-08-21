import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ec2 from '@aws-cdk/aws-ec2'
// import { Vpc, IVpc, InstanceType, SubnetType } from '@aws-cdk/aws-ec2'

export interface AlbProps {
    vpc: ec2.IVpc;
}

export class AlbStack extends cdk.Construct {
    public readonly asg: autoscaling.AutoScalingGroup;
    public readonly alb: elbv2.ApplicationLoadBalancer;
    public readonly listener: elbv2.ApplicationListener;

    constructor(scope: cdk.Construct, id: string, props: AlbProps, config: Config) {
        super(scope, id);

        // create ec2 userdata resource
        const userData = ec2.UserData.forLinux();
        userData.addCommands('sudo yum update -y',
            'wget https://yum.postgresql.org/11/redhat/rhel-6.9-x86_64/postgresql11-libs-11.8-1PGDG.rhel6.x86_64.rpm',
            'wget https://yum.postgresql.org/11/redhat/rhel-6.9-x86_64/postgresql11-11.8-1PGDG.rhel6.x86_64.rpm',
            'sudo yum clean all',
            'sudo rpm -ivh postgresql11-libs-11.8-1PGDG.rhel6.x86_64.rpm',
            'sudo rpm -ivh postgresql11-11.8-1PGDG.rhel6.x86_64.rpm',
            'psql --version'
        );

        // create db security group resource
        const ec2SecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'Ec2BastionInstanceSG', config.database.ec2bastionSecurityGroupId, {
            mutable: true
        });

        // create autoscaling group resource
        this.asg = new autoscaling.AutoScalingGroup(this, 'Asg', {
            vpc: props.vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            keyName: config.ec2Instance.keyName,
            machineImage: new ec2.AmazonLinuxImage,
            securityGroup: ec2SecurityGroup,
            userData: userData,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC
            },
            minCapacity: 1,
            maxCapacity: 1
        });

        // create application load balancer resource
        this.alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
            vpc: props.vpc,
            internetFacing: true
        });

        // create alb listener resource
        this.listener = this.alb.addListener('Listener', {
            port: 80
        });

        // add alb targets
        this.listener.addTargets('Target', {
            port: 80,
            targets: [this.asg]
        });

        // create egress rule
        this.listener.connections.allowDefaultPortFromAnyIpv4('Open All Ingress ports');

        // create ingress rule ssh
        this.asg.connections.allowFrom(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'from 0.0.0.0/0:22');

        // scaling request count
        this.asg.scaleOnRequestCount('Load', {
            targetRequestsPerSecond: 1
        });
    }
}