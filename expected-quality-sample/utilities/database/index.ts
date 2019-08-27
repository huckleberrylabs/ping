import mysql from "mysql";
import { Sequelize, Dialect } from "sequelize";
import { databaseCredentials } from "../../config";

// initialize database connection
const sequelize = new Sequelize(
  databaseCredentials.database,
  databaseCredentials.user,
  databaseCredentials.password,
  {
    define: {
      timestamps: false
    },
    host: databaseCredentials.host,
    port: databaseCredentials.port,
    dialect: <Dialect>databaseCredentials.dialect,
    pool: {
      max: 50,
      min: 0,
      idle: 30000,
      acquire: 30000
    },
    logging: false
  }
);

const connection = mysql.createConnection(databaseCredentials);
connection.query("USE " + databaseCredentials.database);

const getSQLConnection = () => {
  return connection;
};

export { sequelize, getSQLConnection };
