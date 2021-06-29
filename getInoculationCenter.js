const axios = require("axios");
url = "https://api.odcloud.kr/api/15077586/v1/centers";
queryParams = "?" + encodeURIComponent("page") + "=1";
queryParams +=
  "&" + encodeURIComponent("perPage") + "=" + encodeURIComponent("500");
queryParams +=
  "&" +
  encodeURIComponent("serviceKey") +
  "=" +
  encodeURIComponent(
    "HfqivhIZ0LdSWOWJuO6cYiOUrrrTGDG0yB22Wsc6pbmvUOfwIuIzUOqnv9ZK6Ppvw2mHnFk+f2yNllDWnCrfRw=="
  );

const fetchCenter = async () => {
  let jejuCenter = { cnt: 0, centers: [] };
  try {
    let res = await axios.get(url + queryParams);
    res = res.data.data; //.filter((center) => center.sido === "제주특별자치도");
    res = res.filter((center) => center.sido === "제주특별자치도");
    //console.log(res);
    res.forEach((center, i) => jejuCenter.centers.push(center));

    console.log("getCenter");
  } catch (e) {
    console.log("center-Err", e);
  } finally {
    return jejuCenter;
  }
};
module.exports = fetchCenter;
