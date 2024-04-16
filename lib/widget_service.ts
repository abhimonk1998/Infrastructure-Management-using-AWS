import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as dydb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import * as eventsources from "aws-cdk-lib/aws-lambda-event-sources";
import * as iam from "aws-cdk-lib/aws-iam";

export class WidService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // create API.

    // create Lambda.

    // create S3 object.
    // const bucket = new s3.Bucket(this, "FileStore");
    const lambdaRole = new iam.Role(this, "MyLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      // Other role configuration options
    });

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "ec2:CreateKeyPair", // Add other SSM actions if needed
          "ec2:DescribeKeyPairs",
        ],
        resources: ["*"], // Restrict this to specific SSM resources if possible
      })
    );

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "ec2:DescribeSecurityGroups", // Add other SSM actions if needed
          "ec2:CreateSecurityGroup",
        ],
        resources: ["*"], // Restrict this to specific SSM resources if possible
      })
    );

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          "ec2:RunInstances", // Add other SSM actions if needed
          "ec2:StopInstances",
          "ec2:StartInstances",
          "ec2:DescribeInstances",
          "ec2:DescribeInstanceStatus",
          "ec2:TerminateInstances",
        ],
        resources: ["*"], // Restrict this to specific SSM resources if possible
      })
    );

    // create DynamoDB.
    const dbTableName = new dydb.Table(this, "WidFovusTable", {
      partitionKey: { name: "id", type: dydb.AttributeType.STRING },
      stream: dydb.StreamViewType.NEW_IMAGE,
    });

    //create Lambda function
    const handler = new NodejsFunction(this, "WidHandler", {
      runtime: lambda.Runtime.NODEJS_18_X, // runtime config
      entry: path.join(__dirname, "/../resources/widgets.js"),
      environment: {
        TABLE: dbTableName.tableName,
      },
    });

    // Trigger generate
    // connect to DB, onAction: Insertion of record.
    const func = new NodejsFunction(this, "VmInvocationFunc", {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "/../resources/vmInvocationFunction.js"),
      role: lambdaRole,
    });

    func.addEventSource(
      new eventsources.DynamoEventSource(dbTableName, {
        startingPosition: lambda.StartingPosition.LATEST,
        filters: [
          lambda.FilterCriteria.filter({
            eventName: lambda.FilterRule.isEqual("INSERT"),
          }),
        ],
      })
    );

    // ****** Workaround design of the code ********
    // can I by pass the UI code for now.
    // I'll manually upload the file and records in the cdk created DB.
    // This will set the trigger to run and rest of the flow will be executed.
    // Basically manual tasks are to be automated using the cdk.

    dbTableName.grantReadWriteData(handler);

    // Task 1: request to API,
    // API forwarded to Lambda, (Route integration with Lambda)
    // Lambda inserts record in DB (DB grant read Write to Lambda)

    const api = new apigateway.RestApi(this, "fovus-api", {
      restApiName: "Fovus Api Service",
      description: "This service stores data to Db.",
    });

    const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    // Routes integration with lambda.
    api.root.addMethod("POST", getWidgetsIntegration); // POST /
  }
}
