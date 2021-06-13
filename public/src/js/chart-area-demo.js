// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

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

makeStrightChart();
async function makeStrightChart() {
  // Area Chart Example
  const data = await getEntrantData();
  const ctx = document.getElementById("entrantChart");
  const entrantChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.entrant.xs.slice(7, data.entrant.xs.length),
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
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              maxTicksLimit: 5,
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
              maxTicksLimit: 5,
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
async function getEntrantData() {
  const entrantRes = await fetch("/api/entrant");
  const predictEntrantRes = await fetch("/api/predictEntrant");
  const fetchedData = await entrantRes.json();
  const fetchedPredictData = await predictEntrantRes.json();
  const result = {};
  for (let theData of [fetchedData, fetchedPredictData]) {
    const xs = [];
    const ys = [];
    const datas = theData.datas;
    datas.forEach((data) => {
      const date = data.date;
      const come = data.come;
      xs.push(date);
      ys.push(come);
    });
    const count = theData.sum;
    result[theData.name] = { xs, ys, count };
  }
  return result;
}
