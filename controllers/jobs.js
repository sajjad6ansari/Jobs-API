const Job = require("../models/Job")
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors")
const { StatusCodes } = require("http-status-codes")

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt")
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req

  if (company === " " || position === " ") {
    throw new BadRequestError("Company or Position fields can not be empty ")
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    {
      new: true,
      runValidatords: true,
    }
  )
  // value provided  match the expected format of value (likely jobId or createdBy) into an ObjectId
  //but did not find such job with given jobId or createdBy
  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`)
  }

  //handling error when formate of provided data don't match with the mongoose

  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId })
  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}
