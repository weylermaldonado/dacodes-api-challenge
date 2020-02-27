require('dotenv').config();
require('./src/config/database');
const App = require('./app.js');
const router = require('./src/routes/router.js');

const port = process.argv.slice(2)[0];

const app = new App(router, port);

app.listen();

