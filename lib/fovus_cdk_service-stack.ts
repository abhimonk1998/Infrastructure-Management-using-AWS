import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as widget_service_fovus from '../lib/widget_service';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FovusCdkServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new widget_service_fovus.WidService(this, 'Wid'); // Add the app/service to the deployment stack/metadata
    

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'FovusCdkServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
