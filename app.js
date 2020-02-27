const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
/**
 *
 */
class App {
  /**
   * [constructor description]
   * @param  {[type]} router [description]
   * @param  {[type]} port   [description]
   * @return {[type]}        [description]
   */
  constructor(router, port) {
    this.app = express();
    this.port = port || 3000;
    this.router = router;

    this.initializeConfig();
    return this;
  }
  /**
 *
 */
  listen() {
    this.app.listen(this.port, () => {
      console.log(`API running in port: ${this.port}`);
    });
  }
}

/**
 *
 */
function initializeMiddlewares() {
  this.app.use(bodyParser.urlencoded({ extended: true }));
  this.app.use(bodyParser.json());
  this.app.use(morgan('dev'));
  this.app.use(helmet());
  this.app.use(helmet.noCache());
  this.app.use(compression());
  this.app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ message: 'Malformed JSON.' });
    }

    next();
  });
  this.app.use(cors({
    origin: '*',
    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
    ],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
}


/**
 *
 */
function initializeRouter() {
  this.app.use(this.router);
}

App.prototype.initializeConfig = function() {
  initializeMiddlewares.call(this);
  initializeRouter.call(this);
};


module.exports = App;
