import Joi from "joi";
import joiValidator from "../middleware/validator.js";
import services from "../services/index.js";
import message from "../utils/message.js";
import { CATEGORY, JOB_PRIORITY, JOB_STATUS } from "../utils/enums.js";

const jobController = {
  getAllJobs: {
    validator: joiValidator({
      query: Joi.object({
        userId: Joi.string().uuid(),
        title: Joi.string(),
        page: Joi.number().default(1),
        limit: Joi.number().default(10),
      }),
    }),
    handler: async (req, res) => {
      try {
        const jobs = await services.job.getAllJobs(req);
        res.status(200).json(jobs);
      } catch (error) {
        console.error("Error fetching jobs!", error);
        res.status(500).send(error.message);
      }
    },
  },

  getJobById: {
    validator: joiValidator({
      params: Joi.object({
        id: Joi.string().uuid().required(),
      }),
    }),

    handler: async (req, res) => {
      try {
        const job = await services.job.getJobById(req);
        res.status(200).json(job);
      } catch (error) {
        console.error("Error fetching job by id!", error);
        if (error.message === message.JOB_NOT_FOUND) {
          res.status(404).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      }
    },
  },

  createJob: {
    validator: joiValidator({
      body: Joi.object({
        title: Joi.string().max(150).required(),
        description: Joi.string().max(5000),

        category: Joi.string()
          .valid(...Object.values(CATEGORY))
          .required(),
        status: Joi.string()
          .valid(...Object.values(JOB_STATUS))
          .default(JOB_STATUS.NEW),
        priority: Joi.string()
          .valid(...Object.values(JOB_PRIORITY))
          .default(JOB_PRIORITY.LOW),

        customerId: Joi.string().uuid().required(),
        assignedTo: Joi.string().uuid(),

        scheduledAt: Joi.date().iso(),

        serviceAddressLine1: Joi.string().max(255),
        serviceAddressLine2: Joi.string().max(255),
        serviceArea: Joi.string().max(100),
        servicePincode: Joi.number().integer().min(100000).max(999999),
      }),
    }),

    handler: async (req, res) => {
      try {
        const job = await services.job.createJob(req);
        res.status(201).json(job);
      } catch (error) {
        console.error("Error creating job!", error);
        res.status(500).send(error.message);
      }
    },
  },

  updateJob: {
    validator: joiValidator({
      params: Joi.object({
        id: Joi.string().uuid().required(),
      }),
      body: Joi.object({
        title: Joi.string().max(150),
        description: Joi.string().max(5000),

        category: Joi.string().valid(...Object.values(CATEGORY)),
        status: Joi.string()
          .valid(...Object.values(JOB_STATUS))
          .default(JOB_STATUS.NEW),
        priority: Joi.string()
          .valid(...Object.values(JOB_PRIORITY))
          .default(JOB_PRIORITY.LOW),

        customerId: Joi.string().uuid(),
        assignedTo: Joi.string().uuid(),

        scheduledAt: Joi.date().iso(),

        serviceAddressLine1: Joi.string().max(255),
        serviceAddressLine2: Joi.string().max(255),
        serviceArea: Joi.string().max(100),
        servicePincode: Joi.number().integer().min(100000).max(999999),
      }).min(1),
    }),

    handler: async (req, res) => {
      try {
        const job = await services.job.updateJob(req);
        res.status(200).json(job);
      } catch (error) {
        console.error("Error updating job!", error);
        if (error.message === message.JOB_NOT_FOUND) {
          res.status(404).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      }
    },
  },

  deleteJob: {
    validator: joiValidator({
      params: Joi.object({
        id: Joi.string().uuid().required(),
      }),
    }),

    handler: async (req, res) => {
      try {
        const job = await services.job.deleteJob(req);
        res.status(200).json(job);
      } catch (error) {
        console.error("Error updating job!", error);
        if (error.message === message.JOB_NOT_FOUND) {
          res.status(404).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      }
    },
  },
};

export default jobController;
