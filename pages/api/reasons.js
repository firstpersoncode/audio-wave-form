import connectClient from "prisma/client";
import getReasons from "services/getReasons";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send();
  let { machineId } = req.query;
  if (!machineId) return res.status(403).send();

  const reasons = await connectClient(async (db) => {
    return getReasons(db, {
      OR: [{ machineId: { isSet: false } }, { machineId }],
    });
  });

  res.status(200).send(reasons);
}
