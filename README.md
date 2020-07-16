# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Examples
cdk synth -c env=dev --profile my-profile <br />
cdk deploy -c env=dev --profile my-profile <br />
cdk destroy -c env=dev --profile my-profile <br />

## Create Resources
1 VPC
1 Internet Gateway
4 Route Table
2 Private Subnets
2 Public Subnets
1 Security Group
1 DB Instance
1 DB Subnet Group
1 Secret Manager
1 DB Snapshot

