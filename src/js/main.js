const modal = document.getElementById("modal")
const myLocationBtn = document.getElementById("myLocationBtn") // 현재 위치 버튼
const locationBtn = document.getElementById("locationBtn")     // 위치 이미지 버튼


// = modal 창 =
function modalOn() {
  modal.style.display = "flex"
}
function isModalOn() {
  return modal.style.display === "flex"
}
function modalOff() {
  modal.style.display = "none"
}

myLocationBtn.addEventListener("click", e => {
  modalOn()
})

locationBtn.addEventListener("click", e => {
  modalOn()
})

const closeModal = modal.querySelector(".close-modal")
closeModal.addEventListener("click", e => {
  modalOff()
})
modal.addEventListener("click", e => {
  const evTarget = e.target
  if(evTarget.classList.contains("modal-overlay")) { // modal 바깥부분 클릭 시 modal 닫기
      modalOff()
  }
})
window.addEventListener("keyup", e => { // esc 키 누르면 modal 없어짐
  if(isModalOn() && e.key === "Escape") {
      modalOff()
  }
})


