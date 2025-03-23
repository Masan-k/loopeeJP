const DEFAULT_MODE = 'check';
const TIME_LIMIT = 20;
const GREAT_LIMIT = 5;
const GOOD_LIMIT = 10;

import * as question from './question.js';
import * as svg from './svg.js';

let m_clickCount;
let m_jsonData;
let m_gameStartTime;
let m_answerStartTime; 
let m_intervalId = null;
let m_gameScore;

const m_gameStatus = {
  data: -1,
  getData: function(){return this.data;},
  setData: function(newData){this.data = newData;}
};

init();
function init(){
  const REQUEST_URL = './contents.json';
  const eleCheckboxCodes = document.querySelectorAll('input[name="selectCode"]');
  const eleRadios = document.querySelectorAll('input[name="btnradio"]');
  const buttons = ['buttonStart', 'buttonSubmit', 'buttonMenu', 'buttonPrevious' , 'buttonNext', 'buttonPass'];
  let request = new XMLHttpRequest(); 

  eleCheckboxCodes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.addEventListener('change', function(){
      svg.drawMarkToGroupCode(m_jsonData, getSelectedTargetCodes(), getSelectedMode());
    });
  });

  window.buttonSubmit = clickSubmit;
  window.buttonStart = clickStart;
  window.buttonMenu = clickMenu;
  window.buttonPrevious = clickPrevious;
  window.buttonNext = clickNext;
  window.buttonPass = clickPass;

  buttons.forEach(id => {
    document.getElementById(id).addEventListener('click', window[id]);
  });
  eleRadios.forEach(radio => {
    if(DEFAULT_MODE === radio.dataset.index){
      radio.checked = true;
    }
  }); 

  request.open('GET', REQUEST_URL);
  request.responseType = 'json';
  request.send();
  request.onload = function (){
    m_jsonData = request.response;
    setStatus('select');
  }
  document.addEventListener("keydown", function(event){
    if(event.key == "Enter" && m_gameStatus.getData() == "mainClear"){
      clickSubmit();
    }
  });
  // ----------
  // MAP draw
  // ----------
  ;(function(){
    const eleColor = document.getElementById("checkColor");
    const eleBorder = document.getElementById("checkBorder");
    eleColor.checked = true;
    eleBorder.checked = true;

    eleColor.addEventListener("change", function(){
      svg.drawMapFullMainContainer(eleColor.checked, eleBorder.checked);
      setTimeout(function(){
        svg.drawMarkToGroupCode(m_jsonData, getSelectedTargetCodes(), getSelectedMode());
      },300)
    });
    eleBorder.addEventListener("change", function(){
      svg.drawMapFullMainContainer(eleColor.checked, eleBorder.checked);
      setTimeout(function(){
        svg.drawMarkToGroupCode(m_jsonData, getSelectedTargetCodes(), getSelectedMode());
      },300)
    });
   })();
}  // init end

function updateProgress(time){
  const progressBar = document.getElementById('progress');
  let parsent = 100-(time*100/TIME_LIMIT).toFixed(0);
  let sec = TIME_LIMIT - time.toFixed(0);

  progressBar.style.width = parsent + '%';
  progressBar.textContent = sec + 'sec';
  progressBar.setAttribute('aria-valuenow',parsent);

  if(GREAT_LIMIT > time){
    if(progressBar.classList.contains('bg-warning')){
     progressBar.classList.remove('bg-warning');
    }
    if(progressBar.classList.contains('bg-danger')){
      progressBar.classList.remove('bg-danger');
    }

  }else if(GOOD_LIMIT > time && time > GREAT_LIMIT){
    if(!progressBar.classList.contains('bg-warning')){
      progressBar.classList.add('bg-warning');
    }
  }else if(time > GOOD_LIMIT){
    if(!progressBar.classList.contains('bg-danger')){
      progressBar.classList.add('bg-danger');
    }
    if(progressBar.classList.contains('bg-warning')){
     progressBar.classList.remove('bg-warning');
    }
  }
}

