import customerService from './customer.service.js';
import jobService from './job.service.js';
import userService from './user.service.js';

const services = {
  customer: customerService,
  job: jobService,
  user: userService,
};

export default services;
