
// structure for tagging objects created
interface Tag {
    name: string;
    value: string;
}

export const stackTagsDev: { name: string, value: string }[] = [
    { name: 'AppName', value: 'test-rds-postgres-db' },
    { name: 'CostCenter', value: '1000' },
    { name: 'StackName', value: 'CDK-RDS-POSTGRES-DB' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Development' }
];

export const stackTagsStag: { name: string, value: string }[] = [
    { name: 'App_Name', value: 'test-rds-postgres-db' },
    { name: 'CostCenter', value: '2000' },
    { name: 'StackName', value: 'CDK-RDS-POSTGRES-DB' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Staging' }
];

export const stackTagsProd: { name: string, value: string }[] = [
    { name: 'App_Name', value: 'test-rds-postgres-db' },
    { name: 'CostCenter', value: '3000' },
    { name: 'StackName', value: 'CDK-RDS-POSTGRES-DB' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Production' }
];

// stack tags
export const stackTags: { [name: string]: { name: string, value: string }[] } = {
    development: stackTagsDev,
    staging: stackTagsStag,
    production: stackTagsProd
};

export const parameterGroupDev: { key: string, value: string }[] = [
    { key: 'shared_preload_libraries', value: 'auto_explain,pg_stat_statements,pg_hint_plan,pgaudit' },
    { key: 'log_statement', value: 'ddl' },
    { key: 'log_connections', value: '1' },
    { key: 'log_disconnections', value: '1' },
    { key: 'log_lock_waits', value: '1' },
    { key: 'log_min_duration_statement', value: '5000' },
    { key: 'auto_explain.log_min_duration', value: '5000' },
    { key: 'auto_explain.log_verbose', value: '1' },
    { key: 'log_rotation_age', value: '1440' },
    { key: 'log_rotation_size', value: '102400' },
    { key: 'rds.log_retention_period', value: '10080' },
    { key: 'random_page_cost', value: '1' },
    { key: 'track_activity_query_size', value: '16384' },
    { key: 'idle_in_transaction_session_timeout', value: '7200000' },
    { key: 'statement_timeout', value: '7200000' }
];

export const parameterGroupStag: { key: string, value: string }[] = [
    { key: 'shared_preload_libraries', value: 'auto_explain,pg_stat_statements,pg_hint_plan,pgaudit' },
    { key: 'log_statement', value: 'ddl' },
    { key: 'log_connections', value: '1' },
    { key: 'log_disconnections', value: '1' },
    { key: 'log_lock_waits', value: '1' },
    { key: 'log_min_duration_statement', value: '5000' },
    { key: 'auto_explain.log_min_duration', value: '5000' },
    { key: 'auto_explain.log_verbose', value: '1' },
    { key: 'log_rotation_age', value: '1440' },
    { key: 'log_rotation_size', value: '102400' },
    { key: 'rds.log_retention_period', value: '10080' },
    { key: 'random_page_cost', value: '1' },
    { key: 'track_activity_query_size', value: '16384' },
    { key: 'idle_in_transaction_session_timeout', value: '60000' },
    { key: 'statement_timeout', value: '60000' }
];

export const parameterGroupProd: { key: string, value: string }[] = [
    { key: 'shared_preload_libraries', value: 'auto_explain,pg_stat_statements,pg_hint_plan,pgaudit' },
    { key: 'log_statement', value: 'ddl' },
    { key: 'log_connections', value: '1' },
    { key: 'log_disconnections', value: '1' },
    { key: 'log_lock_waits', value: '1' },
    { key: 'log_min_duration_statement', value: '5000' },
    { key: 'auto_explain.log_min_duration', value: '5000' },
    { key: 'auto_explain.log_verbose', value: '1' },
    { key: 'log_rotation_age', value: '1440' },
    { key: 'log_rotation_size', value: '102400' },
    { key: 'rds.log_retention_period', value: '10080' },
    { key: 'random_page_cost', value: '1' },
    { key: 'track_activity_query_size', value: '16384' },
    { key: 'idle_in_transaction_session_timeout', value: '50000' },
    { key: 'statement_timeout', value: '50000' }
];

// db parameter group
export const parameterGroup: { [key: string]: { key: string, value: string }[] } = {
    development: parameterGroupDev,
    staging: parameterGroupStag,
    production: parameterGroupProd
};

// export const kmsKeysDev: { [key: string]: string } = {
//     '009963118558': '80681ad6-9014-4626-87b1-22621d9475ce',
//     '083258740834': '1184ade0-b88a-411e-ac5c-b9361a5dd40e'
// };

// export const kmsKeysStag: { [key: string]: string } = {
//     '009963118558': '80681ad6-9014-4626-87b1-22621d9475ce',
//     '083258740834': '1184ade0-b88a-411e-ac5c-b9361a5dd40e'
// };

// export const kmsKeysProd: { [key: string]: string } = {
//     '009963118558': '80681ad6-9014-4626-87b1-22621d9475ce',
//     '083258740834': '1184ade0-b88a-411e-ac5c-b9361a5dd40e'
// };

// export const kmsKeys: { [key: string]: { [key: string]: string } } = {
//     development: kmsKeysDev,
//     staging: kmsKeysStag,
//     production: kmsKeysProd
// };

export const kmsKeysDev: { [key: string]: { [key: string]: string } } = {
    'us-east-1': {
        '009963118558': 'arn:aws:kms:us-east-1:009963118558:key/80681ad6-9014-4626-87b1-22621d9475ce',
        '083258740834': 'arn:aws:kms:us-east-1:083258740834:key/1184ade0-b88a-411e-ac5c-b9361a5dd40e'
    },
    'us-west-2': {
        '009963118558': 'arn:aws:kms:us-east-1:009963118558:key/80681ad6-9014-4626-87b1-22621d9475ce',
        '083258740834': 'arn:aws:kms:us-east-1:083258740834:key/1184ade0-b88a-411e-ac5c-b9361a5dd40e'
    }
};

export const kmsKeysStag: { [key: string]: { [key: string]: string } } = {
    'us-east-1': {
        '009963118558': 'arn:aws:kms:us-east-1:009963118558:key/80681ad6-9014-4626-87b1-22621d9475ce',
        '083258740834': 'arn:aws:kms:us-east-1:083258740834:key/1184ade0-b88a-411e-ac5c-b9361a5dd40e'
    },
    'us-west-2': {
        '009963118558': 'arn:aws:kms:us-east-1:009963118558:key/80681ad6-9014-4626-87b1-22621d9475ce',
        '083258740834': 'arn:aws:kms:us-east-1:083258740834:key/1184ade0-b88a-411e-ac5c-b9361a5dd40e'
    }
};

export const kmsKeysProd: { [key: string]: { [key: string]: string } } = {
    'us-east-1': {
        '009963118558': 'arn:aws:kms:us-east-1:009963118558:key/80681ad6-9014-4626-87b1-22621d9475ce',
        '083258740834': 'arn:aws:kms:us-east-1:083258740834:key/1184ade0-b88a-411e-ac5c-b9361a5dd40e'
    },
    'us-west-2': {
        '009963118558': 'arn:aws:kms:us-east-1:009963118558:key/80681ad6-9014-4626-87b1-22621d9475ce',
        '083258740834': 'arn:aws:kms:us-east-1:083258740834:key/1184ade0-b88a-411e-ac5c-b9361a5dd40e'
    }
};

// managed kms keys
export const kmsKeys: { [key: string]: { [key: string]: { [key: string]: string } } } = {
    development: kmsKeysDev,
    staging: kmsKeysStag,
    production: kmsKeysProd
};
