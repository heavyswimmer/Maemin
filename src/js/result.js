const hotplace = document.querySelector("#hotplace");
const resultPage = document.querySelector("#result");
const mapPage = document.querySelector("#result_map");
const main = document.querySelector("main");

hotplace.addEventListener("click", function () {
  resultPage.classList.add("hide");
  mapPage.classList.remove("hide");
  main.classList.add("hide");

  // 키워드로 장소를 검색합니다
  searchPlaces();
  // 지도 영역 재설정
  map.relayout();
});
