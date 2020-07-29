import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as rds from '@aws-cdk/aws-rds';
import { parameterGroup } from '../bin/cdk-config';

export interface ParameterGroupProps {

}

export class ParameterGroupStack extends cdk.Construct {
    public readonly parameterGroup: rds.ParameterGroup;

    constructor(scope: cdk.Construct, id: string, props: ParameterGroupProps, config: Config) {
        super(scope, id);

        // create rds parameter group
        this.parameterGroup = new rds.ParameterGroup(this, 'ParameterGroup', {
            engine: rds.DatabaseInstanceEngine.postgres({
                version: config.database.engineVersion
            }),
            description: 'CloudFormation AWS RDS PostgreSQL Database Parameter Group',
        });

        // cmdline arg env
        const env = scope.node.tryGetContext('env');
        const dbParameterGroup = parameterGroup[`${env}`];
        dbParameterGroup.forEach(pg => this.parameterGroup.addParameter(pg.key, pg.value));
    }
}