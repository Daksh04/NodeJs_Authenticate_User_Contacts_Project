//setup express server
const express = require('express');
const errorHandler = require('./middleware/errorhandler');
const connectDb = require('./config/dbConnection');
const dotenv  = require('dotenv').config();

connectDb();
//app to listen express server
const app = express();

const port= process.env.PORT || 5000;

app.use(express.json());//parser on data string from client

app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})

