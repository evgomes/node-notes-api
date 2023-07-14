import { Sequelize } from 'sequelize';
import { host, databaseName, user, password } from '../db/config/db';
import User from './user.model';
import Note from './note.model';

// Opens database connection
const sequelize = new Sequelize(databaseName, user, password, {
  host: host,
  dialect: 'postgres',
});

// Initializes all models.
const models = [User, Note];
models.forEach(model => model.initialize(sequelize));

// Configures the relationship between models
models.forEach(model => model.configureRelationships());

// Exports the configure models.
export { sequelize as Database, User, Note };
