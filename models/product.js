"use strict";

/**
 * `Contact` model
 */
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      unit: {
        type: DataTypes.STRING,
      },
      created_at: {
        type:DataTypes.DATE,
      }
    },
    { tableName: "product", timestamps: false }
  );

  return Product;
};
