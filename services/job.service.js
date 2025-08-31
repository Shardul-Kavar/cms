import repositories from "../repositories/index.js";
import { ROLE } from "../utils/enums.js";
import message from "../utils/message.js";

const jobService = {
  getAllJobs: async (req) => {
    const jobs = await repositories.job.getAllJobs(req);
    return jobs;
  },

  getJobById: async (req) => {
    const { id } = req.params;
    const job = await repositories.job.getJobById(id);
    return job;
  },

  createJob: async (req) => {
    const { body } = req;

    body.createdBy = req.user.id;
    body.updatedBy = req.user.id;

    const job = await repositories.job.createJob(body);
    return job;
  },

  updateJob: async (req) => {
    const job = await repositories.job.getJobById(req.params.id);
    if (!job || !job.isActive) throw new Error(message.JOB_NOT_FOUND);

    req.body.updatedBy = req.user.id;
    const updatedJob = await repositories.job.updateJob(
      req.params.id,
      req.body
    );
    return updatedJob;
  },

  deleteJob: async (req) => {
    const { id } = req.params;
    const job = await repositories.job.deletejob(id, req.user.id);
    return job;
  },
};

export default jobService;
