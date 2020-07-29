import * as cdk from '@aws-cdk/core';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import { Config } from '../bin/config';

export interface SecretsProps {
    secretName: string;
}

export class SecretsStack extends cdk.Construct {
    public readonly secret: secretsManager.Secret;

    constructor(scope: cdk.Construct, id: string, props: SecretsProps, config: Config) {
        super(scope, id);

        this.secret = new secretsManager.Secret(this, 'Secrets', {
            secretName: props.secretName,
            description: 'CDK RDS Postgres Admin Secret',
            generateSecretString: {
                excludeCharacters: '"@/\\',
                excludePunctuation: config.secretsManager.excludePunctuation,
                passwordLength: config.secretsManager.passwordLength,
                generateStringKey: config.secretsManager.generateStringKey,
                secretStringTemplate: JSON.stringify({ username: config.database.masterUsername })
            }
        });
        //console.log('secretValueFromJson:', cdk.Token.asString(this.secret.secretValueFromJson('password')));
        // console.log('secretArn:', this.secret.secretArn);
    }
}