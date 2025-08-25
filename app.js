require("dotenv").config()
require("express-async-errors")

//extra security packages
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

const express = require("express")
const app = express()

//connectDB
const connectDB = require("./db/connect")

const authenticateUSer = require("./middleware/authentication")

//routers
const authRouter = require("./routes/auth")
const jobsRouter = require("./routes/jobs")

// error handler
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  })
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get("/", (req, res) => {
  res.send("<h1>Jobs API</h1> <a href='/api-docs'>API Documentation</a>")
})

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUSer, jobsRouter)
//here authenticateUSer will authenticate each and every time for controllers in jobs Router

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    // console.log("connected to db")
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
