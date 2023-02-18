import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";

const kinesis = new KinesisClient({
  region: "ap-northeast-1",
});

async function putRecordToStream(
  streamName: string,
  partitionKey: string,
  data: object,
) {
  try {
    const result = await kinesis.send(
      new PutRecordCommand({
        Data: Buffer.from(JSON.stringify(data)),
        PartitionKey: partitionKey,
        StreamName: streamName,
      }),
    );
    console.log(
      `Successfully put record into stream ${streamName}: ${
        JSON.stringify(result)
      }`,
    );
  } catch (err) {
    console.log(`Error putting record into stream ${streamName}: ${err}`);
  }
}

// Usage
let i = 0;
setInterval(() => {
  putRecordToStream("data-stream-naruta", `partition-key-${i}`, {
    timestamp: Date.now(),
    body: `hello! ${i++}`,
  });
  i++;
}, 100);
