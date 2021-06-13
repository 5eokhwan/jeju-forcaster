const axios = require("axios");
const url =
  "https://docs.google.com/spreadsheets/d/1-eBWn5c17TsXJUvHW5k2ARJsgRWK-MTMtq2RO2Ulgpc/gviz/tq?";

const fetchEntrant = async () => {
  let entrant = {
    name: "entrant",
    sum: 0,
    datas: [],
  };
  try {
    const res = await axios.get(url);
    data = JSON.parse(res.data.match(/(?<=.*\().*(?=\);)/s)[0]);
    entrant.sum = data.table.rows.length;
    data.table.rows.forEach((row) => {
      entrant.datas.push({
        date: row.c[0].f,
        come: row.c[1].f,
      });
    });
    console.log("getEntrant");
  } catch (e) {
    console.log("entrant-Err", e);
  } finally {
    return entrant;
  }
};

module.exports = fetchEntrant;
