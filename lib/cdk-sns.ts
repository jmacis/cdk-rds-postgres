import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as rds from '@aws-cdk/aws-rds';

export interface SnsProps {
    name: string;
    email: string;
    db: rds.DatabaseInstance;
}

export class SnsStack extends cdk.Construct {
    public readonly topic: sns.Topic;
    public readonly displayName: string = 'cdk-rds-postgres-sns';

    constructor(scope: cdk.Construct, id: string, props: SnsProps) {
        super(scope, id);

        // create sns resource
        this.topic = new sns.Topic(this, 'SnsTopic', {
            displayName: this.displayName,
            // topicName: 'cdk-rds-postgres-sns'
        });

        // subscribe to sns topic
        this.topic.addSubscription(new subs.EmailSubscription(props.email));

        // create rds cloudwatch cpu metric
        const cpuMetric = props.db.metric('CPUUtilization');
    }
}