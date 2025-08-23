import { Op } from 'sequelize';
import db from '../models/index.js';
import helper from '../utils/helper.js';
import message from '../utils/message.js';

const customerRepository = {
  getAllCustomers: async (req) => {
    const { page = 1, limit = 10, phone, ...where } = req.query;
    const customers = await db.Customer.findAndCountAll({
      where: {
        ...where,
        ...(phone && {
          phone: {
            [Op.like]: `%${phone}%`,
          },
        }),
      },
      limit,
      offset: (page - 1) * limit,
    });
    return customers;
  },

  getCustomerById: async (id) => {
    const customer = await db.Customer.findByPk(id);
    return customer;
  },

  addCustomer: async (body) => {
    const customer = await db.Customer.create(body);
    return customer;
  },

  updateCustomer: async (id, body) => {
    const customer = await db.Customer.update(body, {
      where: { id },
    });
    return customer;
  },
};

export default customerRepository;