function setStatus(gameStatus){
  if(gameStatus === 'select'){
    m_gameStatus.setData("select");
    const eleGameStatus = document.getElementById("gameStatus"); 
    const eleEntry = document.getElementById('entryAnswer');
    const eleCode = document.getElementById('questionCode');
    const eleSubmit = document.getElementById("buttonSubmit");
    const eleStart = document.getElementById("buttonStart");
    const elePass = document.getElementById("buttonPass");
    const eleSelect = document.getElementById("select-container");
    const eleHint = document.getElementById('hint');
    const eleMenu = document.getElementById('buttonMenu');
    const eleNext = document.getElementById('buttonNext');
    const elePrevious = document.getElementById('buttonPrevious');

    const eleLeft = document.getElementById('left-container');
    const eleRight = document.getElementById('right-container');

    const eleColor = document.getElementById("checkColor");
    const eleBorder = document.getElementById("checkBorder");

    const eleSideCon = document.getElementById("side-container");
    const eleProgress = document.getElementById("progress-container");

    resetResultLabel()
    svg.drawMapFullMainContainer(eleColor.checked, eleBorder.checked);
    setTimeout(function(){
      svg.drawMarkToGroupCode(m_jsonData, getSelectedTargetCodes(), getSelectedMode());
    },300)
  
    if(m_intervalId != null){ 
      clearInterval(m_intervalId);
    }

    updateProgress(0);
    eleEntry.value = '';
    eleCode.textContent = 'XX';
    eleGameStatus.textContent = 'Click START..';
    eleHint.textContent = '';

    eleSubmit.style.display = "none";
    eleStart.style.display = "inline-block";
    eleSelect.classList.remove('d-none');
    eleMenu.classList.add('d-none');
    eleNext.classList.add('d-none');
    elePass.classList.add('d-none');
    elePrevious.classList.add('d-none');
    eleSideCon.classList.add("d-none");
    eleProgress.classList.add("d-none");

    eleLeft.classList.remove('border');
    eleRight.classList.remove('border');
    
  }else if(gameStatus === 'mainInit'){
    m_gameStatus.setData("mainInit");
    const eleEntryAnswer = document.getElementById('entryAnswer');
    const eleSubmit = document.getElementById('buttonSubmit');
    const eleSub = document.getElementById('sub-container');
    const eleSelect = document.getElementById("select-container");
    const eleMenu = document.getElementById('buttonMenu');
    const eleGameStatus = document.getElementById("gameStatus");
    const eleCode = document.getElementById("questionCode");
    const eleStart = document.getElementById("buttonStart");
    const eleHint = document.getElementById('hint');
    const eleLeft = document.getElementById('left-container');
    const eleRight = document.getElementById('right-container');
    const eleColor = document.getElementById("checkColor");
    const eleBorder = document.getElementById("checkBorder");
 
    const eleSideCon = document.getElementById("side-container");
    const eleProgress = document.getElementById("progress-container");

    resetResultLabel()
    m_clickCount = 0;
    m_gameScore = 0;
    m_gameStartTime = Date.now();
    m_answerStartTime = Date.now();

    question.setData(m_jsonData,getSelectedMode(),getSelectedTargetCodes());

    eleEntryAnswer.addEventListener('compositionend', (e) => {
      if(checkEntry()){setNextQuestion();}
    });

    eleSubmit.value = 'SUBMIT';
    eleEntryAnswer.value = '';
    eleEntryAnswer.focus();
    eleSub.classList.remove('d-none');
    eleMenu.classList.remove('d-none');
    eleSideCon.classList.remove("d-none");
    eleProgress.classList.remove("d-none");

    eleGameStatus.textContent =  '...';
    eleCode.innerText = question.code[m_clickCount];
    eleSubmit.style.display = "inline-block";
    eleStart.style.display = "none";

    eleSelect.classList.add('d-none');
    eleLeft.classList.add('border');
    eleRight.classList.add('border');
    
    svg.setObserverGame();
    svg.draw(question.pos[m_clickCount][0], question.pos[m_clickCount][1], eleColor.checked, eleBorder.checked);
    m_clickCount += 1;

  }else if(gameStatus === 'main'){
    m_gameStatus.setData("main");
    const elePass = document.getElementById("buttonPass");
    elePass.classList.remove('d-none');

    m_intervalId = setInterval(() => {
      const eleGameStatus = document.getElementById('gameStatus')
      const eleResultLabel = document.getElementById('resultLabel');
      
      eleGameStatus.textContent = m_gameScore + ' : ' + ((Date.now() - m_gameStartTime) / 1000).toFixed(0);
      let elapsedTime = (Date.now() - m_answerStartTime) / 1000;

      if(TIME_LIMIT < elapsedTime){
        checkEntry(true);
        //eleResultLabel.textContent += question.answer[m_clickCount-1];
        setNextQuestion();

      }else{
        eleResultLabel.style.opacity -= 0.05;
        updateProgress(elapsedTime);
      }   
    },100);

  }else if(gameStatus === "mainClear"){
    m_gameStatus.setData("mainClear");
    const eleGameStatus = document.getElementById('gameStatus');
    const eleSubmit = document.getElementById('buttonSubmit');
    const eleEntryAnswer = document.getElementById('entryAnswer');

    clearInterval(m_intervalId);
    eleGameStatus.innerText = 'CLEAR!! -->';
    eleSubmit.value = 'RETRY';
    eleEntryAnswer.value = 'CLEAR...';
    saveScore();

  }else if(gameStatus === 'mainCheck'){
    m_gameStatus.setData("mainCheck");
    const eleNext = document.getElementById('buttonNext');
    const elePrevious = document.getElementById('buttonPrevious');
    const eleAnswer = document.getElementById('entryAnswer');
    const eleSubmit = document.getElementById('buttonSubmit');
    eleNext.classList.remove('d-none');
    elePrevious.classList.remove('d-none');
    eleSubmit.style.display = "none";

    if(question.kana[m_clickCount-1].length == 0){
      eleAnswer.value = question.answer[m_clickCount-1];
    }else{
      eleAnswer.value = question.answer[m_clickCount-1] + "/" + question.kana[m_clickCount-1];
    }
  }
}
function getSelectedMode(){
  const eleRadios = document.querySelectorAll('input[name="btnradio"]');
  for (const radio of eleRadios) {
    if (radio.checked) {
      return radio.dataset.index;
    }
  }
  return null;
} 

