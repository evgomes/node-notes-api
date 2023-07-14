import db from './db-config.json';

const host: string = process.env.DATABASE_HOST || db.development.host;
const user: string = process.env.DATABASE_USER || db.development.username;
const password: string =
  process.env.DATABASE_PASSWORD || db.development.password;
const databaseName: string =
  process.env.DATABASE_NAME || db.development.database;

export { host, user, password, databaseName };
