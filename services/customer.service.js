import repositories from "../repositories/index.js";

const customerService = {
  getAllCustomers: async (req) => {
    const customers = await repositories.customer.getAllCustomers(req);
    return customers;
  },

  getCustomerById: async (req) => {
    const { id } = req.params;
    const customer = await repositories.customer.getCustomerById(id);
    delete customer.dataValues.password;
    return customer;
  },

  addCustomer: async (req) => {
    const { body } = req;
    const customer = await repositories.customer.addCustomer(body);
    return customer;
  },

  updateCustomer: async (req) => {
    const { body, params } = req;
    const customer = await repositories.customer.updateCustomer(
      params.id,
      body
    );
    return customer;
  },
};

export default customerService;
