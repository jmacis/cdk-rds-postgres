// tructure for tagging objects created
interface Tag {
    name: string;
    value: string;
}

export const stackTags: { name: string, value: string }[] = [
    { name: 'App_Name', value: 'test-rds-postgres-db' },
    { name: 'CostCenter', value: '2000' },
    { name: 'StackName', value: 'CCDK-RDS-POSTGRES-DB' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Staging' }
]