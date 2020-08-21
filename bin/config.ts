import { Construct } from '@aws-cdk/core';
import { PostgresEngineVersion } from '@aws-cdk/aws-rds';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { InstanceClass, InstanceSize } from '@aws-cdk/aws-ec2'

const env: string | undefined = process.env.NODE_ENV;
const region: string | undefined = process.env.CDK_DEPLOY_REGION;
const account: string | undefined = process.env.CDK_DEPLOY_ACCOUNT;

export interface IamConfig {
    userAccountName: string;
}

export interface VpcConfig {
    cidr: string;
    subnetPublicName: string;
    subnetPrivateName: string;
    subnetPublicCidrMask: number;
    subnetPrivateCidrMask: number;
    natGateways: number;
}

export interface InstanceConfig {
    instanceType: string;
    volumeSize: number;
    keyName: string;
}

export interface Ec2InstanceConfig {
    keyName: string;
    sshPort: number;
    bastionInstanceClass: InstanceClass;
    bastionInstanceSize: InstanceSize;
}

export interface DatabaseConfig {
    masterUsername: string;
    instanceType: string;
    allocatedStorage: number;
    maxAllocatedStorage: number,
    preferredMaintenanceWindow: string;
    preferredBackupWindow: string;
    backupRetention: number;
    multiAz: boolean;
    readReplicaEnabled: boolean;
    storageEncrypted: boolean;
    deleteAutomatedBackups: boolean;
    deletionProtection: boolean;
    engineVersion: PostgresEngineVersion;
    cloudwatchLogsRetention: RetentionDays;
    rdsinstanceSecurityGroupId: string;
    readreplicaSecurityGroupId: string;
    ec2bastionSecurityGroupId: string;
    secretslambdaSecurityGroupId: string;
    tcpPort: number;
}

export interface CloudwatchConfig {
    cpuUtilzThreshold: number;
    wrteIopsThreshold: number;
    cpuUtilzPeriod: number;
    wrteIopsPeriod: number;
    cpuUtilzEvaluationPeriod: number;
    wrteIopsEvaluationPeriod: number;
}

export interface SecretsManagerConfig {
    passwordLength: number;
    excludePunctuation: boolean;
    generateStringKey: string;
    scheduleRotateDays: number;
    lambdaScheduleRotateFunc: string;
}

export interface Config {
    host: string;
    awsConsole: string;
    vpc: VpcConfig;
    webInstance: InstanceConfig;
    database: DatabaseConfig;
    cloudwatchAlarms: CloudwatchConfig;
    secretsManager: SecretsManagerConfig;
    ec2Instance: Ec2InstanceConfig;
    iam: IamConfig;
}

function assert(value: any): any {
    if (!value) {
        throw new Error("Invalid string input");
    }
    return value;
}

