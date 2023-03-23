import getAnomalies from "./getAnomalies";
import getReasons from "./getReasons";

export default async function dashboard(db) {
  const machines = await db.machine.findMany({
    select: {
      id: true,
      name: true,
      label: true,
    },
  });

  const selectedMachine = machines[0];

  const anomalies = await getAnomalies(db, { machineId: selectedMachine.id });

  const reasons = await getReasons(db, {
    OR: [{ machineId: { isSet: false } }, { machineId: selectedMachine.id }],
  });

  const actions = await db.action.findMany({
    select: {
      id: true,
      name: true,
      label: true,
    },
  });

  return {
    machines: machines.map((m) => ({
      id: m.id,
      name: m.name,
      label: m.label,
    })),
    machine: {
      id: selectedMachine.id,
      name: selectedMachine.name,
      label: selectedMachine.label,
    },
    anomalies,
    reasons,
    actions,
  };
}
