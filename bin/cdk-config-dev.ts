
// Structure for tagging objects created
interface Tag {
    name: string;
    value: string;
}

export const stackTags: { name: string, value: string }[] = [
    { name: 'AppName', value: 'test-rds-postgres-db' },
    { name: 'CostCenter', value: '1000' },
    { name: 'StackName', value: 'CDK-RDS-POSTGRES-DB' },
    { name: 'StackOwner', value: 'John Macis' },
    { name: 'Env', value: 'Development' }
];