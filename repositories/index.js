import customerRepository from './customer.repository.js';
import jobRepository from './job.repository.js';
import userRepository from './user.repository.js';

const repositories = {
  customer: customerRepository,
  job: jobRepository,
  user: userRepository,
};

export default repositories;
