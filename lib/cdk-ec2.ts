import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ec2 from '@aws-cdk/aws-ec2'

export interface Ec2Props {
    vpc: ec2.IVpc;
}

export class Ec2Stack extends cdk.Construct {
    public readonly ec2Instance: ec2.Instance;
    public readonly asg: autoscaling.AutoScalingGroup;
    public readonly alb: elbv2.ApplicationLoadBalancer;
    public readonly listener: elbv2.ApplicationListener;

    constructor(scope: cdk.Construct, id: string, props: Ec2Props, config: Config) {
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

        this.ec2Instance = new ec2.Instance(this, 'Ec2', {
            vpc: props.vpc,
            keyName: config.ec2Instance.keyName,
            instanceType: ec2.InstanceType.of(config.ec2Instance.bastionInstanceClass, config.ec2Instance.bastionInstanceSize),
            machineImage: new ec2.AmazonLinuxImage,
            securityGroup: ec2SecurityGroup,
            userData: userData,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC
            }
        });

        // create ingress rule ssh
        this.ec2Instance.connections.allowFrom(ec2.Peer.anyIpv4(), ec2.Port.tcp(config.ec2Instance.sshPort), `from 0.0.0.0/0:${config.ec2Instance.sshPort}`);
    }
}