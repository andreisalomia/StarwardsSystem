import { Sequelize } from 'sequelize';

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST, PORT_DB } = process.env;

if (!POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD || !DB_HOST || !PORT_DB) {
  throw new Error('Missing required database environment variables');
}

const PORT_DB_NUMBER = parseInt(PORT_DB, 10);
if (isNaN(PORT_DB_NUMBER)) {
  throw new Error('PORT_DB must be a valid number');
}

const sequelize = new Sequelize(
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    host: DB_HOST,
    port: PORT_DB_NUMBER,
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;