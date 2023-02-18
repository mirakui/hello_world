import { Kinesis } from "aws-sdk";

const STREAM_NAME = "data-stream-naruta";

async function listShards(kinesis: Kinesis, streamName: string) {
  const params = {
    StreamName: streamName,
  };

  try {
    const data = await kinesis.listShards(params).promise();
    return data.Shards;
  } catch (err) {
    console.log(`Error listing shards for stream ${streamName}: ${err}`);
  }
}

async function getShardIterator(
  kinesis: Kinesis,
  streamName: string,
  shardId: string,
) {
  const params = {
    ShardId: shardId,
    ShardIteratorType: "LATEST",
    StreamName: streamName,
  };

  try {
    const data = await kinesis.getShardIterator(params).promise();
    return data.ShardIterator;
  } catch (err) {
    console.log(
      `Error getting shard iterator for stream ${streamName} and shard ${shardId}: ${err}`,
    );
  }
}

async function readStreamFromShard(kinesis: Kinesis, shardIterator: string) {
  try {
    const data = await kinesis.getRecords({
      ShardIterator: shardIterator,
    }).promise();
    const records = data.Records;

    for (const record of records) {
      console.log(`Record Data: ${record.Data.toString()}`);
      console.log(`Partition Key: ${record.PartitionKey}`);
      console.log(`Sequence Number: ${record.SequenceNumber}`);
    }

    return data.NextShardIterator;
  } catch (err) {
    console.log(`Error reading stream from shard: ${err}`);
  }
}

(async () => {
  const kinesis = new Kinesis({
    region: "ap-northeast-1",
  });

  const shards = await listShards(kinesis, STREAM_NAME);

  if (!shards) {
    console.log("no shards found");
    return;
  }

  for (const shard of shards) {
    console.log(`Shard ID: ${shard.ShardId}`);
    const shardIterator = await getShardIterator(
      kinesis,
      STREAM_NAME,
      shard.ShardId,
    );
    if (!shardIterator) {
      console.log("no shard iterator found");
      return;
    }

    const result = await readStreamFromShard(kinesis, shardIterator);

    console.log("result: ", result);
  }
})();
