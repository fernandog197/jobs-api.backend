require('dotenv').config();
require('express-async-errors');

//Extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');

//routes
const authRoutes = require('./routes/auth')
const jobsRoutes = require('./routes/jobs')

//DB
const connectDB = require('./db/connect')

const app = express();

//Authenticate user
const authenticateUser = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra packages
const morgan = require('morgan')

app.set('trust proxy', 1)
// app.use(rateLimiter({
//   windowMs: 15*60*1000,
//   max: 100,
// }))
app.use(express.json());
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/jobs', authenticateUser, jobsRoutes)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
