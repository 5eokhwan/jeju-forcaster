const express = require("express");
const router = express.Router();
const fetchStatus = require("../getStatus");
const fetchEntrant = require("../getEntrant");
const pridictEntrant = require("../getPredictEntrant");
const getDense = require("../getDense");

router.get("/api/status", (req, res) => {
  fetchStatus().then((data) => {
    res.json(data);
  });
});

router.get("/api/entrant", (req, res) => {
  fetchEntrant().then((data) => {
    res.json(data);
  });
});

router.get("/api/predictEntrant", (req, res) => {
  pridictEntrant().then((data) => {
    res.json(data);
  });
});

router.get("/api/dense", (req, res) => {
  getDense().then((data) => {
    res.json(data);
  });
});

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
