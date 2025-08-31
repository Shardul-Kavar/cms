import customerController from './customer.controller.js';
import jobController from './job.controller.js';
import userController from './user.controller.js';

const controllers = {
  customer: customerController,
  job: jobController,
  user: userController,
};

export default controllers;
