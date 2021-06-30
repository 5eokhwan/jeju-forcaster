const axios = require("axios");
const fs = require("fs");
const { getCurKrTime } = require("./getCurKrDate");

const dataBuffer = fs.readFileSync("assets/json/EntrustedInstitutionPos.json");
const dataJSON = dataBuffer.toString();
const parsedData = JSON.parse(dataJSON);

const url =
  "https://api.odcloud.kr/api/apnmOrg/v1/list?page=1&perPage=300&cond%5BorgZipaddr%3A%3ALIKE%5D=%EC%A0%9C%EC%A3%BC%ED%8A%B9%EB%B3%84&serviceKey=HfqivhIZ0LdSWOWJuO6cYiOUrrrTGDG0yB22Wsc6pbmvUOfwIuIzUOqnv9ZK6Ppvw2mHnFk%2Bf2yNllDWnCrfRw%3D%3D";
let data;
const fetchInstitution = async () => {
  let institution = {
    name: "institution",
    currentHm: null,
    datas: [],
  };
  try {
    function numberPad(n, width) {
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join("0") + n;
    }
    const fetchedData = await axios.get(url);
    const date = getCurKrTime();
    let currentHm =
      `${numberPad(date.getHours(), 2)}` + numberPad(date.getMinutes(), 2);
    institution.currentHm = currentHm;
    data = fetchedData.data.data;
    for (let key in parsedData) {
      const findedObj = data.find((obj) => obj.orgnm === key);
      //data에 위도 경도 속성 추가
      if (findedObj) {
        findedObj["latitude"] = parsedData[key]["latitude"];
        findedObj["longitude"] = parsedData[key]["longitude"];
        if (!findedObj.sttTm) findedObj.sttTm = "????";
        if (!findedObj.endTm) findedObj.endTm = "????";
        if (!findedObj.lunchSttTm) findedObj.lunchSttTm = "????";
        if (!findedObj.lunchEndTm) findedObj.lunchEndTm = "????";

        if (
          Number(findedObj.sttTm) < currentHm &&
          currentHm < Number(findedObj.endTm)
        )
          findedObj["possibleTm"] = true;
        else findedObj["possibleTm"] = false;
        if (
          Number(findedObj.lunchSttTm) < currentHm &&
          currentHm < Number(findedObj.lunchEndTm)
        )
          findedObj["possibleLunchTm"] = false;
        else findedObj["possibleLunchTm"] = true;
        institution.datas.push(findedObj);
      }
    }
    console.log("getInstitution");
  } catch (e) {
    console.log("Institution-Err", e);
  } finally {
    return institution;
  }
};
module.exports = fetchInstitution;
