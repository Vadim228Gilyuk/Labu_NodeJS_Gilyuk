const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")
require("dotenv").config();

let url = process.env.MONGO_URL;
let port = process.env.PORT;

mongoose.connect(url)

const app = express();
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is listening on ${port} port`)
})
