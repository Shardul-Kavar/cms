import { DataTypes, Model } from "sequelize";
import { ROLE } from "../utils/enums.js";
import helper from "../utils/helper.js";

export default (sequelize) => {
  class User extends Model {
    static associate(db) {
      db.User.hasMany(db.Job, {
        foreignKey: "assignedTo",
        as: "jobs",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          this.setDataValue("password", helper.hashvalue(val));
        },
      },
      role: {
        type: DataTypes.ENUM(...Object.values(ROLE)),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "user",
      modelName: "User",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );

  return User;
};
