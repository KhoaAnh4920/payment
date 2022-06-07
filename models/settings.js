"use strict";

/**
 * `Setting` model
 */
module.exports = (sequelize, DataTypes) => {
  const Settings = sequelize.define(
    "settings",
    {
      key: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.STRING,
      }     
    },
    { tableName: "settings", timestamps: false }
  );

  return Settings;
};
