const winston = require('winston');
const fs = require('fs');
const logDir = 'log';


if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      level: 'info'
    }),
    new (winston.transports.File)({
      level: 'info',
      filename: `${logDir}/logs.log`,
      timestamp: tsFormat,
      maxsize:1000000,
      maxFiles:5
    })
  ]
});


// var logger = winston.createLogger({
//   transports: [
//     new (winston.transports.Console)(),
//     new (winston.transports.File)({ filename: 'somefile.log' })
//   ]
// });

logger.info('==========');
logger.log('info', 'Hello distributed log files!');
logger.info('Hello again distributed logs');
logger.error('Hello again distributed logs');

// {"level":"info","message":"Hello distributed log files!"}
// {"message":"Hello again distributed logs","level":"info"}




// winston.log('info', 'Hello distributed log files!');
// winston.info('Hello again distributed logs');

// winston.level = 'debug';
// winston.log('debug', 'Now my debug messages are written to console!');
