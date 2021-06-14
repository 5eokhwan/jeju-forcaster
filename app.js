const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const indexRouter = require("./routes");
dotenv.config();

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "html");

nunjucks.configure("views", {
  express: app,
  watch: true,
});
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static(path.join(__dirname, "public/src/js")));
app.use("/", express.static(path.join(__dirname, "public/src/stylesheets")));
app.use("/", express.static(path.join(__dirname, "public/src/webfonts")));
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use((req, res, next) => {
  res.status(404).send("not found");
});
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
