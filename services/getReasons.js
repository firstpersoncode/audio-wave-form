export default async function getReasons(db, where) {
  const data = await db.reason.findMany({
    where,
    select: {
      id: true,
      name: true,
      label: true,
    },
  });

  return data;
}
