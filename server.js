const express = require('express');
const app = express();
const config = require('./config');
const bodyParser = require('body-parser');
const db = require('./app/app.module');
const cors = require('cors');
const fileUpload = require('express-fileupload');


app.use(cors())
app.use(fileUpload({
    createParentPath: true,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// force: true will drop the table if it already exists
// db.sequelize.sync({force: false}).then(() => {
//     // console.log('Drop and Resync with { force: false }');
// });

require('./app/route/user.route.js')(app);

// Create a Server
if (process.env.NODE_ENV != 'unit-test') {
    app.listen(config.port, () => console.log('Listening on port: ' + config.port));
}

module.exports = app;
