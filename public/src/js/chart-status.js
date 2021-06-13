setStatus();

async function setStatus() {
  const statusData = await getStatusData();
  const occur = statusData.occur;
  const vaccine = statusData.vaccine;
  //console.log(vaccine);
  const len = occur["stdDay"].length;

  for (let key in occur) {
    if (key === "stdDay") continue;
    document.getElementById(`${key}Result`).innerText = occur[key][len - 1];
    let increase = occur[key][len - 1] - occur[key][len - 2];
    increase = increase > 0 ? "+" + increase : increase;
    document.getElementById(`${key}Increase`).innerText = increase;

    makeStatusChart(occur.stdDay, occur[key], key);
  }
  for (let key in vaccine) {
    if (key === "baseDate") continue;
    document.getElementById(`${key}Result`).innerText = vaccine[key][len - 1];
    let increase = vaccine[key][len - 1] - vaccine[key][len - 2];
    increase = increase > 0 ? "+" + increase : increase;
    document.getElementById(`${key}Increase`).innerText = increase;
    makeStatusChart(vaccine.baseDate, vaccine[key], key);
  }
  document.getElementById("statusUpdateText").innerText = `(update :${
    occur.stdDay[len - 1]
  } | ${vaccine.baseDate[len - 1]})`;
}
function makeStatusChart(xs, ys, key) {
  console.log(xs, ys);

  const data = {
    labels: xs,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: colorObj[key],
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

let colorObj = {
  defCnt: "#e74a3b",
  isolClearCnt: "#4e73df",
  deathCnt: "#5a5c69",
  localOccCnt: "#f6c23e",
  firstCnt: "#1cc88a",
  secondCnt: "#1cc88a",
  totalFirstCnt: "#36b9cc",
  totalSecondCnt: "#36b9cc",
};
// Primary
// #4e73df
// Success
// #1cc88a
// Info
// #36b9cc
// Warning
// #f6c23e
// Danger
// #e74a3b
// Secondary
// #858796
// Light
// #f8f9fc
// Dark
// #5a5c69
