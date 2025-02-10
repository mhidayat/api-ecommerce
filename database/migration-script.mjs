import Postgrator from "postgrator";
import pkg from 'pg';
const { Client } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'rest-api',
    user: 'rest-api',
    password: 'admin',
  });

  try {
    await client.connect();
    console.log('dirname =>', __dirname);
    const postgrator = new Postgrator({
      migrationPattern: path.join(__dirname, '/migrations/*'),
      driver: 'pg',
      database: 'rest-api',
      schemaTable: 'migrations',
      currentSchema: 'public', // Postgres and MS SQL Server only
      execQuery: (query) => client.query(query),
    });

    const result = await postgrator.migrate()

    if (result.length === 0) {
      console.log(
        'No migrations run for schema "public". Already at the latest one.'
      )
    }

    console.log('Migration done.')

    process.exitCode = 0
  } catch(err) {
    console.error(err)
    process.exitCode = 1
  }

  await client.end()
}

migrate()