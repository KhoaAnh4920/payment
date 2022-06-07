require('dotenv').config();

const config = {
    env: process.env.ENV || 'dev', // dev || test || production
    mailEndpoint: process.env.MAIL_END_POINT || 'http://localhost:3500',
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        database: process.env.MYSQL_DATABASE || 'vrs',
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
    },
    sequelize: {
        pool: {
            max: process.env.POOL_MAX || 5,
            min: process.env.POOL_MAX || 0,
            acquire: process.env.POOL_ACQUIRE || 30000,
            idle: process.env.POOL_IDLE || 10000,
        },
        dialect: process.env.DIALECT || 'mysql',
    },
    port: process.env.PORT || 3500,
    jwtSecret: process.env.JWT_SECRET || '', // jwtSecret
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '48h', // 2 day
    jwtMaxAge: process.env.JWT_MAX_AGE || 3600,

    tokenExpireTime: Number(process.env.TOKEN_EXPIRE_TIME).valueOf() || 24,
};

module.exports = config;
