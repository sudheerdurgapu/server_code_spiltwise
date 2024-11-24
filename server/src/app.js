// 1) THIRD PARTY MODULES
const express = require("express");
const cors = require("cors");
const path = require("path");

// 2) CUSTOM ROUTES
const expenseRouter = require("./routes/expense");
const groupRouter = require("./routes/group");
const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");

// 3) OTHER CUSTOM MODULES
const AppError = require("./utils/app-error");
const globalErrorHandler = require("./controllers/error");

const app = express();

// 4) MIDDLEWARES
// 4a) CORS
app.use(cors());

// 4b) JSON PARSER
app.use(express.json({ limit: "10mb", extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
  res.json({ status: 200, message: "welcome to smart-split" });
});

// 5) ROUTES
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/items", itemRouter);

// 6) OTHERS THAN SPECIFIED ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} in this server!`, 404));
});

// 7) HANDLING ERRORS
app.use(globalErrorHandler);

module.exports = app;
