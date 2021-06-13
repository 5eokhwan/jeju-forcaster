// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";
makePieChart();
async function makePieChart() {
  let datas = await getPopulationDense();

  let drawKey = ["city", "town", "category"];

  drawKey.forEach((key) => {
    let showingData = [];
    datas.forEach((data) => showingData.push(data[key]));
    let obj = {};
    for (let x of showingData) {
      if (!obj.hasOwnProperty(x)) obj[x] = 1;
      else obj[x]++;
    }
    let ctx = document.getElementById(`${key}Chart`);
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
          display: true,
        },
        cutoutPercentage: 80,
      },
    });
  });
}
