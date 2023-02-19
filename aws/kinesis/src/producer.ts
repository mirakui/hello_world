import {
  KinesisClient,
  PutRecordCommand,
  PutRecordCommandOutput,
} from "@aws-sdk/client-kinesis";

const kinesis = new KinesisClient({
  region: "ap-northeast-1",
});

async function putRecordToStream(
  streamName: string,
  partitionKey: string,
  data: object,
): Promise<PutRecordCommandOutput | undefined> {
  try {
    const result = await kinesis.send(
      new PutRecordCommand({
        Data: Buffer.from(JSON.stringify(data)),
        PartitionKey: partitionKey,
        StreamName: streamName,
      }),
    );
    console.debug(
      `Successfully put record into stream ${streamName}: ${
        JSON.stringify(result)
      }`,
    );
    return result;
  } catch (err) {
    console.log(`Error putting record into stream ${streamName}: ${err}`);
  }
}

// Usage
// TODO: consumer 側で shard 毎に送った数を数えて、 producer 側で送った数と一致するか確認する

async function putSampleRecords(count: number) {
  let shardSummary: { [shardId: string]: number } = {};

  for (let i = 0; i < count; i++) {
    const output = await putRecordToStream(
      "data-stream-naruta",
      `partition-key-${i}`,
      {
        timestamp: Date.now(),
        index: i,
        body: `hello! ${i}`,
      },
    );
    if (output?.ShardId) {
      shardSummary[output.ShardId] ||= 0;
      shardSummary[output.ShardId]++;
    }
  }
  return shardSummary;
}

(async () => {
  const shardSummary = await putSampleRecords(100);
  console.log("Shard Summary:", shardSummary);
})();
