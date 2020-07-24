#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
// import { CdkRdsPostgresStack } from '../lib/cdk-rds-postgres-stack';
import { CdkRdsStack } from '../lib/cdk-rds-stack';
import { Tag } from '@aws-cdk/core';
// import { stackTags as stackTagsDev } from './cdk-config-dev';
// import { stackTags as stackTagsStag } from './cdk-config-stag';
// import { stackTags as stackTagsProd } from './cdk-config-prod';
import { stackTagsDev, stackTagsStag, stackTagsProd } from './cdk-tag-config';
import { getConfig } from './config';

const app = new cdk.App();

const env = app.node.tryGetContext('env') || process.env.NODE_ENV || 'development';
if (env === undefined) {
    throw new Error('env must be passed in command argument');
}

const config = getConfig();
const stack = new CdkRdsStack(app, 'CdkRdsPostgresStack', {
    env: {
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    description: "CDK RDS Postgres Stack"
}, config);

// const stack = new CdkRdsPostgresStack(app, 'CdkRdsPostgresStack', {
//     env: {
//         account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
//         region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
//     },
//     description: "CDK RDS Postgres Stack"
// });

// apply tags to stack
const stackTags = env === 'development' ? stackTagsDev : (env === 'staging' ? stackTagsStag : stackTagsProd);
stackTags.forEach(tag => Tag.add(stack, tag.name, tag.value));