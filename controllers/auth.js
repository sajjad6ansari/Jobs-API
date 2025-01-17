const { StatusCodes } = require("http-status-codes")
const User = require("../models/User")
const { BadRequestError, UnauthenticatedError } = require("../errors")

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
  // .json({ user: { name: user.getName() }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body
  //if email or password not provided , we will be adding validation layer instead
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password")
  }
  //fetching user from DB
  const user = await User.findOne({ email })
  //if user do not exist
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials")
  }

  //compare password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials")
  }
  //creating token
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}
