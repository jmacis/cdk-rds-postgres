import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import cloudwatch_actions = require('@aws-cdk/aws-cloudwatch-actions')
import * as rds from '@aws-cdk/aws-rds';

export interface SnsCloudWatchProps {
    email: string;
    db: rds.DatabaseInstance;
}

export class CloudWatchStack extends cdk.Construct {
    public readonly topic: sns.Topic;
    public readonly displayName: string = 'cdk-rds-postgres-sns';
    public readonly cpuMetric: cloudwatch.Metric;
    public readonly iopsMetric: cloudwatch.Metric;

    constructor(scope: cdk.Construct, id: string, props: SnsCloudWatchProps) {
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
            evaluationPeriods: 2,
            metric: this.cpuMetric,
            threshold: 75,
            period: cdk.Duration.seconds(300)
        });

        // add rds cpu alarm to sns topic
        cpuAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.topic));

        // create rds cloudwatch iopsWrite metric
        this.iopsMetric = props.db.metric('WriteIOPS');

        // create iops cloudwatch alarm
        const iopsAlarm = new cloudwatch.Alarm(this, 'IopsAlarm', {
            evaluationPeriods: 2,
            metric: this.iopsMetric,
            threshold: 7000,
            statistic: 'max',
            period: cdk.Duration.seconds(60)
        });

        // add rds iops alarm to sns topic
        iopsAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(this.topic));
    }
}