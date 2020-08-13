#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
// import { CdkRdsPostgresStack } from '../lib/cdk-rds-postgres-stack';
import { CdkRdsStack } from '../lib/cdk-rds-stack';
import { Tag } from '@aws-cdk/core';
import { stackTags } from './cdk-config';
import { getConfig } from './config';

const app = new cdk.App();

const env: string | undefined = app.node.tryGetContext('env') || process.env.NODE_ENV || 'development';
const vpcId: string | undefined = app.node.tryGetContext('vpcid');
if (!env || env === undefined) {
    throw new Error('env must be passed in command argument');
}

if (!vpcId || vpcId === undefined) {
    throw new Error('vpcid must be passed in command argument');
}

if (process.env.CDK_DEPLOY_ACCOUNT === undefined) {
    throw new Error('CDK_DEPLOY_ACCOUNT must be set environment');
}

if (process.env.CDK_DEPLOY_REGION === undefined) {
    throw new Error('CDK_DEPLOY_REGION must be set environment');
}

const config = getConfig();
const stack = new CdkRdsStack(app, 'CdkRdsPostgresStack', {
    env: {
        account: app.node.tryGetContext('account') || process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
        region: app.node.tryGetContext('region') || process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION
    },
    description: "CDK RDS Postgres Stack"
}, config);

// apply tags to stack
stackTags[`${env}`].forEach(tag => Tag.add(stack, tag.name, tag.value));
