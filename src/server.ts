import * as dotenv from 'dotenv';
dotenv.config();

import { Database } from './models';
Database.sync()
  .then(() => console.log('Synchronized database tables.'))
  .catch(error =>
    console.log(`Could not synchronize database tables: ${error.message}`),
  );

import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const options = {
  swaggerOptions: {
    url: '/swagger.json',
    persistAuthorization: true,
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(undefined, options));

app.use(router);

const PORT: number = process.env.PORT ? +process.env.PORT : 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
