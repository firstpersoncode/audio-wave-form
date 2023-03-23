import connectClient from "prisma/client";
import updateAnomaly from "services/updateAnomaly";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).send();
  let { id } = req.query;
  if (!id) return res.status(403).send();
  let body = req.body ? JSON.parse(req.body) : {};
  let { reasonId, actionId, comments } = body;

  await connectClient(async (db) => {
    return updateAnomaly(db, id, {
      reasonId,
      actionId,
      comments,
    });
  });

  res.status(200).send();
}
