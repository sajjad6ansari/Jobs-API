const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 6,
    // maxlength: 12, as hashedPassword is larger
  },
})

//mongoose middleware
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  // next() optional
})

// UserSchema.methods.getName = function () {
//   return this.name
// }

//mongoose instance methods to create JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { name: this.name, userId: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFE_TIME,
    }
  )
}

//mongoose instance methods to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}
module.exports = mongoose.model("User", UserSchema)
