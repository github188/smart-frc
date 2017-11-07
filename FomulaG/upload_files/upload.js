var uploadArea = document.querySelector('#uploadArea');
var uploadInput = document.querySelector('#uploadInput');

uploadArea.addEventListener('click', function () {
  uploadInput.click();
}, false);

uploadInput.addEventListener('change', function () {
  uploadArea.innerText = '图片已添加';
  uploadArea.classList.add('selected');
  document.querySelector('button').classList.add('selected');
}, false);
