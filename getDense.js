const axios = require("axios");
const url =
  "https://docs.google.com/spreadsheets/d/1Zbn-X5w4sT9j1Vqd4HLZHVORgidPKqQ3JN6f9aUC3jg/gviz/tq?";

const fetchDense = async () => {
  let dense = {
    name: "dense",
    datas: [],
  };
  try {
    const res = await axios.get(url);
    data = JSON.parse(res.data.match(/(?<=.*\().*(?=\);)/s)[0]);
    data.table.rows.forEach((row) => {
      dense.datas.push({
        rank: row.c[0].v,
        city: row.c[1].v,
        town: row.c[2].v,
        latitude: row.c[3].v,
        longitude: row.c[4].v,
        category: row.c[5].v,
      });
    });
    console.log("getDense");
  } catch (e) {
    console.log("dense-Err", e);
  } finally {
    return dense;
  }
};
module.exports = fetchDense;
