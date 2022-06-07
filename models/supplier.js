"use strict";

/**
 * `Contact` model
 */
module.exports = (sequelize, DataTypes) => {
  const Supplier = sequelize.define(
    "supplier",
    {
      email: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      cityCode: {
        type: DataTypes.STRING,
      },
      districtCode: {
        type: DataTypes.STRING,
      },
      wardCode: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      created_at: {
        type:DataTypes.DATE,
      }
    },
    { tableName: "supplier", timestamps: false }
  );

  return Supplier;
};
