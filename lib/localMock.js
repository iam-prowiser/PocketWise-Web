import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".local_data");
const DB_PATH = path.join(DATA_DIR, "mock_db.json");

async function ensureDb() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DB_PATH).catch(async () => {
      const seed = {
        transactions: [],
        budgets: [],
        goals: [],
        users: []
      };
      await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
    });
  } catch (err) {
    console.error("localMock.ensureDb error", err);
  }
}

async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw || "{}");
}

async function writeDb(db) {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function getCollection(name) {
  const db = await readDb();
  return db[name] || [];
}

export async function insertInto(name, item) {
  const db = await readDb();
  db[name] = db[name] || [];
  db[name].push(item);
  await writeDb(db);
  return item;
}

export async function queryCollection(name, filter = {}) {
  const items = await getCollection(name);
  const keys = Object.keys(filter);
  if (!keys.length) return items;
  return items.filter((it) => keys.every((k) => String(it[k]) === String(filter[k])));
}

export default { getCollection, insertInto, queryCollection };
