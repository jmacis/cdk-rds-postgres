import * as cdk from '@aws-cdk/core';
import { Config } from '../bin/config';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cloudwatch_actions from '@aws-cdk/aws-cloudwatch-actions';
import * as rds from '@aws-cdk/aws-rds';

export interface SnsCloudWatchProps {
    db: rds.DatabaseInstance;
    email: string;
}

export class CloudWatchStack extends cdk.Construct {
    public readonly topic: sns.Topic;
    public readonly displayName: string = 'cdk-rds-postgres-sns';
    public readonly cpuMetric: cloudwatch.Metric;
    public readonly iopsMetric: cloudwatch.Metric;

    constructor(scope: cdk.Construct, id: string, props: SnsCloudWatchProps, config: Config) {
        super(scope, id);

        // create sns resource
        this.topic = new sns.Topic(this, 'SnsTopic', {
            displayName: this.displayName,
            // topicName: 'cdk-rds-postgres-sns'
        });

        // subscribe to sns topic
        this.topic.addSubscription(new subs.EmailSubscription(props.email));

        // create rds cloudwatch cpu metric
        this.cpuMetric = props.db.metric('CPUUtilization');

        // create cpu cloudwatch alarm
        const cpuAlarm = new cloudwatch.Alarm(this, 'CpuAlarm', {
            evaluationPeriods: config.cloudwatchAlarms.cpuUtilzEvaluationPeriod,
            metric: this.cpuMetric,
            threshold: config.cloudwatchAlarms.cpuUtilzThreshold,
            period: cdk.Duration.seconds(config.cloudwatchAlarms.cpuUtilzPeriod)
        });

        // add rds cpu alarm to sns topic
        cpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.topic));

        // create rds cloudwatch iopsWrite metric
        this.iopsMetric = props.db.metric('WriteIOPS');

        // create iops cloudwatch alarm
        const iopsAlarm = new cloudwatch.Alarm(this, 'IopsAlarm', {
            evaluationPeriods: config.cloudwatchAlarms.wrteIopsEvaluationPeriod,
            metric: this.iopsMetric,
            threshold: config.cloudwatchAlarms.wrteIopsThreshold,
            statistic: 'max',
            period: cdk.Duration.seconds(config.cloudwatchAlarms.wrteIopsPeriod)
        });

        // add rds iops alarm to sns topic
        iopsAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.topic));

        // create cfn output sns topic
        new cdk.CfnOutput(this, 'SnsTopicOutput', {
            description: 'CDK SNS Topic',
            value: `https://console.aws.amazon.com/sns/home?region=${this.topic.stack.region}#/topic/${this.topic.topicArn}`
        });
    }
}