export function getConfig(): Config {
    return {
        host: assert(process.env.HOST),
        awsConsole: assert(process.env.AWS_CONSOLE),
        vpc: {
            cidr: assert(process.env.VPC_CIDR),
            subnetPublicName: assert(process.env.VPC_SUBNET_PUBLIC_NAME),
            subnetPrivateName: assert(process.env.VPC_SUBNET_PRIVATE_NAME),
            subnetPublicCidrMask: Number(assert(process.env.VPC_SUBNET_PUBLIC_CIDR_MASK)),
            subnetPrivateCidrMask: Number(assert(process.env.VPC_SUBNET_PRIVATE_CIDR_MASK)),
            natGateways: Number(assert(process.env.VPC_NAT_GATEWAYS)),
        },
        webInstance: {
            instanceType: assert(process.env.WEB_INSTANCE_TYPE),
            volumeSize: Number(assert(process.env.WEB_INSTANCE_VOLUME_SIZE)),
            keyName: assert(process.env.WEB_INSTANCE_KEY_NAME),
        },
        database: {
            instanceType: assert(process.env.DATABASE_INSTANCE_TYPE),
            allocatedStorage: Number(assert(process.env.DATABASE_ALLOCATED_STORAGE)),
            maxAllocatedStorage: Number(assert(process.env.DATABASE_MAX_ALLOCATED_STORAGE)),
            masterUsername: assert(process.env.DATABASE_MASTER_USER_NAME),
            preferredBackupWindow: assert(process.env.DATABASE_PREFERRED_BACKUP_WINDOW),
            preferredMaintenanceWindow: assert(process.env.DATABASE_PREFERRED_MAINTENANCE_WINDOW),
            backupRetention: Number(assert(process.env.DATABASE_BACKUP_RETENTION)),
            multiAz: assert(process.env.DATABASE_MULTI_AZ) === "true",
            readReplicaEnabled: assert(process.env.DATABASE_READ_REPLICA_ENABLED) === "true",
            storageEncrypted: assert(process.env.DATABASE_STORAGE_ENCRYPTED) === "true",
            deleteAutomatedBackups: assert(process.env.DATABASE_DELETE_AUTOMATED_BACKUPS) === "true",
            deletionProtection: assert(process.env.DATABASE_DELETION_PROTECTION) === "true",
            engineVersion: assert(configProps[`${env}`][`${region}`][`${account}`].engineVersion),
            cloudwatchLogsRetention: assert(configProps[`${env}`][`${region}`][`${account}`].cloudwatchLogsRetention),
            rdsinstanceSecurityGroupId: assert(configProps[`${env}`][`${region}`][`${account}`].rdsinstanceSecurityGroupId),
            readreplicaSecurityGroupId: assert(configProps[`${env}`][`${region}`][`${account}`].readreplicaSecurityGroupId),
            ec2bastionSecurityGroupId: assert(configProps[`${env}`][`${region}`][`${account}`].ec2bastionSecurityGroupId),
            secretslambdaSecurityGroupId: assert(configProps[`${env}`][`${region}`][`${account}`].secretslambdaSecurityGroupId),
            tcpPort: Number(assert(process.env.DATABASE_TCP_PORT)),
        },
        cloudwatchAlarms: {
            cpuUtilzThreshold: Number(assert(process.env.CLOUDWATCH_ALARM_CPU_UTILZ_THRESHOLD)),
            wrteIopsThreshold: Number(assert(process.env.CLOUDWATCH_ALARM_WRTE_IOPS_THRESHOLD)),
            cpuUtilzPeriod: Number(assert(process.env.CLOUDWATCH_ALARM_CPU_UTILZ_PERIOD)),
            wrteIopsPeriod: Number(assert(process.env.CLOUDWATCH_ALARM_WRTE_IOPS_PERIOD)),
            cpuUtilzEvaluationPeriod: Number(assert(process.env.CLOUDWATCH_ALARM_CPU_UTILZ_EVALUATION_PERIOD)),
            wrteIopsEvaluationPeriod: Number(assert(process.env.CLOUDWATCH_ALARM_WRTE_IOPS_EVALUATION_PERIOD)),
        },
        secretsManager: {
            passwordLength: Number(assert(process.env.SECRETMANAGER_PASSWORD_LENGTH)),
            excludePunctuation: assert(process.env.SECRETMANAGER_EXCLUDE_PUNCTUATION) === "true",
            generateStringKey: assert(process.env.SECRETMANAGER_GENERATE_STRING_KEY),
            scheduleRotateDays: Number(assert(process.env.SECRETMANAGER_SCHEDULE_ROTATE_DAYS)),
            lambdaScheduleRotateFunc: assert(process.env.SECRETMANAGER_LAMBDA_ROTATE_FUNCTION),
        },
        ec2Instance: {
            keyName: assert(process.env.EC2_INSTANCE_KEY_NAME),
            sshPort: Number(assert(process.env.EC2_INSTANCE_SSH_PORT)),
            bastionInstanceClass: assert(configProps[`${env}`][`${region}`][`${account}`].ec2BastionInstanceClass),
            bastionInstanceSize: assert(configProps[`${env}`][`${region}`][`${account}`].ec2BastionInstanceSize),
        },
        iam: {
            userAccountName: assert(configProps[`${env}`][`${region}`][`${account}`].iamUserAccountName),
        }
    };
}

export function getConfigContext(scope: Construct, prop: string): string {
    return scope.node.tryGetContext(prop);
}

export const configPropsDev: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: 'sg-0029660ed9d7f2b93',
            readreplicaSecurityGroupId: 'sg-06c7aba440aa0e94d',
            ec2bastionSecurityGroupId: 'sg-021b67bf18034de08',
            secretslambdaSecurityGroupId: 'sg-0d7e30b362b15ded6',
            ec2BastionInstanceClass: InstanceClass.T2,
            ec2BastionInstanceSize: InstanceSize.MICRO,
            iamUserAccountName: 'ext-jmacis',
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: InstanceClass.T2,
            ec2BastionInstanceSize: InstanceSize.MICRO,
            iamUserAccountName: 'root',
        }
    },
    'us-west-2': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        }
    }
};

export const configPropsStag: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        }
    },
    'us-west-2': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        }
    }
};

export const configPropsProd: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        }
    },
    'us-west-2': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            rdsinstanceSecurityGroupId: undefined,
            readreplicaSecurityGroupId: undefined,
            ec2bastionSecurityGroupId: undefined,
            secretslambdaSecurityGroupId: undefined,
            ec2BastionInstanceClass: undefined,
            ec2BastionInstanceSize: undefined,
            iamUserAccountName: undefined,
        }
    }
};

export const configProps: { [key: string]: { [key: string]: { [key: string]: { [key: string]: any } } } } = {
    development: configPropsDev,
    staging: configPropsStag,
    production: configPropsProd
};

// console.log(configProps[`${env}`][`${region}`][`${account}`].engineVersion);
// console.log(configProps[`${env}`][`${region}`][`${account}`].cloudwatchLogsRetention);