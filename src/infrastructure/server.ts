const express = require('express');
import {logFor} from 'src/domain/logger';
import {fetchDgfipDataControllerBuidler} from 'src/presentation/controllers/fetch-data.controller';
import {dfdipInputValidationMiddleware} from 'src/presentation/middlewares/dgfip-input-validation.middleware';
import {manageErrorMiddleware} from 'src/presentation/middlewares/error-management.middleware';

const app = express();
const logger = logFor('Server');

app.get(
  '/impots/svair',
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(true),
  manageErrorMiddleware
);
app.get(
  '/v2/avis-imposition',
  dfdipInputValidationMiddleware,
  fetchDgfipDataControllerBuidler(true),
  manageErrorMiddleware
);

app.listen(process.env.PORT || 3000, () => {
  logger.log('info', 'App listening on port 3000');
});
