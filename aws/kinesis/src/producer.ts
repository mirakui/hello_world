import { Kinesis } from "aws-sdk";

const kinesis = new Kinesis();

async function putRecordToStream(
  streamName: string,
  partitionKey: string,
  data: string,
) {
  const params = {
    Data: data,
    PartitionKey: partitionKey,
    StreamName: streamName,
  };

  try {
    await kinesis.putRecord(params).promise();
    console.log(`Successfully put record into stream ${streamName}`);
  } catch (err) {
    console.log(`Error putting record into stream ${streamName}: ${err}`);
  }
}

// Usage
putRecordToStream("data-stream-naruta", "partition-key", "Hello, Kinesis!");
