import mongoose from 'mongoose';
import config from '../../../config';

import logger from '../logger/winston-logger';

mongoose.Promise = require('bluebird');

const connection = mongoose.connect(config.db.MONGO_URI, { useNewUrlParser: true });
connection
    .then(db => {
        logger.info(
            `Successfully connected to ${config.db.MONGO_URI} MongoDB cluster in ${
				config.env
			} mode.`,
        );
        return db;
    })
    .catch(err => {
        if (err.message.code === 'ETIMEDOUT') {
            logger.info('Attempting to re-establish database connection.');
            mongoose.connect(config.db.MONGO_URI);
        } else {
            logger.error('Error while attempting to connect to database:');
            logger.error(err);
        }
    });

export default connection;