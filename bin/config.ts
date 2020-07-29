export interface CertificateConfig {
    apNortheastOneCertificateArn: string;
    usEastOneCertificateArn: string;
}

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
    diagnosisInstance: InstanceConfig;
    batchInstance: InstanceConfig;
    database: DatabaseConfig;
    certificate: CertificateConfig;
    cloudwatchAlarms: CloudwatchConfig;
    secretsManager: SecretsManagerConfig;
}

function assert(value: any): string {
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
        diagnosisInstance: {
            instanceType: assert(process.env.DIAGNOSIS_INSTANCE_TYPE),
            volumeSize: Number(assert(process.env.DIAGNOSIS_INSTANCE_VOLUME_SIZE)),
            keyName: assert(process.env.DIAGNOSIS_INSTANCE_KEY_NAME),
        },
        batchInstance: {
            instanceType: assert(process.env.BATCH_INSTANCE_TYPE),
            volumeSize: Number(assert(process.env.BATCH_INSTANCE_VOLUME_SIZE)),
            keyName: assert(process.env.BATCH_INSTANCE_KEY_NAME),
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
        },
        certificate: {
            apNortheastOneCertificateArn: assert(process.env.CERTIFICATE_ARN_AP_NORTHEAST_ONE),
            usEastOneCertificateArn: assert(process.env.CERTIFICATE_ARN_US_EAST_ONE),
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