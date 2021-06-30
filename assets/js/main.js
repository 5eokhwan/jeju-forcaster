import render from "./render.js";
import dataLoader from "./dataLoader.js";
import drawChart from "./drawChart.js";

render.renderDense(await dataLoader.getDense());
render.renderCenter(await dataLoader.getCenter());
render.renderInstitution(await dataLoader.getInstitution());
render.renderAll();

let $selectedDisplay = render.mapInfoDisplayNode.$all;
var $selectedFilter = document.querySelector("#map-flters > li");
const filterBtns = document.querySelectorAll(".filterBtn");
const $filterUsableInstitution = document.querySelector(
  "#filterUsableInstitution"
);

$filterUsableInstitution.addEventListener("change", (e) => {
  if (e.target.checked)
    all_circles.forEach((circle) => {
      if (circle.filter === "institution" && !circle.usable)
        circle.setVisible(false);
    });
  else
    all_circles.forEach((circle) => {
      if (circle.filter === "institution") circle.setVisible(true);
    });
});
function selectFilter(e, el = null) {
  if (e && e.target.type === "checkbox") return;
  if ($selectedFilter) $selectedFilter.classList.remove("filter-active");
  if (!el) el = e.target;
  $selectedFilter = el;
  el.classList.add("filter-active");
  renderDisplay(el);
}
async function renderDisplay(el) {
  if ($selectedDisplay) $selectedDisplay.style.display = "none";
  switch (el.dataset.filter) {
    case "all":
      $selectedDisplay = render.mapInfoDisplayNode.$all;
      break;
    case "dense":
      $selectedDisplay = render.mapInfoDisplayNode.$dense;
      break;
    case "center":
      $selectedDisplay = render.mapInfoDisplayNode.$center;
      break;
    case "institution":
      $selectedDisplay = render.mapInfoDisplayNode.$institution;
      break;
  }
  $selectedDisplay.style.display = "block";
}
function addEvent() {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", selectFilter);
  });
}
addEvent();

//-------------------------------------------
var map = null;
const defaultZoom = 11;
let JEJU_CENTER = new naver.maps.LatLng(33.37607921112749, 126.52889280288728);
map = new naver.maps.Map("map", {
  center: JEJU_CENTER,
  zoom: defaultZoom,
});

let denseInfoNodes = document.querySelectorAll(".denseInfo");
let centerInfoNodes = document.querySelectorAll(".centerInfo");
let institutionInfoNodes = document.querySelectorAll(".institutionInfo");
let all_circles = [];
let filterCheckBoxes = document.querySelectorAll(".filterCheckBox");

let filterCheckListener = (e, el = null) => {
  if (!el) el = e.target;
  all_circles.forEach((circle) => {
    if (circle.filter === el.dataset.filter) {
      if (el.checked) circle.setVisible(true);
      else circle.setVisible(false);
    }
  });
  if (el.dataset.filter === "institution") {
    if (el.checked) {
      $filterUsableInstitution.style.display = "";
      $filterUsableInstitution.childNodes[2].checked = false;
    } else $filterUsableInstitution.style.display = "none";
  }
};

filterCheckBoxes.forEach((box) => filterCheckListener(null, box));

filterCheckBoxes.forEach((box) =>
  box.addEventListener("change", filterCheckListener)
);

async function drawFigure() {
  const dense_datas = await dataLoader.getDense();
  const center_datas = await dataLoader.getCenter();
  let institution_datas = await dataLoader.getInstitution();
  institution_datas = institution_datas.datas;

  let dense_circles = [];
  let center_circles = [];
  let institution_circles = [];
  dense_datas.forEach((data, i) => {
    dense_circles.push(
      new naver.maps.Circle({
        map: map,
        center: new naver.maps.LatLng(data.latitude, data.longitude),
        radius: 1000,
        strokeColor: "red",
        fillColor: "red",
        fillOpacity: 0.5 / (data.rank * 0.9) + 0.08,
        clickable: true,
        rank: data.rank,
        filter: "dense",
        node: denseInfoNodes[i],
      })
    );
  });
  center_datas.forEach((data, i) => {
    center_circles.push(
      new naver.maps.Circle({
        map: map,
        center: new naver.maps.LatLng(data.lat, data.lng),
        radius: 800,
        strokeColor: "blue",
        fillColor: "blue",
        fillOpacity: 0.5,
        clickable: true,
        filter: "center",
        node: centerInfoNodes[i],
      })
    );
  });
  institution_datas.forEach((data, i) => {
    institution_circles.push(
      new naver.maps.Circle({
        map: map,
        center: new naver.maps.LatLng(data.latitude, data.longitude),
        radius: 350,
        strokeColor: "green",
        fillColor: data.possibleTm && data.hldyYn === "N" ? "green" : "gray",
        fillOpacity: 0.3,
        clickable: true,
        filter: "institution",
        node: institutionInfoNodes[i],
        usable: data.possibleTm && data.hldyYn !== "Y" ? true : false,
      })
    );
  });
  all_circles = [...dense_circles, ...center_circles, ...institution_circles];
  all_circles.forEach((circle) => addCircleEvent(circle));
}
drawFigure();

