const axios = require("axios");

const fetchStatus = async () => {
  const status = {
    occur: {
      defCnt: [],
      isolClearCnt: [],
      deathCnt: [],
      localOccCnt: [], //today? 지역발생 수
      stdDay: [], //기준일시
    },
    vaccine: {
      firstCnt: [],
      secondCnt: [],
      totalFirstCnt: [],
      totalSecondCnt: [],
      baseDate: [],
    },
  };
  try {
    let today = new Date();
    let todayMinus6 = new Date();
    todayMinus6.setDate(todayMinus6.getDate() - 6);

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1; // 월
    let date = today.getDate(); // 날짜

    let year6 = todayMinus6.getFullYear(); // 년도
    let month6 = todayMinus6.getMonth() + 1; // 월
    let date6 = todayMinus6.getDate(); // 날짜

    function numberPad(n, width) {
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join("0") + n;
    }
    month = numberPad(month, 2);
    date = numberPad(date, 2);
    month6 = numberPad(month6, 2);
    date6 = numberPad(date6, 2);

    let ymdtime = year + "-" + month + "-" + date + " 00:00:00";
    let ymdMinus6 = year6 + "-" + month6 + "-" + date6 + " 00:00:00";

    var url =
      "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson";
    var queryParams =
      "?" +
      encodeURIComponent("ServiceKey") +
      `=${process.env.COVID19_CITY_OPEN_API}`;
    queryParams +=
      "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
    queryParams +=
      "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("1");
    queryParams +=
      "&" +
      encodeURIComponent("startCreateDt") +
      "=" +
      encodeURIComponent(`${year6}${month6}${date6}`);
    queryParams +=
      "&" +
      encodeURIComponent("endCreateDt") +
      "=" +
      encodeURIComponent(`${year}${month}${date}`);
    console.log(`${year6}${month6}${date6}`);
    let jejuOccur = [];
    let responseOccur = await axios.get(url + queryParams);
    responseOccur = responseOccur.data.response.body.items.item;
    for (let ele of responseOccur) {
      if (ele.gubun === "제주") {
        jejuOccur.push(ele);
        continue;
      }
    }
    jejuOccur.forEach((occur) => {
      for (let key in occur) {
        if (!status.occur.hasOwnProperty(key)) continue;
        status.occur[key].unshift(occur[key]);
      }
    });

    url = "https://api.odcloud.kr/api/15077756/v1/vaccine-stat";
    queryParams = "?" + encodeURIComponent("page") + "=1";
    queryParams +=
      "&" + encodeURIComponent("perPage") + "=" + encodeURIComponent("7");

    queryParams +=
      "&" +
      encodeURIComponent("cond[baseDate::GTE]") +
      "=" +
      encodeURIComponent(ymdMinus6);
    queryParams +=
      "&" +
      encodeURIComponent("cond[sido::EQ]") +
      "=" +
      encodeURIComponent("제주특별자치도");
    queryParams +=
      "&" +
      encodeURIComponent("serviceKey") +
      "=" +
      encodeURIComponent(process.env.COVID19_VACCINE_OPEN_API);
    let responseVaccine = await axios.get(url + queryParams);
    responseVaccine = responseVaccine.data.data;

    responseVaccine.forEach((vaccine) => {
      for (let key in vaccine) {
        if (!status.vaccine.hasOwnProperty(key)) continue;
        status.vaccine[key].push(vaccine[key]);
      }
    });
    console.log("getStatus");
  } catch (e) {
    console.log("getStatus-Err", e);
  } finally {
    return status;
  }
};
module.exports = fetchStatus;
