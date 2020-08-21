import * as cdk from '@aws-cdk/core';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import * as iam from '@aws-cdk/aws-iam';
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

        // create iam policy statement limiting actions
        const secretStatement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            // principals: [new iam.AnyPrincipal()],
            principals: [new iam.ArnPrincipal(`arn:aws:iam::${process.env.CDK_DEPLOY_ACCOUNT}:user/ext-jmacis`)],
            actions: [
                'secretsmanager:Describe*',
                'secretsmanager:Get*',
                'secretsmanager:List*'
            ],
            resources: [this.secret.secretArn]
        });

        this.secret.addToResourcePolicy(secretStatement);

        // // create iam policy statement to specific secret
        // const secretStatement2 = new iam.PolicyStatement({
        //     effect: iam.Effect.ALLOW,
        //     principals: [new iam.ServicePrincipal('secretsmanager.amazonaws.com')],
        //     // principals: [new iam.AnyPrincipal()],
        //     actions: [
        //         'secretsmanager:*',
        //     ],
        //     resources: [
        //         this.secret.secretArn
        //     ]
        // });

        // this.secret.addToResourcePolicy(secretStatement2);

        // // create iam policy statement to specific secret
        // const secretStatement3 = new iam.PolicyStatement({
        //     effect: iam.Effect.ALLOW,
        //     principals: [new iam.ArnPrincipal(`arn:aws:iam::${process.env.CDK_DEPLOY_ACCOUNT}:user/ext-jmacis`)],
        //     actions: [
        //         'secretsmanager:Describe*',
        //         'secretsmanager:Get*',
        //         'secretsmanager:List*'
        //     ],
        //     resources: [this.secret.secretArn]
        // });

        // this.secret.addToResourcePolicy(secretStatement3);

        // create cfn output secrets arn
        new cdk.CfnOutput(this, 'SecretsManagerArn', {
            description: 'CDK RDS Secrets Manager Arn',
            value: this.secret.secretArn
        });

        // console.log('secretValueFromJson:', cdk.Token.asString(this.secret.secretValueFromJson('password')));
        // console.log('secretArn:', this.secret.secretArn);
    }
}