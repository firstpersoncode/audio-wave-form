export default async function updateAnomaly(db, id, data = {}) {
  await db.anomaly.update({
    where: { id },
    data: { fetchedAt: new Date(), ...data },
  });
}
