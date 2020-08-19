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
npm run synth:development --vpcid=require --profile=my-profile <br />
npm run diff:development --vpcid=require --profile=my-profile <br />
npm run deploy:development --vpcid=require --profile=my-profile <br />
npm run destroy:development --vpcid=require --profile=my-profile <br />

cdk synth -c env=development --profile my-profile <br />
cdk diff -c env=development --profile my-profile <br />
cdk deploy -c env=development --profile my-profile <br />
cdk destroy -c env=development --profile my-profile <br />

## Create Resources
1 Secrets Manager <br />
1 SNS Topic <br />
1 EC2 Bastion <br />
1 DB Parameter Group <br />
1 DB Instance <br />
1 DB Read Replica <br />
1 DB Instance Subnet Group <br />
1 DB Read Replica Subnet Group <br />
1 DB Instance Snapshot <br />
1 DB Read Replica Snapshot <br />

## SSH Tunnel

[ DB Master ] <br />
ssh -i ~/.ssh/\<keypair\>.pem -L \<port\>:\<rds-master-endpoint\>:\<port\> ec2-user@\<instanceId\> -vvv <br />

[ DB Read Replica ] <br />
ssh -i ~/.ssh/\<keypair\>.pem -L \<port\>:\<rds-read-replica-endpoint\>:\<port\> ec2-user@\<instanceId\> -vvv <br />