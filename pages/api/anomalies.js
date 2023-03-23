import connectClient from "prisma/client";
import getAnomalies from "services/getAnomalies";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send();
  let { machineId } = req.query;
  if (!machineId) return res.status(403).send();

  const anomalies = await connectClient(async (db) => {
    return getAnomalies(db, { machineId });
  });

  res.status(200).send(anomalies);
}
