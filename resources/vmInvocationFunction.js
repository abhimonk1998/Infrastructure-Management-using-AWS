import {
  EC2Client,
  CreateKeyPairCommand,
  CreateSecurityGroupCommand,
  RunInstancesCommand,
  DescribeKeyPairsCommand,
  DescribeSecurityGroupsCommand,
  TerminateInstancesCommand,
  waitUntilInstanceTerminated,
} from "@aws-sdk/client-ec2";
const ec2Client = new EC2Client();

const createKeyPair = async (keyPairName) => {
  // Create a key pair in Amazon EC2.
  const { KeyMaterial, KeyPairId } = await ec2Client.send(
    // A unique name for the key pair. Up to 255 ASCII characters.
    new CreateKeyPairCommand({ KeyName: keyPairName })
  );

  console.log(KeyPairId);
  return KeyPairId;
};

const createSecurityGroup = async (securityGroupName) => {
  const command = new CreateSecurityGroupCommand({
    GroupName: securityGroupName,
    Description: "A security group for the Amazon EC2 example.",
  });
  const { GroupId } = await ec2Client.send(command);
  return GroupId;
};
const describeKeyPair = async (keyPairName) => {
  const command = new DescribeKeyPairsCommand({
    KeyNames: [keyPairName],
  });
  const { KeyPairs } = await ec2Client.send(command);
  return KeyPairs[0];
};
const describeSecurityGroup = async (securityGroupName) => {
  const command = new DescribeSecurityGroupsCommand({
    GroupNames: [securityGroupName],
  });
  const { SecurityGroups } = await ec2Client.send(command);

  return SecurityGroups[0];
};

const terminateInstance = async (instanceId) => {
  const command = new TerminateInstancesCommand({
    InstanceIds: [instanceId],
  });

  try {
    await ec2Client.send(command);
    await waitUntilInstanceTerminated(
      { client: ec2Client },
      { InstanceIds: [instanceId] }
    );
    console.log(`Instance with ID ${instanceId} terminated.\n`);
  } catch (err) {
    console.warn(`Failed to terminate instance ${instanceId}.`, err);
  }
};

export const handler = async () => {
  const keyPairName = "ec2-fovus-key-pair-10";
  const securityGroupName = "ec2-fovus-security-group-10";
  let keyPairId = await createKeyPair(keyPairName);
  let securityGroupId = await createSecurityGroup(securityGroupName);
  const { KeyName } = await describeKeyPair(keyPairName);
  const command = new RunInstancesCommand({
    KeyName: KeyName,
    SecurityGroupIds: [securityGroupId],
    ImageId: "ami-0900fe555666598a2",
    InstanceType: "t2.micro",
    MinCount: 1,
    MaxCount: 1,
  });

  try {
    const createResponse = await ec2Client.send(command);
    instanceId = createResponse["Instances"][0]["InstanceId"];
    // instanceId = await ec2Client.send(command);
  } catch (err) {
    console.error(err);
  } finally {
    // Clean up.
    console.log("Clean up.");
    await terminateInstance(instanceId);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