function getSelectedTargetCodes(){
  const eleCheckboxCodes = document.querySelectorAll('input[name="selectCode"]');
  let selectGroupCodes = [];
  eleCheckboxCodes.forEach(checkbox => {
    const label = document.querySelector('label[for='+ checkbox.id  +']');
    if(checkbox.checked){
      selectGroupCodes.push(label.textContent.trim());
    }
  });
  return selectGroupCodes;
}

function clickStart(){
  if(getSelectedTargetCodes().length === 0){
    alert("Please select a number.");
  }else{
    setStatus('mainInit');
    if(getSelectedMode() === 'check'){
      setStatus('mainCheck');
    }else{
      setStatus('main');
    }
  }
}

function drawQuestionData(){
  const eleAnswer = document.getElementById('entryAnswer');
  const eleCode = document.getElementById('questionCode');
  const eleColor = document.getElementById("checkColor");
  const eleBorder = document.getElementById("checkBorder");
 
  if(question.kana[m_clickCount-1].length == 0){
    eleAnswer.value = question.answer[m_clickCount-1];
  }else{
    eleAnswer.value = question.answer[m_clickCount-1] + "/" +  question.kana[m_clickCount-1] ;
  }
  eleCode.textContent = question.code[m_clickCount-1];
  svg.draw(question.pos[m_clickCount-1][0],question.pos[m_clickCount-1][1], eleColor.checked, eleBorder.checked);
}

function clickPrevious(){
  if(m_clickCount >= 2){
    m_clickCount -= 1;
    drawQuestionData();
  }
}

function clickNext(){
  if(m_clickCount < question.code.length){
    m_clickCount += 1;
    drawQuestionData();
  }
}

