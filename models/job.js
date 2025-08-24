import { Model, DataTypes } from "sequelize";
import { CATEGORY, JOB_PRIORITY, JOB_STATUS } from "../utils/enums.js";

export default (sequelize) => {
  class Job extends Model {
    static associate(db) {
      db.Job.belongsTo(db.User, {
        foreignKey: "assignedTo",
        as: "technician",
      });
      db.Job.belongsTo(db.User, {
        foreignKey: "createdBy",
        as: "created",
      });
      db.Job.belongsTo(db.User, {
        foreignKey: "updatedBy",
        as: "updated",
      });
      db.Job.belongsTo(db.Customer, {
        foreignKey: "customerId",
        as: "customer",
      });
    }
  }

  Job.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      category: {
        type: DataTypes.ENUM(...Object.values(CATEGORY)),
        allowNull: false,
      },

      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      assignedTo: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(...Object.values(JOB_STATUS)),
        defaultValue: JOB_STATUS.APPROVED,
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM(...Object.values(JOB_PRIORITY)),
        defaultValue: JOB_PRIORITY.LOW,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },

      scheduledAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(Date.now() + 60 * 60 * 1000),
      },

      serviceAddressLine1: {
        type: DataTypes.STRING(255),
      },
      serviceAddressLine2: {
        type: DataTypes.STRING(255),
      },
      serviceArea: {
        type: DataTypes.STRING(100),
      },
      servicePincode: {
        type: DataTypes.INTEGER,
      },

      createdBy: {
        type: DataTypes.UUID(),
        allowNull: false,
      },
      updatedBy: {
        type: DataTypes.UUID(),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "job",
      modelName: "Job",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );

  return Job;
};
