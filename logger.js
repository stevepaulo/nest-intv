"use strict";

const logger = require('winston');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, prettyPrint: true, colorize: true, level: 'debug' });
logger.add(logger.transports.File, { filename: 'express.log' });

module.exports = logger;