function saveScore(){
  const eleGameStatus = document.getElementById('gameStatus')
  let nowDate = new Date();
  let year = nowDate.getFullYear();
  let month = ('00' + (nowDate.getMonth()+1)).slice(-2);
  let day = ('00' + nowDate.getDate()).slice(-2);
  let hour = ('00' + nowDate.getHours()).slice(-2);
  let minute = ('00' + nowDate.getMinutes()).slice(-2);
  let second = ('00' + nowDate.getSeconds()).slice(-2);

  let time = (Date.now() - m_gameStartTime) / 1000;
  let rank;
  let maxScore = question.code.length * 2;
  if(m_gameScore >= maxScore * 8/9){rank = 'AAA';}
  else if(m_gameScore >= maxScore * 7/9){rank = 'AA';}
  else if(m_gameScore >= maxScore * 6/9){rank = 'A';}
  else if(m_gameScore >= maxScore * 5/9){rank = 'B';}
  else if(m_gameScore >= maxScore * 4/9){rank = 'C';}
  else if(m_gameScore >= maxScore * 3/9){rank = 'D';}
  else if(m_gameScore >= maxScore * 2/9){rank = 'E';}
  else{rank = 'F';}

  localStorage.setItem('loopeeTokyo' + ',' + getSelectedMode() + ',' + getSelectedTargetCodes().join("") + ',' + year + month + day + hour + minute + second,m_gameScore + ',' + rank + ',' + time);
  eleGameStatus.innerText = eleGameStatus.innerText + ' ' + rank + ' @' + time + ' sec'; 
}

function setNextQuestion(){
  if(m_clickCount >= question.code.length){
    setStatus("mainClear");
  }else{
    const eleEntryAnswer = document.getElementById('entryAnswer');
    const eleResultLabel = document.getElementById('resultLabel');
    const eleCode = document.getElementById("questionCode");

    const eleColor = document.getElementById("checkColor");
    const eleBorder = document.getElementById("checkBorder");

    eleCode.innerText = question.code[m_clickCount];
    svg.draw(question.pos[m_clickCount][0], question.pos[m_clickCount][1], eleColor.checked, eleBorder.checked);
    
    m_clickCount += 1;
    m_answerStartTime = Date.now();
    eleEntryAnswer.value = '';

  }
}

function resetResultLabel(){
  let ele = document.getElementById('resultLabel');
  ele.style.opacity = 1;
  ele.textContent = '';
  if(ele.classList.contains('alert-primary')){
      ele.classList.remove('alert-primary');
  }
  if(ele.classList.contains('alert-warning')){
      ele.classList.remove('alert-warning');
  }
  if(ele.classList.contains('alert-danger')){
      ele.classList.remove('alert-danger');
  }
}
function checkEntry(isTimeOver=false){
  let eleEntryAnswer = document.getElementById('entryAnswer');
  let eleResultLabel = document.getElementById('resultLabel');

  if(question.answer[m_clickCount-1] === eleEntryAnswer.value){
    let elapsedTime = (Date.now() - m_answerStartTime) / 1000;
    let plusScore = 0;

    resetResultLabel();
    if(GREAT_LIMIT >= elapsedTime){
      eleResultLabel.textContent = 'GREAT';
      eleResultLabel.classList.add('alert-primary');
      plusScore = 2;
    }else if(GOOD_LIMIT >= elapsedTime){
      eleResultLabel.textContent = 'GOOD'; 
      eleResultLabel.classList.add('alert-warning');
      plusScore = 1;
    }else{
      eleResultLabel.textContent = 'BAD'; 
      eleResultLabel.classList.add('alert-danger');
    }
    m_gameScore += plusScore;
    return true;

  }else{
    if(isTimeOver){
      resetResultLabel();
      eleResultLabel.classList.add('alert-danger');
      eleResultLabel.textContent = 'NG:' + question.answer[m_clickCount-1];
      eleEntryAnswer.value = '';
    }
    return false;
  }
}
function clickSubmit(){
  if(typeof question.pos != 'undefined'){
    const eleSubmit = document.getElementById('buttonSubmit');
    if(eleSubmit.value==='RETRY'){
      setStatus('mainInit');
      setStatus('main');
    }else{
      if(checkEntry(true)){
        setNextQuestion();
      }
    }
  }
}
function clickPass(){
  const eleAnswer = document.getElementById('entryAnswer');
  checkEntry(true);
  setNextQuestion();
  eleAnswer.focus();
}

function clickMenu(){
  const eleSub = document.getElementById('sub-container');
  const eleColor = document.getElementById("checkColor");
  const eleBorder = document.getElementById("checkBorder");

  svg.draw(9999,9999,eleColor.checked, eleBorder.checked);  //マークを非表示（キャンバス外に描画）
  svg.disconnect();
  eleSub.classList.add('d-none');
  setStatus('select');
}
