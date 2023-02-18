import {
  GetRecordsCommand,
  GetShardIteratorCommand,
  GetShardIteratorInput,
  Kinesis,
  KinesisClient,
  ListShardsCommand,
} from "@aws-sdk/client-kinesis";

const STREAM_NAME = "data-stream-naruta";

async function listShards(kinesis: KinesisClient, streamName: string) {
  const params = {
    StreamName: streamName,
  };

  try {
    const data = await kinesis.send(new ListShardsCommand(params));
    return data.Shards;
  } catch (err) {
    console.log(`Error listing shards for stream ${streamName}: ${err}`);
  }
}

async function getShardIterator(
  kinesis: KinesisClient,
  streamName: string,
  shardId: string,
) {
  const params = {
    ShardId: shardId,
    ShardIteratorType: "LATEST",
    StreamName: streamName,
  };

  try {
    const data = await kinesis.send(new GetShardIteratorCommand(params));
    return data.ShardIterator;
  } catch (err) {
    console.log(
      `Error getting shard iterator for stream ${streamName} and shard ${shardId}: ${err}`,
    );
  }
}

async function readAllFromShard(kinesis: KinesisClient, shardName: string) {
  console.log(`[${shardName}] start reading`);
  var shardIterator = await getShardIterator(kinesis, STREAM_NAME, shardName);
  while (shardIterator) {
    console.log(`[${shardName}] --- reading...`);

    const data = await kinesis.send(
      new GetRecordsCommand({
        ShardIterator: shardIterator,
      }),
    );
    const records = data.Records;

    if (records && records.length > 0) {
      for (const record of records) {
        const data = record.Data
          ? JSON.parse(new TextDecoder().decode(record.Data))
          : null;
        console.log(`[${shardName}] Record Data:`, data);
        console.log(`[${shardName}] Partition Key:`, record.PartitionKey);
        console.log(`[${shardName}] Sequence Number:`, record.SequenceNumber);
      }
    } else {
      // console.log(`[${shardName}] no records`);
      // break;
    }

    shardIterator = data.NextShardIterator;
  }
  console.log(`[${shardName}] finished reading`);
}

(async () => {
  console.log("start");

  const kinesis = new KinesisClient({
    region: "ap-northeast-1",
  });

  const shards = await listShards(kinesis, STREAM_NAME);

  if (shards) {
    console.log(`${shards.length} shards found`);
  } else {
    console.log("no shards found");
    return;
  }

  setInterval(() => {
    for (const shard of shards) {
      console.log(`Shard ID: ${shard.ShardId}`);
      if (shard?.ShardId) {
        readAllFromShard(kinesis, shard.ShardId);
      }
    }
  }, 5000);

  console.log("all finished");
})();
