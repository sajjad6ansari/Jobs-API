// const { CustomAPIError } = require("../errors")
const { StatusCodes } = require("http-status-codes")
const errorHandlerMiddleware = (err, req, res, next) => {
  // console.log(err)

  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something went wrong try again`,
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.code && err.code === 11000) {
    // The Object.keys() method in JavaScript is used to retrieve the keys (property names) of an object as an array.
    customError.msg = `${Object.keys(
      err.keyValue
    )} already exits , please enter different email`
    customError.statusCode = 400
  }
  if (err.name === "ValidationError") {
    // console.log(Object.values(err.errors))
    // (Object.values(err.errors) returns array of values of objects incide err.errors
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",")
    customError.statusCode = 400
  }
  if (err.name === "CastError") {
    customError.msg = `No job found with id ${err.value}, please provide correct jobId`
    customError.statusCode = 404
  }
  // console.log(err)
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
