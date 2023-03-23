const connectClient = require("../prisma/client");

async function main() {
  connectClient(async (db) => {
    await db.machine.deleteMany({});
    await db.status.deleteMany({});
    await db.reason.deleteMany({});
    await db.action.deleteMany({});
    await db.anomaly.deleteMany({});

    const machines = [
      {
        name: "cnc",
        label: "CNC Machine",
      },
      {
        name: "milling",
        label: "Milling Machine",
      },
    ];

    await db.machine.createMany({
      data: machines,
    });

    const createdMachines = await db.machine.findMany({});

    const statuses = [
      {
        name: "mild",
        label: "Mild",
      },
      {
        name: "moderate",
        label: "Moderate",
      },
      {
        name: "severe",
        label: "Severe",
      },
    ];

    await db.status.createMany({
      data: statuses,
    });

    const createdStatuses = await db.status.findMany({});

    const anomalies = [
      {
        machineId: createdMachines[0].id,
        statusId: createdStatuses[0].id,
        sensor: "1234567890",
        clip: "/anomalies/1.wav",
      },
      {
        machineId: createdMachines[0].id,
        statusId: createdStatuses[1].id,
        sensor: "0123456789",
        clip: "/anomalies/2.wav",
      },
      {
        machineId: createdMachines[0].id,
        statusId: createdStatuses[2].id,
        sensor: "1234567890",
        clip: "/anomalies/3.wav",
      },
      {
        machineId: createdMachines[1].id,
        statusId: createdStatuses[0].id,
        sensor: "1122334455",
        clip: "/anomalies/4.wav",
      },
      {
        machineId: createdMachines[1].id,
        statusId: createdStatuses[1].id,
        sensor: "2345678900",
        clip: "/anomalies/5.wav",
      },
      {
        machineId: createdMachines[1].id,
        statusId: createdStatuses[2].id,
        sensor: "2345678900",
        clip: "/anomalies/6.wav",
      },
    ];

    await db.anomaly.createMany({
      data: anomalies,
    });

    const reasons = [
      {
        name: "spindle-error",
        label: "Spindle Error",
        machineId: createdMachines[0].id,
      },
      {
        name: "axis-problem",
        label: "Axis Problem",
        machineId: createdMachines[0].id,
      },
      {
        name: "machine-crash",
        label: "Machine Crash",
        machineId: createdMachines[1].id,
      },
      {
        name: "router-fault",
        label: "Router Fault",
        machineId: createdMachines[1].id,
      },
      {
        name: "normal",
        label: "Normal",
      },
    ];

    await db.reason.createMany({
      data: reasons,
    });

    const actions = [
      {
        name: "immediate",
        label: "Immediate",
      },
      {
        name: "later",
        label: "Later",
      },
      {
        name: "no-action",
        label: "No Action",
      },
    ];

    await db.action.createMany({
      data: actions,
    });
  });
}

main();
