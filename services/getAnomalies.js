export default async function getAnomalies(db, where) {
  const data = await db.anomaly.findMany({
    where,
    select: {
      id: true,
      sensor: true,
      clip: true,
      comments: true,
      createdAt: true,
      fetchedAt: true,
      machine: {
        select: {
          name: true,
          label: true,
        },
      },
      status: {
        select: {
          id: true,
          name: true,
          label: true,
        },
      },
      reason: {
        select: {
          id: true,
          name: true,
          label: true,
        },
      },
      action: {
        select: {
          id: true,
          name: true,
          label: true,
        },
      },
    },
  });

  return data.map((a) => ({
    ...a,
    createdAt: String(a.createdAt),
    fetchedAt: a.fetchedAt && String(a.fetchedAt),
  }));
}