let setInterect = () => {
  map.setOptions({
    //지도 인터랙션 켜기
    draggable: true,
    pinchZoom: true,
    scrollWheel: true,
    keyboardShortcuts: true,
    disableDoubleTapZoom: false,
    disableDoubleClickZoom: false,
    disableTwoFingerTapZoom: false,
  });
};
let setNoInterect = () => {
  map.setOptions({
    //지도 인터랙션 끄기
    draggable: false,
    pinchZoom: false,
    scrollWheel: false,
    keyboardShortcuts: false,
    disableDoubleTapZoom: true,
    disableDoubleClickZoom: true,
    disableTwoFingerTapZoom: true,
  });
};
setNoInterect();
let $mapInterectionBtn = document.getElementById("mapInterectionBtn");
$mapInterectionBtn.addEventListener("change", function (e) {
  e.preventDefault();
  if (!this.checked && map.getOptions("draggable")) {
    setNoInterect();
  } else {
    setInterect();
  }
});
let $centerBtn = document.getElementById("centerBtn");
$centerBtn.addEventListener("click", (e) => {
  map.setOptions({
    center: JEJU_CENTER,
    zoom: defaultZoom,
  });
});

function activeLocate(circle) {
  circle.setOptions({
    strokeColor: "yellow",
    strokeWeight: 3,
  });
  circle.node.classList.add("active");
}
function passiveLocate(circle) {
  if (circle.filter === "dense") {
    circle.setOptions({
      strokeColor: "red",
      strokeWeight: 1,
    });
  } else if (circle.filter === "center") {
    circle.setOptions({
      strokeColor: "blue",
      strokeWeight: 1,
    });
  } else if (circle.filter === "institution") {
    circle.setOptions({
      strokeColor: "green",
      strokeWeight: 1,
    });
  }
  circle.node.classList.remove("active");
}
//위치원 이벤트-----
function addCircleEvent(circle) {
  naver.maps.Event.addListener(circle, "mouseover", function (e) {
    let currentNode;
    let totalHeight = 0;
    if (circle.filter === "dense") {
      selectFilter(null, filterBtns[1]);
      currentNode = render.mapInfoDisplayNode.$dense;
      totalHeight = currentNode.offsetHeight;
    } else if (circle.filter === "center") {
      selectFilter(null, filterBtns[2]);
      currentNode = render.mapInfoDisplayNode.$center;
      totalHeight = currentNode.offsetHeight;
    } else if (circle.filter === "institution") {
      selectFilter(null, filterBtns[3]);
      currentNode = render.mapInfoDisplayNode.$institution;
      totalHeight = currentNode.offsetHeight;
    }
    render.mapInfoDisplayNode.$infoDisplay.scrollTo(
      0,
      circle.node.offsetTop - 130
    );
    activeLocate(circle);
  });
  circle.node.addEventListener("mouseover", (e) => {
    activeLocate(circle);
  });
  naver.maps.Event.addListener(circle, "mouseout", function (e) {
    passiveLocate(circle);
  });
  circle.node.addEventListener("mouseout", (e) => {
    passiveLocate(circle);
  });
  const clickListener = (e) => {
    if (
      Math.floor(map.getOptions("center").y * 10000) / 10000 ===
        Math.floor(circle.center.y * 10000) / 10000 &&
      map.getOptions("zoom") === defaultZoom + 3
    ) {
      map.setOptions({
        center: JEJU_CENTER,
        zoom: defaultZoom,
      });
    } else {
      map.setOptions({
        center: circle.center,
        zoom: defaultZoom + 3,
      });
    }
  };
  circle.node.addEventListener("click", clickListener);
  naver.maps.Event.addListener(circle, "click", clickListener);
}
//END-------------
drawChart.makeEntrantChart();
drawChart.drawStatusChart();

let heroDenseBtn = document.getElementById("hero-Dense-Btn");
let heroCenterBtn = document.getElementById("hero-Center-Btn");
let heroInstitutionBtn = document.getElementById("hero-Institution-Btn");

heroDenseBtn.addEventListener("click", () => {
  filterCheckBoxes.forEach((box) => {
    box.checked = false;
    filterCheckListener(null, box);
  });
  filterCheckBoxes[0].checked = true;
  selectFilter(null, filterBtns[1]);
  filterCheckListener(null, filterCheckBoxes[0]);
});
heroCenterBtn.addEventListener("click", () => {
  filterCheckBoxes.forEach((box) => {
    box.checked = false;
    filterCheckListener(null, box);
  });
  filterCheckBoxes[1].checked = true;
  selectFilter(null, filterBtns[2]);
  filterCheckListener(null, filterCheckBoxes[1]);
});
heroInstitutionBtn.addEventListener("click", () => {
  filterCheckBoxes.forEach((box) => {
    box.checked = false;
    filterCheckListener(null, box);
  });
  filterCheckBoxes[2].checked = true;
  selectFilter(null, filterBtns[3]);
  filterCheckListener(null, filterCheckBoxes[2]);
});
