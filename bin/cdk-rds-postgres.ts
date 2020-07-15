#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkRdsPostgresStack } from '../lib/cdk-rds-postgres-stack';

const app = new cdk.App();
new CdkRdsPostgresStack(app, 'CdkRdsPostgresStack');
