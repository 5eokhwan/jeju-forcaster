const DATAS = {
  PopulationDense: null,
  Center: null,
  Status: null,
  EntrantData: null,
  Institution: null,
};

async function getDense() {
  if (DATAS.PopulationDense) return DATAS.PopulationDense;
  let res = await fetch("/api/dense");
  res = await res.json();
  DATAS.PopulationDense = res.datas;
  console.log(DATAS.PopulationDense);
  return DATAS.PopulationDense;
}

async function getCenter() {
  if (DATAS.Center) return DATAS.Center;
  let res = await fetch("/api/center");
  res = await res.json();
  let centers = res.centers;
  DATAS.Center = centers;
  return DATAS.Center;
}

async function getStatus() {
  if (DATAS.Status) return DATAS.Status;
  const res = await fetch("/api/status");
  const data = await res.json();
  DATAS.Status = data;
  return DATAS.Status;
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
  DATAS.EntrantData = result;
  return result;
}
async function getInstitution() {
  if (DATAS.Institution) return DATAS.Institution;
  const res = await fetch("/api/institution");
  const data = await res.json();
  DATAS.Institution = data;
  return DATAS.Institution;
}

export default {
  getDense,
  getCenter,
  getStatus,
  getEntrantData,
  getInstitution,
};
