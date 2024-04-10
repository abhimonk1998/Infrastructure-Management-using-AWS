import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// will get the table name from  the request body.
// consuming the request into the function handler of lambda, table name will be taken from environment

// The following code uses the AWS SDK for JavaScript (v3).
// For more information, see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html.

const insertInTable = async (tableName, body) => {
  // parse the body into input_text and input_path and save it to DB
  const client = new DynamoDBClient({});
  const dynamo = DynamoDBDocumentClient.from(client);
  const body_json = JSON.parse(body);
  const command = new PutCommand({
    TableName: tableName,
    Item: {
      id: nanoid(),
      input_text: body_json.input_text,
      input_file_path: body_json.input_file_path,
    },
  });

  const response = await dynamo.send(command);
  console.log(response);
  return response;
};

const routeRequest = (lambdaEvent) => {
  if (lambdaEvent.httpMethod === "POST" && lambdaEvent.path === "/") {
    return handlePostRequest(lambdaEvent.body);
  }

  const error = new Error(
    `Unimplemented HTTP method: ${lambdaEvent.httpMethod}`
  );
  error.name = "UnimplementedHTTPMethodError";
  throw error;
};

const handlePostRequest = async (body) => {
  if (process.env.TABLE === "undefined") {
    const err = new Error(`No Database connected to Lambda.`);
    err.name = "MissingDataBaseName";
    throw err;
  }

  const objects = await insertInTable(process.env.TABLE, body);
  return buildResponseBody(200, objects);
};

const buildResponseBody = (status, body, headers = {}) => {
  return {
    statusCode: status,
    headers,
    body,
  };
};

export const handler = async (event) => {
  try {
    return await routeRequest(event);
  } catch (err) {
    console.error(err);

    if (err.name === "MissingBucketName") {
      return buildResponseBody(400, err.message);
    }

    if (err.name === "EmptyBucketError") {
      return buildResponseBody(204, []);
    }

    if (err.name === "UnimplementedHTTPMethodError") {
      return buildResponseBody(400, err.message);
    }

    return buildResponseBody(500, err.message || "Unknown server error");
  }
};
