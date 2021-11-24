const hotplace = document.querySelector("#hotplace");
const resultPage = document.querySelector("#result");
const mapPage = document.querySelector("#result_map");

hotplace.addEventListener("click", function () {
  resultPage.classList.add("hide");
  mapPage.classList.remove("hide");

  // 키워드로 장소를 검색합니다
  searchPlaces();
  // 지도 영역 재설정
  map.relayout();
});
