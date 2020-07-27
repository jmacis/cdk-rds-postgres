
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
    { key: 'idle_in_transaction_session_timeout', value: '7200000' },
    { key: 'statement_timeout', value: '7200000' }
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
    { key: 'idle_in_transaction_session_timeout', value: '7200000' },
    { key: 'statement_timeout', value: '7200000' }
];

// export const parameterGroupDev: { [key: string]: string } = {
//     'shared_preload_libraries': 'auto_explain,pg_stat_statements,pg_hint_plan,pgaudit',
//     'log_statement': 'ddl',
//     'log_connections': '1',
//     'log_disconnections': '1',
//     'log_lock_waits': '1',
//     'log_min_duration_statement': '5000',
//     'auto_explain.log_min_duration': '5000',
//     'auto_explain.log_verbose': '1',
//     'log_rotation_age': '1440',
//     'log_rotation_size': '102400',
//     'rds.log_retention_period': '10080',
//     'random_page_cost': '1',
//     'track_activity_query_size': '16384',
//     'idle_in_transaction_session_timeout': '7200000',
//     'statement_timeout': '7200000'
// };
