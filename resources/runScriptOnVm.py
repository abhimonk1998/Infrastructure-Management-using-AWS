import boto3
import json
dynamoClient = boto3.client('dynamodb', region_name='us-east-2')
s3Client = boto3.client('s3')

table_name = 'fovus-challenge-table'
key = {
        'id': {
            'N': '7',
        }
}
# Db call to get input file names
item = dynamoClient.get_item(TableName=table_name, Key=key)
file_path = item['Item']['input_file_path']['S']
input_text = item['Item']['input_text']['S']
print("************************")
print(input_text, " extracted from ",file_path)
# parse file path to get, bucket name and file name.
parts = file_path.split('/')
# The first part should be the bucket name and the second part should be the file name
bucket_name = parts[0]
file_name = parts[1]

# download the file from S3.
response = s3Client.get_object(Bucket=bucket_name, Key=file_name)
body = response['Body']
content_bytes = body.read()
print("************************")
print(content_bytes)

content_string = content_bytes.decode('utf-8')

# Append text to the content
appended_content = content_string + "" + input_text

# Print the appended content
print("************************")
print(appended_content)

# store appended_content to an output_file.txt
output_file_path = 'output_file.txt'
with open(output_file_path, 'w') as output_file:
    output_file.write(appended_content)

# upload the outputfile.txt to s3 bucket.
# s3Client.upload_file('output_file.txt', bucket_name, 'output_file.txt')
# enter a Db record id and output_file_path
output_file_path_to_store = bucket_name+"/"+output_file_path
response = dynamoClient.update_item(
    ExpressionAttributeNames={
        '#OP': 'output_file_path'
    },
    ExpressionAttributeValues={
        ':b': {
            'S': output_file_path_to_store,
        }
    },
    Key={
        'id': {
            'N': '7',
        }
    },
    ReturnValues='ALL_NEW',
    TableName=table_name,
    UpdateExpression='SET #OP = :b',
)
print("************************")
print(response)