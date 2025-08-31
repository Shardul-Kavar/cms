import { DataTypes, Model } from "sequelize";
import { ROLE } from "../utils/enums.js";
import helper from "../utils/helper.js";

export default (sequelize) => {
  class Customer extends Model {
    static associate(db) {
      db.Customer.hasMany(db.Job, {
        foreignKey: "customerId",
        as: "jobs",
      });
    }
  }

  Customer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
      houseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addressLine1: {
        type: DataTypes.STRING,
      },
      addressLine2: {
        type: DataTypes.STRING,
      },
      area: {
        type: DataTypes.STRING,
      },
      pincode: {
        type: DataTypes.INTEGER,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: "customer",
      modelName: "Customer",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );

  return Customer;
};
