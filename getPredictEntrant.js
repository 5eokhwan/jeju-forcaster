const axios = require("axios");
const url =
  "https://docs.google.com/spreadsheets/d/1vvLmMc735yMl_J5NNT70m6iVeuIdwjkL3NWhMZeN1cc/gviz/tq?";

const fetchEntrant = async () => {
  let predictEntrant = {
    name: "predictEntrant",
    sum: 0,
    datas: [],
  };
  try {
    const res = await axios.get(url);
    data = JSON.parse(res.data.match(/(?<=.*\().*(?=\);)/s)[0]);
    predictEntrant.sum = data.table.rows.length;
    data.table.rows.forEach((row) => {
      predictEntrant.datas.push({
        date: row.c[0].f,
        come: row.c[1].f,
      });
    });
    console.log("getPredictEntrant");
  } catch (e) {
    console.log("predictEntrant-Err", e);
  } finally {
    return predictEntrant;
  }
};

module.exports = fetchEntrant;
