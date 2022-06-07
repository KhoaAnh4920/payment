"use strict";

/**
 * `Contact` model
 */
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      status: {
        type: DataTypes.INTEGER,
      },
      labelGHTK: {
        type: DataTypes.STRING,
      },
      orderStatusGHTK: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type:DataTypes.DATE,
      }
    },
    { tableName: "order", timestamps: false }
  );

  return Order;
};
