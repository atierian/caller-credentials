import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
});

const todoTableArn = backend.data.resources.tables['Todo'].tableArn;

const policyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'dynamodb:PutItem',
    'dynamodb:DeleteItem',
    'dynamodb:GetItem',
    'dynamodb:Scan',
    'dynamodb:Query',
    'dynamodb:UpdateItem',
    'dynamodb:ConditionCheckItem',
    'dynamodb:DescribeTable',
    'dynamodb:GetRecords',
    'dynamodb:GetShardIterator'
  ],
  resources: [
    todoTableArn
  ],
  conditions: {
    'ForAllValues:StringEquals': {
      'dynamodb:LeadingKeys': [
        '${cognito-identity.amazonaws.com:sub}'
      ],
      // Not actually necessary, but doing this to demonstrate that FAS is being used behind the scenes.
      // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-viaawsservice
      'aws:ViaAWSService': true
    }
  }
});

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  new Policy(backend.stack, 'TodoAuthenticatedAccess', {
    statements: [policyStatement]
  })
);

backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  new Policy(backend.stack, 'TodoUnauthenticatedAccess', {
    statements: [policyStatement]
  })
);

// https://docs.aws.amazon.com/appsync/latest/APIReference/API_DynamodbDataSourceConfig.html
backend.data.resources.cfnResources.cfnDataSources['TodoTable'].addPropertyOverride('DynamoDBConfig', {
  UseCallerCredentials: true
});