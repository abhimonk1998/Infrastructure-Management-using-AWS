# Fovus-coding-submission-abhijeet

Fovus coding submission for AWS CDK setup

# Steps to build and deploy the project

1. run bootstrap command
2. run command: cdk cynth
3. run command: cdk deploy

# Steps to invoke API

Use the above API generated after depoloyment to make a POST request to path '/'
with body as

{
  "input_text": "Text Value",
  "input_file_path": "s3_path.file_name.txt"
}
