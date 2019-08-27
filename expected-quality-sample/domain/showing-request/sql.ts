import { Sequelize, DataTypes } from "sequelize";
import { ID_LENGTH } from "../id";
import { SHOWING_REQUEST_NAME } from "./name";
import { TIMES_AVAILABLE_MAX_LENGTH, DAYS_AVAILABLE_ARRAY } from "./model";

export function showingRequestSQLModel(
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
) {
  return sequelize.define(
    SHOWING_REQUEST_NAME,
    {
      id: {
        type: dataTypes.INTEGER({ length: ID_LENGTH }),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userID: {
        type: dataTypes.INTEGER({ length: ID_LENGTH }),
        allowNull: false
      },
      propertyID: {
        type: dataTypes.INTEGER({ length: ID_LENGTH }),
        allowNull: false
      },
      daysAvailable: {
        type: dataTypes.ARRAY(dataTypes.INTEGER()),
        allowNull: false
      },
      timesAvailable: {
        type: dataTypes.STRING({ length: TIMES_AVAILABLE_MAX_LENGTH }),
        allowNull: false
      },
      joinees: {
        type: dataTypes.ARRAY(dataTypes.STRING()),
        allowNull: true
      },
      createdAt: {
        type: dataTypes.DATE(),
        allowNull: false
      }
    },
    {
      tableName: SHOWING_REQUEST_NAME
    }
  );
}
