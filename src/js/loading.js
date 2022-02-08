const loadingPage = document.getElementById("loading");

// img element의 src를 만들기 위한 배열입니다
const loadingImages = [
  "chicken.svg",
  "noodle.svg",
  "pizza.svg",
  "soup.svg",
  "sushi.svg",
];

// img element가 들어갈 div 입니다
const imgBlock = document.querySelector("#center-img");

// 만들어진 img element를 넣기 위한 배열입니다
const loadingImagesArr = [];

let imageIndex = -1;

// loading 이미지가 있는 element를 만들어 배열에 넣는 함수입니다
function makeLodingImages() {
  for (let i = 0; i < loadingImages.length; i++) {
    const imgElement = document.createElement("img");
    imgElement.src = "../src/assets/images/svg/" + loadingImages[i];
    imgElement.className = "load-image hide";
    imgBlock.appendChild(imgElement);
    loadingImagesArr.push(imgElement);
    // console.log(loadingImagesArr);
  }
  changeLodingImage();
}

// loading 이미지가 바뀌는 효과를 주기 위한 함수입니다
function changeLodingImage() {
  if (imageIndex >= 0) {
    loadingImagesArr[imageIndex].classList.add("hide");
  }
  imageIndex = imageIndex + 1;
  if (imageIndex == 5) {
    imageIndex = 0;
  }
  loadingImagesArr[imageIndex].classList.remove("hide");
  // console.log(imageIndex);
}

// 로딩화면에서 결과화면으로 넘어가기 위한 함수입니다
function showResultPage() {
  clearInterval;
  loadingPage.classList.add("hide");
  resultPage.classList.remove("hide");
  main.classList.add("bgdark");
}

if (!loadingPage.classList.contains("hide")) {
  setInterval(changeLodingImage, 200);
  setTimeout(showResultPage, 2000);
  makeLodingImages();
}
