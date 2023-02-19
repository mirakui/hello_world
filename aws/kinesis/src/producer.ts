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
// TODO: consumer 側で shard 毎に送った数を数えて、 producer 側で送った数と一致するか確認する

let i = 0;
setInterval(() => {
  putRecordToStream("data-stream-naruta", `partition-key-${i}`, {
    timestamp: Date.now(),
    body: `hello! ${i++}`,
  });
  i++;
}, 10);
