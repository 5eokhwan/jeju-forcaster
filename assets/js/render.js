import drawChart from "./drawChart.js";

const $infoDisplay = document.getElementById("figure-info-display");
const $all = document.getElementById("figure-info-all");
const $dense = document.getElementById("figure-info-dense");
const $center = document.getElementById("figure-info-center");
const $institution = document.getElementById("figure-info-institution");

const mapInfoDisplayNode = {
  $infoDisplay,
  $all,
  $dense,
  $center,
  $institution,
};

function renderAll() {
  const html = `<div class="row g-2 m-1">
  <div class="py-1 border bg-light text-center fw-bold text-danger">
    인구밀집 비율
  </div>
  <div class="col-6">
    <div class="py-1 border bg-light text-center">
      시도 <canvas class="map-chart" data-key="city"></canvas>
    </div>
  </div>
  <div class="col-6">
    <div class="py-1 border bg-light text-center">
      읍동면 <canvas class="map-chart" data-key="town"></canvas>
    </div>
  </div>
  <div class="col-6">
    <div class="py-1 border bg-light text-center">
      카테고리 <canvas class="map-chart" data-key="category"></canvas>
    </div>
  </div>
</div>
<div class="row g-2 m-1">
  <div class="py-1 border bg-light text-center fw-bold text-primary">
    예방접종센터 비율
  </div>
  <div class="col-6">
    <div class="py-1 border bg-light text-center">
      시도 <canvas class="map-chart" data-key="sigungu" ></canvas>
    </div>
  </div>
</div>`;
  $all.innerHTML = html;
  drawChart.makePieChart([
    "Dense-city",
    "Dense-town",
    "Dense-category",
    "Center-sigungu",
  ]);
}
function renderDense(datas) {
  let max = datas.length;

  const denseInfos = datas.map(
    (
      data,
      i
    ) => `<tr class="populationListEle denseInfo" data-circle="dense" style="background-color: rgba(255, 0, 0, ${
      (1 * (max - i)) / 100
    }");>
    <th scope="row">
    ${data.rank}</th>
    <td>${data.city}</td>
    <td>${data.town}</td>
    <td>${data.category}</td>
  </tr>`
  );
  const html = `<table class="table table-bordered">
  <thead>
    <tr class="table-light">
      <th scope="col">밀집순</th>
      <th scope="col">시도명</th>
      <th scope="col">읍면동면</th>
      <th scope="col">카테고리</th>
    </tr>
  </thead>
  <tbody id="populationList">
  ${denseInfos.join("")}
    </tbody>
</table>`;
  $dense.innerHTML = html; //denseInfos.join("");
}
function renderCenter(datas) {
  const html = datas.map(
    (
      data
    ) => `<div class="card mb-1 populationListEle centerInfo" data-circle="center">
  <div class="card-body">
    <h5 class="card-title">${data.facilityName}</h5>
    <p class="card-text">
      ${data.centerName}
    </p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">주소 | ${data.address}</li>
    <li class="list-group-item">전화 | ${data.phoneNumber}</li>
    <li class="list-group-item">
      update | ${data.updatedAt}
    </li>
  </ul>
</div>`
  );
  $center.innerHTML = html.join("");
}

function renderInstitution(datas) {
  console.log(datas);
  const html = datas.map((data) => {
    const s = data.sttTm.substr(0, 2) + ":" + data.sttTm.substr(2, 2);
    const e = data.endTm.substr(0, 2) + ":" + data.endTm.substr(2, 2);
    const sl =
      data.lunchSttTm.substr(0, 2) + ":" + data.lunchSttTm.substr(2, 2);
    const el =
      data.lunchEndTm.substr(0, 2) + ":" + data.lunchEndTm.substr(2, 2);
    return `
    <div class="card mb-1 populationListEle institutionInfo" data-circle="center">
  <div class="card-body">
    <h5 class="card-title">${data.orgnm}</h5>
    <p class="card-text">
      ${data.orgZipaddr}
    </p>
  </div>
  <ul class="list-group list-group-flush">
  <li class="list-group-item" ${
    data.possibleTm ? "style='color:green;'" : "style='color:red;'"
  }>영업시간 | ${s} ~ ${e}</li>
    <li class="list-group-item" ${
      data.possibleLunchTm ? "" : "style='color:red;'"
    }>점심시간 | ${sl} ~ ${el}</li>
    <li class="list-group-item">전화 | ${data.orgTlno}</li>
    <li class="list-group-item">
      update | ${data.slrYmd}
    </li>
    ${
      data.hldyYn === "Y"
        ? '<li class="list-group-item" style="color:red">오늘은 휴무일입니다.</li>'
        : ""
    }
  </ul>
</div>`;
  });
  $institution.innerHTML = html.join("");
}

export default {
  renderAll,
  renderDense,
  renderCenter,
  renderInstitution,
  mapInfoDisplayNode,
};
