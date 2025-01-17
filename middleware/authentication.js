const jwt = require("jsonwebtoken")
const { UnauthenticatedError } = require("../errors")
const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  //check Header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    //get user document  without the password
    //there is really no point to pass this password to upcoming middleware that's why is removed from user then added user to req object
    const user = await User.findById(payload.userId).select("-password")

    // req.user = user

    //attaching user to the job routes
    req.user = { userId: payload.userId, name: payload.name }
    //passing to next middlwware
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
}

module.exports = auth
