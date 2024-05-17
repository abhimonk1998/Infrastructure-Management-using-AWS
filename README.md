# Fovus-coding-submission-abhijeet

Coding challenge for AWS CDK setup

# Steps to build and deploy the project

1. run bootstrap command
2. run command: cdk synth
3. run command: cdk deploy

# Steps to invoke API

Use the above API generated after depoloyment to make a POST request to path '/'
with body as

{
  "input_text": "Text Value",
  "input_file_path": "s3_path.file_name.txt"
}

# Resources used to make the project

Resources:

https://docs.amazonaws.cn/en_us/apigateway/latest/developerguide/http-api-dynamo-db.html
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.Tutorial2.html
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/streamsmain.html
https://aws.plainenglish.io/create-ec2-instances-with-lambda-a0a885e2b295

AWS lambda function to call scripts: 

https://docs.aws.amazon.com/lambda/latest/dg/python-logging.html

AWS boto3 python sdk docs: 
https://boto3.amazonaws.com/v1/documentation/api/latest/guide/index.html 
https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/get_object.html
https://docs.aws.amazon.com/ec2/latest/devguide/example_ec2_RunInstances_section.html 

CDK infra management:
https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html 
https://docs.aws.amazon.com/cdk/v2/guide/serverless_example.html 

JS SDK V3: (Referred VM creation using aws-sdk JS Code)
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html 
https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources.StreamEventSource.html 
https://docs.aws.amazon.com/ec2/latest/devguide/example_ec2_Scenario_GetStartedInstances_section.html 
