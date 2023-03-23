const { PrismaClient } = require("@prisma/client");

const db = globalThis.db || new PrismaClient();
if (!["production", "prod"].includes(process.env.NODE_ENV)) globalThis.db = db;

module.exports = async function connectClient(callback = async () => {}) {
  try {
    await db.$connect();
    const res = await callback(db);
    await db.$disconnect();
    return res;
  } catch (err) {
    await db.$disconnect();
    console.error(err.message || err);
    throw err;
  }
};
