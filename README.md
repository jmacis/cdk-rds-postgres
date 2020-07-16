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
1 VPC <br />
1 Internet Gateway <br />
4 Route Table <br />
2 Private Subnets <br />
2 Public Subnets <br />
1 Security Group <br />
1 DB Instance <br />
1 DB Subnet Group <br />
1 Secret Manager <br />
1 DB Snapshot <br />

