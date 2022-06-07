// app.module.js

const config = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: config.sequelize.dialect,
    // operatorsAliases: false,
    // pool: config.sequelize.pool,
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.order = require('../models/order')(sequelize, Sequelize);
db.product = require('../models/product')(sequelize, Sequelize);
db.supplier = require('../models/supplier')(sequelize, Sequelize);
db.settings = require('../models/settings')(sequelize, Sequelize);


module.exports = db;
