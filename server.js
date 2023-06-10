const express = require("express");
const dbConnect = require("./config/dbConnect");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
// const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(morgan("dev"));
const PORT = process.env.PORT || 4000;

// DB Connection
dbConnect();

// Routes
app.use("/api/user", authRouter);
app.use("/api/product", productRoute);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening at PORT ${PORT}`);
});
