const serverless = require("serverless-http");
const express = require("express");
const app = express();
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
const jobsRouter = require("../routes/jobs");
const statusRouter = require("../routes/status");
const connect = require("../db/connect");
require("dotenv").config();
require("express-async-errors");

const notFoundMiddleware = require("../middleware/not-found");
const errorHandlerMiddleware = require("../middleware/error-handler");
const authUser = require("../middleware/authentication");

//setup security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs.yaml");

//security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Jobs API</h1><a href='/api-docs'>Documentation</a>");
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Auth routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authUser, userRouter);
app.use("/api/v1/status", authUser, statusRouter);
app.use("/api/v1/jobs", authUser, jobsRouter);

//routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("DB connection success");

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

const handler = serverless(app);
module.exports = { handler };
