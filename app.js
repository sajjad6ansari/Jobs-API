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

// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//     standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//     // store: ... , // Redis, Memcached, etc. See below.
//   })
// )
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Jobs API Documentation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f8f9fa;
          color: #212529;
        }
        header {
          background-color: #007bff;
          padding: 15px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        header a {
          text-decoration: none;
          color: #fff;
          background: #0056b3;
          padding: 10px 20px;
          font-weight: bold;
          border-radius: 8px;
          margin: 0 10px;
          transition: background 0.3s ease-in-out;
        }
        header a:hover {
          background: #003d82;
        }
        .container {
          max-width: 850px;
          margin: 30px auto;
          background: #fff;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        h1 {
          color: #007bff;
          text-align: center;
        }
        h2 {
          color: #343a40;
          margin-top: 25px;
        }
        p {
          line-height: 1.6;
          font-size: 16px;
        }
        ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        a.github-link {
          display: inline-block;
          margin-top: 15px;
          text-decoration: none;
          color: #fff;
          background: #24292e;
          padding: 10px 15px;
          border-radius: 6px;
          font-weight: bold;
          transition: background 0.3s ease-in-out;
        }
        a.github-link:hover {
          background: #000;
        }
        a.postman-link {
          display: inline-block;
          margin-top: 10px;
          text-decoration: none;
          color: #fff;
          background: #ff6c37;
          padding: 10px 15px;
          border-radius: 6px;
          font-weight: bold;
          transition: background 0.3s ease-in-out;
        }
        a.postman-link:hover {
          background: #e0521d;
        }
        footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #6c757d;
        }
      </style>
    </head>
    <body>
      <header>
        <a href="/api-docs" target="_blank">📄 Swagger Documentation</a>
        <a href="https://www.postman.com/sajjad6ansari/ahlan/collection/k9w32b6/jobs-api" 
           target="_blank">🧪 Postman Collection</a>
      </header>

      <div class="container">
        <h1>🚀 Jobs API</h1>
        <p>
          The <strong>Jobs API</strong> is a RESTful backend service built to manage authentication,
          authorization, and CRUD operations for job postings. It follows clean architecture, 
          emphasizes security, and ensures scalability.
        </p>

        <h2>🧪 Postman Testing & Automation</h2>
        <p>
          Postman is used extensively to <strong>test</strong> and <strong>automate API testing</strong>.  
          You can directly access the published Postman collection using the link below:
        </p>
        <a class="postman-link" 
           href="https://www.postman.com/sajjad6ansari/ahlan/collection/k9w32b6/jobs-api" 
           target="_blank">🌐 Open Postman Collection</a>

        <h2>🔗 GitHub Repository</h2>
        <p>
          Explore the complete source code here:  
          <a class="github-link" href="https://github.com/sajjad6ansari/Jobs-API" target="_blank">
            🌐 View on GitHub
          </a>
        </p>

        <h2>🛠️ Tech Stack</h2>
        <ul>
          <li><strong>Backend:</strong> Node.js, Express.js</li>
          <li><strong>Database:</strong> MongoDB + Mongoose</li>
          <li><strong>Authentication:</strong> JWT (JSON Web Tokens)</li>
          <li><strong>API Documentation:</strong> Swagger + YAML</li>
          <li><strong>Testing:</strong> Postman (Manual + Automated)</li>
          <li><strong>Security:</strong> Helmet, CORS, XSS-Clean, Rate Limiting</li>
          <li><strong>Deployment:</strong> Render</li>
        </ul>

        <h2>📌 References</h2>
        <p>
          This project was inspired by modern API development practices,  
          clean architecture patterns, and API-first documentation principles.
        </p>
      </div>

      <footer>
        &copy; ${new Date().getFullYear()} Sajjad Ansari. All rights reserved.
      </footer>
    </body>
    </html>
  `);
});


const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// // routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUSer, jobsRouter)
//here authenticateUSer will authenticate each and every time for controllers in jobs Router
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info h1::before {
        content: 'Jobs API ';
        font-size: 32px;
        font-weight: bold;
        display: block;
        margin-bottom: 10px;
      }
    `
  })
);

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
