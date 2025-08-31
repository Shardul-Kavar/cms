import Joi from "joi";
import joiValidator from "../middleware/validator.js";
import { ROLE } from "../utils/enums.js";
import services from "../services/index.js";
import message from "../utils/message.js";

const customerController = {
  getAllCustomers: {
    validator: joiValidator({
      query: Joi.object({
        phone: Joi.string().trim(),
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
        role: Joi.string().valid(...Object.values(ROLE)),
      }),
    }),
    handler: async (req, res) => {
      try {
        const customers = await services.customer.getAllCustomers(req);
        res.status(200).json(customers);
      } catch (error) {
        console.error("Error fetching customers!", error);
        res.status(500).send(error.message);
      }
    },
  },

  getCustomerById: {
    validator: joiValidator({
      params: Joi.object({
        id: Joi.string().uuid().required(),
      }),
    }),

    handler: async (req, res) => {
      try {
        const customer = await services.customer.getCustomerById(req);
        res.status(200).json(customer);
      } catch (error) {
        console.error("Error fetching customer by id!", error);
        res.status(500).send(error.message);
      }
    },
  },

  addCustomer: {
    validator: joiValidator({
      body: Joi.object({
        firstName: Joi.string().max(100).required(),
        lastName: Joi.string().max(100),

        phone: Joi.string()
          .pattern(/^[0-9]{10}$/) // Example: 10-digit Indian phone
          .required(),

        email: Joi.string().email(),

        houseNumber: Joi.string().max(50).required(),

        addressLine1: Joi.string().max(255),
        addressLine2: Joi.string().max(255),

        area: Joi.string().max(100),

        pincode: Joi.number().integer().min(100000).max(999999),
      }),
    }),

    handler: async (req, res) => {
      try {
        const customer = await services.customer.addCustomer(req);
        res.status(201).json(customer);
      } catch (error) {
        console.error("Error registering customer!", error);
        res.status(500).send(error.message);
      }
    },
  },

  updateCustomer: {
    validator: joiValidator({
      params: Joi.object({
        id: Joi.string().uuid().required(),
      }),
      body: Joi.object({
        firstName: Joi.string().max(100),
        lastName: Joi.string().max(100),
        phone: Joi.string().pattern(/^[0-9]{10}$/),
        email: Joi.string().email(),
        houseNumber: Joi.string().max(50),
        addressLine1: Joi.string().max(255),
        addressLine2: Joi.string().max(255),
        area: Joi.string().max(100),
        pincode: Joi.number().integer().min(100000).max(999999),
      }).min(1),
    }),

    handler: async (req, res) => {
      try {
        const customer = await services.customer.updateCustomer(req);
        res.status(200).json(customer);
      } catch (error) {
        console.error("Error registering customer!", error);
        if (error.message === message.USER_NOT_FOUND) {
          res.status(404).send(error.message);
        } else if (error.message === message.EMAIL_OR_PASSWORD_NOT_MATCH) {
          res.status(400).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      }
    },
  },
};

export default customerController;
