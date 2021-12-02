// 마커를 담을 배열입니다
var markers = [];

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(37.6245059502387, 126.726056403489), // 지도의 중심좌표
    level: 2, // 지도의 확대 레벨
  };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
  var keyword = document.getElementById("keyword").value;

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  // ps.keywordSearch(keyword, placesSearchCB);

  ps.keywordSearch(keyword, placesSearchCB, {
    location: mapOption.center,
    radius: 1000,
    sort: kakao.maps.services.SortBy.DISTANCE,
  });
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

    // 페이지 번호를 표출합니다
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
  var listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_wrap"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "";

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    //커스텀 오버레이 설정
    var customOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(places[i].y, places[i].x),
      content:
        '<div class="info-window shadow">' +
        ' <span class="info-window__info">' +
        places[i].place_name +
        "</span> </div>",
    });

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, customOverlay) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        showMarkerName(customOverlay);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        eraseMarkerName(customOverlay);
      });

      kakao.maps.event.addListener(marker, "click", function () {
        for (var i = 0; i < places.length; i++) {
          if (customOverlay.a.innerText === places[i].place_name) {
            const embed = document.querySelector("embed");
            embed.src = "https://place.map.kakao.com/m/" + places[i].id;
            modalOn();
          }
        }
      });

      itemEl.onmouseover = function () {
        showMarkerName(customOverlay);
      };

      itemEl.onmouseout = function () {
        eraseMarkerName(customOverlay);
      };

      itemEl.onclick = function () {
        const movePosition = customOverlay.n;
        map.panTo(movePosition);
      };
    })(marker, customOverlay);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);

  // 지도를 이동시켜도 주변식당보기를 누르면 다시 검색된 위치로 돌아오게 합니다
  const mySearch = document.querySelector(".title");

  mySearch.addEventListener("click", function () {
    map.setBounds(bounds);
  });
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement("li");
  itemStr =
    '<div class="info">' +
    '<span class="primary-color">' +
    places.place_name +
    "</span>" +
    '<span id="more" onclick="displayMoreInfo(' +
    places.id +
    ');">' +
    '<img src="../src/assets/images/up-arrow.png" alt="read more"/>' +
    "</span>";

  if (places.road_address_name) {
    itemStr += "    <span>" + places.road_address_name + "</span>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span>";
  }

  if (places.phone) {
    itemStr +=
      '<i class="fas fa-phone-alt"></i>  <span class="tel"> ' +
      places.phone +
      "</span>" +
      "</div>";
  } else {
    itemStr +=
      '<i class="fas fa-phone-alt"></i>  <span class="tel"> 전화번호 없음 </span> </div> ';
  }

  el.innerHTML = itemStr;
  el.className = "item";

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
  var imageSrc = "../src/assets/images/marker.png", // 마커 이미지
    imageSize = new kakao.maps.Size(40, 40), // 마커 이미지의 크기
    imgOptions = { offset: new kakao.maps.Point(27, 69) };

  (markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions)),
    (marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    }));

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

function showMarkerName(customOverlay) {
  customOverlay.setMap(map);
}

function eraseMarkerName(customOverlay) {
  customOverlay.setMap(null);
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

function displayMoreInfo(id) {
  const embed = document.querySelector("embed");
  embed.src = "https://place.map.kakao.com/m/" + id;
  modalOn();
}

document.addEventListener("mouseover", function (event) {
  const target = event.target;
  const child = target.childNodes;
  const childArray = Array.from(child);
  // console.log(event.target);

  if (target.className === "info") {
    // console.log(child);
    childArray[0].classList.remove("primary-color");
    childArray[0].classList.add("hover-color");
    childArray[1].classList.add("arrow-color");
  }

  if (target.id === "more") {
    target.previousSibling.classList.add("white-color");
  }
});

document.addEventListener("mouseout", function (event) {
  const target = event.target;
  const child = target.childNodes;
  const childArray = Array.from(child);
  // console.log(target);

  if (target.className === "info") {
    childArray[0].classList.remove("hover-color");
    childArray[0].classList.add("primary-color");
    childArray[1].classList.remove("arrow-color");
  }

  if (target.id === "more") {
    target.previousSibling.classList.remove("white-color");
  }
});

const backBtn = document.querySelector("#goBackBtn");

backBtn.addEventListener("click", function () {
  resultPage.classList.remove("hide");
  mapPage.classList.add("hide");
  main.classList.remove("hide");

  const animationElements = document.querySelectorAll(
    ".head, .food, .hashtag, #hotplace, #again"
  );

  animationElements.forEach((element) => {
    element.classList.add("noanimation");
  });

  const nocongrats = document.querySelector(".congrats");
  nocongrats.classList.add("nocongrats");
});

// *** 모달 *** //
const placeModal = document.getElementById("place_modal");

// = modal 창 =
function modalOn() {
  placeModal.style.display = "flex";
}
function isModalOn() {
  return placeModal.style.display === "flex";
}
function modalOff() {
  placeModal.style.display = "none";
}

const closeModal = placeModal.querySelector(".close-modal");
closeModal.addEventListener("click", (e) => {
  modalOff();
});

placeModal.addEventListener("click", (e) => {
  const evTarget = e.target;
  if (evTarget.classList.contains("modal-overlay")) {
    // modal 바깥부분 클릭 시 modal 닫기
    modalOff();
  }
});
window.addEventListener("keyup", (e) => {
  // esc 키 누르면 modal 없어짐
  if (isModalOn() && e.key === "Escape") {
    modalOff();
  }
});
