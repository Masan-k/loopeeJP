/*globals window, document, setInterval, event , localStorage */
'use strict';

const m_targetCode = {
  data: -1,
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};

const m_mode = {
  data: -1,
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};

const m_json = {
  data: "-1",
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};

window.onload = function(){
  const requestURL = './contents.json'; //CROSSエラーコード
  let request = new XMLHttpRequest();

  const m_readyCount = {
    data: -1,
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };

  function init(){
    let param = location.search.split('&')
    if(param.length === 2){
      m_mode.setData(param[0].split('=')[1]);
      m_targetCode.setData(param[1].split('=')[1]);
    }else{
      alert('The parameters at the time of calling are not set.\n(url:' + location.href + ')\n\nPlease start from the menu screen.');
      return;
    }

    if(m_mode.getData() === 'veryEasy' || m_mode.getData() === 'easy' || m_mode.getData() === 'normal'){
      document.getElementById("imgMap").style.display ="block";

    }else if(m_mode.getData() ==='hard'){
      document.getElementById("imgMap").src = "./img/map_chiba_noline.svg";
      document.getElementById("imgMap").style.display ="block";
    }else{
      alert('The parameters are over');
      return;
    }

    m_readyCount.setData(2);
    prgTime.max = 120;
    prgTime.value = 120;
    lblQuestion.innerText = 'file loading..';

    lblScore.innerText = 'SCORE:';
    lblTime.innerText = 'TIME:';
    lblCount.innerText = 'COUNT:';
  }

  init();

  btnMenu.addEventListener("click", clickMenu, false); 
  btnRetry.addEventListener("click", clickRetry, false);

  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  
  request.onload = function (){
    m_json.setData(request.response);
    let intervalId = setInterval(firstStart => {
      if(m_readyCount.getData() < 0){
        clearInterval(intervalId);
        main();
        return;
      }
      let dot = '';
      for(let i=0;i<m_readyCount.getData();i++){
        dot += '.'; 
      }
      lblQuestion.innerText = 'Ready' + dot;
      m_readyCount.setData(m_readyCount.getData() - 1);
      prgTime.value += 1;

    },1000);
  }
}

