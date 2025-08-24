import { Op } from "sequelize";
import db from "../models/index.js";
import message from "../utils/message.js";
import { ROLE } from "../utils/enums.js";

const jobRepository = {
  getAllJobs: async (req) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortAs = "DESC",
      title,
      ...where
    } = req.query;

    const jobs = await db.Job.findAndCountAll({
      where: {
        ...where,
        ...(title && {
          title: {
            [Op.like]: `%${title}%`,
          },
        }),
      },
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, sortAs]],
      include: [
        {
          model: db.Customer,
          as: "customer",
        },
        {
          model: db.User,
          as: "created",
          attributes: ["id", "name", "email"],
        },
        {
          model: db.User,
          as: "updated",
          attributes: ["id", "name", "email"],
        },
        {
          model: db.User,
          as: "technician",
          attributes: ["id", "name", "email"],
        },
      ],
    });
    return jobs;
  },

  getJobById: async (id) => {
    const job = await db.Job.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.Customer,
          as: "customer",
        },
        {
          model: db.User,
          as: "created",
          attributes: ["id", "name", "email"],
        },
        {
          model: db.User,
          as: "updated",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!job) {
      throw new Error(message.JOB_NOT_FOUND);
    }

    return job;
  },

  createJob: async (body) => {
    const job = await db.Job.create(body);
    return job;
  },

  updateJob: async (id, body) => {
    const updatedJob = await db.Job.update(body, {
      where: { id },
    });

    return updatedJob;
  },

  deletejob: async (id, userId) => {
    const job = await db.Job.findOne({
      where: {
        id,
        isActive: true,
      },
      raw: true,
      nest: true,
    });

    if (!job) {
      throw new Error(message.JOB_NOT_FOUND);
    }

    const deletedJob = await db.Job.update(
      {
        isActive: false,
        updatedBy: userId,
      },
      {
        where: {
          id,
        },
      }
    );

    return deletedJob;
  },
};

export default jobRepository;
