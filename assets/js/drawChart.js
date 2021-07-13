import dataLoader from "./dataLoader.js";
async function makePieChart() {
  let denseDatas = await dataLoader.getDense();
  let centerDatas = await dataLoader.getCenter();
  let ctxs = document.querySelectorAll(`.map-chart`);
  ctxs.forEach((ctx) => {
    let showingData = [];
    if (ctx.dataset.key === "sigungu")
      centerDatas.forEach((data) => showingData.push(data[ctx.dataset.key]));
    else denseDatas.forEach((data) => showingData.push(data[ctx.dataset.key]));
    let obj = {};
    for (let x of showingData) {
      if (!obj.hasOwnProperty(x)) obj[x] = 1;
      else obj[x]++;
    }
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [...Object.keys(obj)],
        datasets: [
          {
            data: [...Object.values(obj)],
            backgroundColor: [
              "#4e73df",
              "#1cc88a",
              "#36b9cc",
              "rgb(255, 99, 132)",
              "rgb(255, 205, 86)",
              "#394053",
              "#7cae7a",
              "#4e4a59",
              "#6e6362",
              "#839073",
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: "#dddfeb",
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false,
        },
        cutoutPercentage: 80,
      },
    });
  });
}

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + "").replace(",", "").replace(" ", "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

async function makeEntrantChart() {
  // Area Chart Example
  const data = await dataLoader.getEntrantData();
  const ctx = document.getElementById("entrantChart");
  const xs = data.entrant.xs.slice(7, data.entrant.xs.length);

  const entranceInfo = document.getElementById("entranceInfo");
  entranceInfo.innerText = xs[0] + " ~ " + xs[xs.length - 1];
  const predictDate = document.getElementById("predictDate");
  predictDate.innerText =
    data.predictEntrant.xs[0] +
    " ~ " +
    data.predictEntrant.xs[data.predictEntrant.xs.length - 1];
  const accuracyResult = document.getElementById("accuracy-result");
  accuracyResult.innerText = data.predictEntrant.accuracy;
  const entrantChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xs,
      datasets: [
        {
          label: "입도객 수",
          lineTension: 0,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: data.entrant.ys
            .slice(7, data.entrant.ys.length)
            .map((v) =>
              Number(v.replace(/,/g, ""))
            ) /*.slice(0, data.ys.length - data.showingCnt)*/,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0,
        },
      },
      scales: {
        xAxes: [
          {
            time: {
              unit: "date",
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 7,
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
            },
            afterTickToLabelConversion: function (data) {
              let xLabels = data.ticks;
              for (let i = 0; i < xLabels.length; i++) {
                if (i >= 1 && i <= xLabels.length - 2) xLabels[i] = "";
                else {
                }
              }
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 8,
              padding: 10,
              callback: function (value, index, values) {
                return number_format(value) + ">";
              },
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2],
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: "#6e707e",
        titleFontSize: 14,
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + number_format(tooltipItem.yLabel);
          },
        },
      },
    },
  });
  const ctx2 = document.getElementById("predictEntrant");
  const predictEntrantChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: data.predictEntrant.xs,
      datasets: [
        {
          label: "예측 입도객 수",
          lineTension: 0,
          backgroundColor: "rgba(252, 235, 192, 0.5)",
          borderColor: "#F6C23E",
          pointRadius: 3,
          pointBackgroundColor: "rgba(252, 235, 192, 1)",
          pointBorderColor: "rgba(246, 194, 62, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(252, 235, 192, 1)",
          pointHoverBorderColor: "rgba(252, 235, 192, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          borderDash: [10, 10],
          data: data.predictEntrant.ys.map((v) =>
            Number(v.replace(/,/g, ""))
          ) /*.slice(0, data.ys.length - data.showingCnt)*/,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0,
        },
      },
      scales: {
        xAxes: [
          {
            time: {
              unit: "date",
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 7,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              display: false,
              maxTicksLimit: 8,
              padding: 10,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return number_format(value) + ">";
              },
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              zeroLineBorderDash: [2],
            },
            afterDataLimits(scale) {
              scale.max = entrantChart.scales["y-axis-0"].max;
              scale.min = entrantChart.scales["y-axis-0"].min;
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: "#6e707e",
        titleFontSize: 14,
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: "index",
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel =
              chart.datasets[tooltipItem.datasetIndex].label || "";
            return datasetLabel + number_format(tooltipItem.yLabel);
          },
        },
      },
    },
  });
}
async function drawStatusChart() {
  const statusData = await getStatusData();
  const occur = statusData.occur;
  const vaccine = statusData.vaccine;
  const len_occur = occur["stdDay"].length;
  const len_vaccine = vaccine["baseDate"].length;

  for (let key in occur) {
    if (key === "stdDay") continue;
    document.getElementById(`${key}Result`).innerText =
      occur[key][len_occur - 1];
    let increase = occur[key][len_occur - 1] - occur[key][len_occur - 2];
    increase = increase > 0 ? "+" + increase : increase;
    document.getElementById(`${key}Increase`).innerText = increase;

    makeStatusChart(occur.stdDay, occur[key], key);
  }
  for (let key in vaccine) {
    if (key === "baseDate") continue;
    document.getElementById(`${key}Result`).innerText =
      vaccine[key][len_vaccine - 1];
    let increase =
      vaccine[key][len_vaccine - 1] - vaccine[key][len_vaccine - 2];
    increase = increase > 0 ? "+" + increase : increase;
    document.getElementById(`${key}Increase`).innerText = increase;
    makeStatusChart(vaccine.baseDate, vaccine[key], key);
  }
  let updateDate = occur.stdDay[len_occur - 1];
  updateDate = updateDate.substr(0, 14);
  let vaccineUpdate = vaccine.baseDate[len_vaccine - 1]
    .substr(0, 10)
    .split("-");
  document.getElementById(
    "statusUpdateText"
  ).innerText = `발생 현황: ${updateDate} | 예방접종 현황: ${vaccineUpdate[0]}년 ${vaccineUpdate[1]}월 ${vaccineUpdate[2]}일`;
}
function makeStatusChart(xs, ys, key) {
  const data = {
    labels: xs,
    datasets: [
      {
        lineTension: 0,
        label: "My First dataset",
        backgroundColor: colorOpacObj[key],
        borderColor: colorObj[key],
        data: ys,
        pointRadius: 0,
      },
    ],
  };
  const config = {
    type: "line",
    data,
    options: {
      scales: {
        xAxes: [
          {
            display: false,
          },
        ],
        yAxes: [
          {
            display: false,
          },
        ],
      },
      legend: {
        display: false,
      },
      maintainAspectRatio: false,
      tooltips: { enabled: false },
      hover: { mode: null },
    },
  };
  new Chart(document.getElementById(`${key}Chart`), config);
}

async function getStatusData() {
  const res = await fetch("/api/status");
  const data = await res.json();
  return data;
}

let colorOpacObj = {
  defCnt: "rgba(231, 74, 59, 0.7)",
  isolClearCnt: "	rgba(78, 115, 223, 0.7)",
  deathCnt: "rgba(90, 92, 105, 0.7)",
  localOccCnt: "rgba(246, 194, 62, 0.7)",
  firstCnt: "rgba(28, 200, 138, 0.7)",
  secondCnt: "rgba(28, 200, 138, 0.7)",
  totalFirstCnt: "rgba(54, 185, 204,0.7)",
  totalSecondCnt: "rgba(54, 185, 204,0.7)",
};

let colorObj = {
  defCnt: "rgb(231, 74, 59)",
  isolClearCnt: "	rgb(78, 115, 223)",
  deathCnt: "rgb(90, 92, 105)",
  localOccCnt: "rgb(246, 194, 62)",
  firstCnt: "rgb(28, 200, 138)",
  secondCnt: "rgb(28, 200, 138)",
  totalFirstCnt: "rgb(54, 185, 204)",
  totalSecondCnt: "rgb(54, 185, 204)",
};

export default { makePieChart, makeEntrantChart, drawStatusChart };