function main(){

  const m_startTime = {
    data: -1,
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };

  const m_currentQuestion = {
    data: "-1",
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };
  const m_currentAnswer = {
    data: "-1",
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };
  const m_answerStartTime = {
    data: "-1",
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };
  const m_questionCount = {
    data: 0,
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };

  const m_gameScore = {
    data: -1,
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };

  function getRandom(min, max) {
      let range = max - min + 1;
      let random = Math.floor(Math.random() * range);
      return random + min;
  };
  const m_timeIntervalId = {
    data: "-1",
    getData: function () {return this.data;},
    setData: function (newData) {this.data = newData;}
  };

  const GREAT_SEC = 5;
  const GOOD_SEC = 10;
  const BAD_SEC = 15;

  let question;
  let answer;
  let pos;
  let kana;

  let ascQuestion = [];
  let ascAnswer = [];
  let ascPos = [];
  let ascKana = [];

  let workQuestion = [];
  let workAnswer = [];
  let workPos = [];
  let workKana = [];

  let randomQuestion = [];
  let randomAnswer = [];
  let randomPos = [];
  let randomKana = [];

  let workLength
  let gameTime;

  function saveScore(){
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = ('00' + (nowDate.getMonth()+1)).slice(-2);
    let day = ('00' + nowDate.getDate()).slice(-2);
    let hour = ('00' + nowDate.getHours()).slice(-2);
    let minute = ('00' + nowDate.getMinutes()).slice(-2);
    let second = ('00' + nowDate.getSeconds()).slice(-2);

    let time = lblTime.innerText.split(':')[1];
    let rank;
    let maxScore = workLength * 2;
    if(m_gameScore.getData() >= maxScore * 8/9){rank = 'AAA';}
    else if(m_gameScore.getData() >= maxScore * 7/9){rank = 'AA';}
    else if(m_gameScore.getData() >= maxScore * 6/9){rank = 'A';}
    else if(m_gameScore.getData() >= maxScore * 5/9){rank = 'B';}
    else if(m_gameScore.getData() >= maxScore * 4/9){rank = 'C';}
    else if(m_gameScore.getData() >= maxScore * 3/9){rank = 'D';}
    else if(m_gameScore.getData() >= maxScore * 2/9){rank = 'E';}
    else{rank = 'F';}

    localStorage.setItem('loopeeCHIBA' + ',' + m_mode.getData() + ',' + m_targetCode.getData() + ',' + year + month + day + hour + minute + second,m_gameScore.getData() + ',' + rank + ',' + time);
    lblQuestion.innerText = lblQuestion.innerText + rank; 
  }

  function setQuestion(){
    function drawMarker(cPos){
      if(cPos === undefined){return}
      const img = document.getElementById("imgMap");
      const svgDiv = document.getElementById("svgMarker");
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const circle= document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      let map = document.getElementById("mapContainer");
      let posX = cPos[0]*(img.offsetWidth/446);
      let posY = cPos[1]*(img.offsetHeight/570);

      txtInput.focus();
      if(svgDiv != null){svgDiv.remove();}

      svg.setAttribute("id", "svgMarker");
      svg.setAttribute("viewBox", "0 0 "+img.offsetWidth+" "+img.offsetHeight);
      svg.setAttribute("preserveAspectRatio", "xMinYMin meet");

      circle.setAttribute('cx','10');
      circle.setAttribute('cy','10');
      circle.setAttribute('r','10');
      circle.setAttribute('fill','none');
      circle.setAttribute('stroke','#EA4335');

      path.setAttribute('d',"M 0 10 C 3 23, 7 18, 10 30 T 10 30 C 12 18, 17 23, 20 10");
      path.setAttribute('fill',"none");
      path.setAttribute('stroke',"#EA4335");

      g.setAttribute("transform", "translate("+(posX-10)+","+(posY-30)+")");

      g.appendChild(path);
      g.appendChild(circle);
      svg.appendChild(g);
      map.appendChild(svg);

      svgMarker.style.position="absolute";
      //中央寄せ
      svgMarker.style.top = 0;
      svgMarker.style.left = 0;
      svgMarker.style.right = 0;
      svgMarker.style.margin = 'auto';
    }

    m_currentQuestion.setData(question.shift());
    lblQuestion.innerText = m_currentQuestion.getData();

    m_currentAnswer.setData(answer.shift());
    txtInput.value = '';

    drawMarker(pos.shift());

    m_answerStartTime.setData(Date.now());
    m_questionCount.setData(m_questionCount.getData()+1);
    lblCount.innerText = 'COUNT:' + m_questionCount.getData() + '/' + workLength;
  }

  for(let rec of m_json.getData()){
    if(rec.group === m_targetCode.getData() || m_targetCode.getData() === 'all'){
      ascQuestion.push(rec.code);
      ascAnswer.push(rec.name);
      ascPos.push(rec.pos);
      ascKana.push(rec.kana);
    }
  }

  workQuestion = ascQuestion.slice();
  workAnswer = ascAnswer.slice();
  workPos = ascPos.slice();
  workKana = ascKana.slice();
  workLength = workQuestion.length;
 
  //SHUFFLE
  if(m_mode.getData() === 'veryEasy'){
    randomQuestion = workQuestion;
    randomAnswer = workAnswer;
    randomPos = workPos;
    randomKana = workKana;

  }else{
    while(randomQuestion.length < workLength){
      for(let i in workQuestion){
        let trgIndex = getRandom(0 ,workQuestion.length - i - 1);
        randomQuestion.push(workQuestion[trgIndex]);
        randomAnswer.push(workAnswer[trgIndex]);
        randomPos.push(workPos[trgIndex]);
        randomKana.push(workKana[trgIndex]);

        workQuestion.splice(trgIndex, 1);
        workAnswer.splice(trgIndex, 1);
        workPos.splice(trgIndex, 1);
        workKana.splice(trgIndex, 1);
      }
    }
  }

  if(m_mode.getData() === 'veryEasy' || m_mode.getData() === 'easy'){
    question = ascQuestion.slice();
    answer = ascAnswer.slice();
    pos = ascPos.slice();
    kana = ascKana.slice();
   
    for (let index in randomAnswer) {
      if(randomKana[index].length > 0){
        lblHint.innerText += randomAnswer[index] + "(" + randomKana[index] +")/";
      }else{
        lblHint.innerText += randomAnswer[index] + "/";
      }
    } 

  }else{
    question = randomQuestion;
    answer = randomAnswer;
    pos = randomPos;
  } 

  m_gameScore.setData(0);
  m_startTime.setData(Date.now());

  m_timeIntervalId.setData(setInterval(showTime=> {
    lblTime.innerText = 'TIME:' + ((Date.now() - m_startTime.getData()) / 1000).toFixed(1);
    gameTime = (Date.now() - m_answerStartTime.getData()) / 1000;

    //time over
    if(BAD_SEC < gameTime){
        lblResult.innerHTML = 'POOR<br>' + m_currentAnswer.getData();
        lblResult.style.color = '#FF00FF';
        lblResult.style.opacity = 1.0;
        setQuestion();
    }
    lblResult.style.opacity = lblResult.style.opacity - 0.01;
    prgTime.value = prgTime.max - (gameTime * (prgTime.max / BAD_SEC));

    if(m_currentAnswer.getData() === undefined){
      clearInterval(m_timeIntervalId.getData());
      lblCount.innerText = 'COUNT:' + workLength + '/' + workLength;
      lblQuestion.innerText = 'CLEAR!! --> ';
      saveScore();
    }
  },20) );

  setQuestion();
  txtInput.addEventListener('compositionend', (e) => {

    let score;
    if(txtInput.value.replace("ヶ","ケ") === m_currentAnswer.getData().replace("ヶ","ケ")){

      if(GREAT_SEC >= gameTime){
        lblResult.innerText = 'GREAT';
        lblResult.style.color = '#0000FF';
        score = 2;
      }else if(gameTime <= GOOD_SEC){
        lblResult.innerText = 'GOOD';
        lblResult.style.color = '#FFFF00';
        score = 1;
      }else if(gameTime <= BAD_SEC){
        lblResult.innerText = 'BAD';
        lblResult.style.color = '#FF0000';
        score = 0;
      }else{
        lblResult.innerText = 'POOR';
        lblResult.style.color = '#FF00FF';
        score = 0;
      }

      m_gameScore.setData(m_gameScore.getData()+score);
      lblScore.innerText = 'SCORE:' + m_gameScore.getData();
      lblResult.style.opacity = 1.0;

      setQuestion();

    }else{
      lblQuestion.innerText = m_currentQuestion.getData() + ':NG:' + txtInput.value
    }
  });
}

function clickMenu(){
  window.location.href = 'index.html?mode='+ m_mode.getData() + '&index=' + m_targetCode.getData();
}

function clickRetry(){
  location.reload() 
}

