import Joi from "joi";
import joiValidator from "../middleware/validator.js";
import { ROLE } from "../utils/enums.js";
import services from "../services/index.js";
import message from "../utils/message.js";

const userController = {
  getAllUsers: {
    validator: joiValidator({
      query: Joi.object({
        email: Joi.string(),
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
        role: Joi.string().valid(...Object.values(ROLE)),
      }),
    }),
    handler: async (req, res) => {
      try {
        const users = await services.user.getAllUsers(req);
        res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users!", error);
        res.status(500).send(error.message);
      }
    },
  },

  getUserProfile: {
    handler: async (req, res) => {
      try {
        const user = await services.user.getUserProfile(req);
        res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user by id!", error);
        res.status(500).send(error.message);
      }
    },
  },

  getUserById: {
    validator: joiValidator({
      params: Joi.object({
        id: Joi.string().uuid().required(),
      }),
    }),

    handler: async (req, res) => {
      try {
        const user = await services.user.getUserById(req);
        res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user by id!", error);
        res.status(500).send(error.message);
      }
    },
  },

  registerUser: {
    validator: joiValidator({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string()
          .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
          .message(
            "Password must be at least 6 characters long and include at least one letter and one number"
          ),
        role: Joi.string().valid(ROLE.TECHNICIAN).required(),
      }),
    }),

    handler: async (req, res) => {
      try {
        const user = await services.user.registerUser(req);
        res.status(201).json(user);
      } catch (error) {
        console.error("Error registering user!", error);
        res.status(500).send(error.message);
      }
    },
  },

  loginUser: {
    validator: joiValidator({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
          .message(
            "Password must be at least 6 characters long and include at least one letter and one number"
          ),
      }),
    }),

    handler: async (req, res) => {
      try {
        const user = await services.user.loginUser(req);
        res.status(200).json(user);
      } catch (error) {
        console.error("Error registering user!", error);
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

export default userController;
