const express = require("express");
const router = express.Router();
const fetchStatus = require("../getStatus");
const fetchEntrant = require("../getEntrant");
const pridictEntrant = require("../getPredictEntrant");
const getDense = require("../getDense");
const getCenter = require("../getInoculationCenter");
const getInstitution = require("../getInstitution");

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

router.get("/api/center", (req, res) => {
  getCenter().then((data) => {
    res.json(data);
  });
});

router.get("/api/institution", (req, res) => {
  getInstitution().then((data) => {
    res.json(data);
  });
});

router.get("/", (req, res) => {
  res.render("index2");
});

router.get("/pre", (req, res) => {
  res.render("index");
});

module.exports = router;
