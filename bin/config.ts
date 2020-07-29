import { Construct } from '@aws-cdk/core';
import { PostgresEngineVersion } from '@aws-cdk/aws-rds';
import { RetentionDays } from '@aws-cdk/aws-logs';

const env: string | undefined = process.env.NODE_ENV;
const region: string | undefined = process.env.CDK_DEPLOY_REGION;
const account: string | undefined = process.env.CDK_DEPLOY_ACCOUNT;

export interface VpcConfig {
    cidr: string;
    subnetPublicName: string;
    subnetPrivateName: string;
    subnetPublicCidrMask: number;
    subnetPrivateCidrMask: number;
}

export interface InstanceConfig {
    instanceType: string;
    volumeSize: number;
    keyName: string;
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
    engineVersion: PostgresEngineVersion;
    cloudwatchLogsRetention: RetentionDays;
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
}

export interface Config {
    host: string;
    vpc: VpcConfig;
    webInstance: InstanceConfig;
    database: DatabaseConfig;
    cloudwatchAlarms: CloudwatchConfig;
    secretsManager: SecretsManagerConfig;
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
        vpc: {
            cidr: assert(process.env.VPC_CIDR),
            subnetPublicName: assert(process.env.VPC_SUBNET_PUBLIC_NAME),
            subnetPrivateName: assert(process.env.VPC_SUBNET_PRIVATE_NAME),
            subnetPublicCidrMask: Number(assert(process.env.VPC_SUBNET_PUBLIC_CIDR_MASK)),
            subnetPrivateCidrMask: Number(assert(process.env.VPC_SUBNET_PRIVATE_CIDR_MASK)),
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
            engineVersion: assert(configProps[`${env}`][`${region}`][`${account}`].engineVersion),
            cloudwatchLogsRetention: assert(configProps[`${env}`][`${region}`][`${account}`].cloudwatchLogsRetention),
            // engineVersion: assert(dbEngineVersion[`${env}`][`${region}`][`${account}`]),
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
        }
    };
}

export function getConfigContext(scope: Construct, prop: string): string {
    return scope.node.tryGetContext(prop);
}

export const dbEngineVersionDev: { [key: string]: { [key: string]: PostgresEngineVersion } } = {
    'us-east-1': {
        '009963118558': PostgresEngineVersion.VER_11_7,
        '083258740834': PostgresEngineVersion.VER_11_7,
    },
    'us-west-2': {
        '009963118558': PostgresEngineVersion.VER_11_7,
        '083258740834': PostgresEngineVersion.VER_11_7,
    }
};

export const dbEngineVersionStag: { [key: string]: { [key: string]: PostgresEngineVersion } } = {
    'us-east-1': {
        '009963118558': PostgresEngineVersion.VER_11_6,
        '083258740834': PostgresEngineVersion.VER_11_6,
    },
    'us-west-2': {
        '009963118558': PostgresEngineVersion.VER_11_6,
        '083258740834': PostgresEngineVersion.VER_11_6,
    }
};

export const dbEngineVersionProd: { [key: string]: { [key: string]: PostgresEngineVersion } } = {
    'us-east-1': {
        '009963118558': PostgresEngineVersion.VER_11_6,
        '083258740834': PostgresEngineVersion.VER_11_6,
    },
    'us-west-2': {
        '009963118558': PostgresEngineVersion.VER_11_6,
        '083258740834': PostgresEngineVersion.VER_11_6,
    }
};

// db engine version mapping
export const dbEngineVersion: { [key: string]: { [key: string]: { [key: string]: PostgresEngineVersion } } } = {
    development: dbEngineVersionDev,
    staging: dbEngineVersionStag,
    production: dbEngineVersionProd
};

export const configPropsDev: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: 'hello',
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: '',
        }
    },
    'us-west-2': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: '',
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_7,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: '',
        }
    }
};

export const configPropsStag: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: '',
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: '',
        }
    },
    'us-west-2': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: '',
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.ONE_MONTH,
            fooBar: '',
        }
    }
};


export const configPropsProd: { [key: string]: { [key: string]: { [key: string]: any } } } = {
    'us-east-1': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            fooBar: '',
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            fooBar: '',
        }
    },
    'us-west-2': {
        '009963118558': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            fooBar: '',
        },
        '083258740834': {
            engineVersion: PostgresEngineVersion.VER_11_6,
            cloudwatchLogsRetention: RetentionDays.SIX_MONTHS,
            fooBar: '',
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