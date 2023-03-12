const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//environment variables data using 
dotenv.config();
const app = express();
//Middleware
//Cors the origin one into another
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
// Data to be stored in json format
app.use(express.json());

//Mongo DB coonection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Successfull'))
  .catch((err) => console.log(err));

//End Point
app.use('/users', userRouter);

//Port Connection

app.listen(process.env.PORT, () => {
  console.log(`The Server Running On The Port ${process.env.PORT}`);
});
