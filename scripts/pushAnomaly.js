const connectClient = require("../prisma/client");

async function main() {
  connectClient(async (db) => {
    const createdMachines = await db.machine.findMany({});
    const createdStatuses = await db.status.findMany({});

    await db.anomaly.create({
      data: {
        machineId: createdMachines[0].id,
        statusId:
          createdStatuses[getRandomNumber(0, createdStatuses.length - 1)].id,
        sensor: "0000000000",
        clip: `/anomalies/${getRandomNumber(0, 6)}.wav`,
      },
    });
  });
}

main();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
