/*globals window, document, setInterval, event , localStorage */

let isOpenFile;
let jsonFile;
let readyCount;
let gameScore;

function init(){
    prgTime.max = 120;
    prgTime.value = 120;
    readyCount = 2;

    isOpenFile = false;
    lblQuestion.innerText = 'file loading..';

    //lblHint.innerText = 'HINT:';
    lblScore.innerText = 'SCORE:';
    lblTime.innerText = 'TIME:';
    lblCount.innerText = 'COUNT:';


}

let question = [];
let answer = [];
let pos =[];
let questionCount = 0;
let startTime;
let answerStartTime;

function getRandom(min, max) {
    
    let range = max - min + 1;
    let random = Math.floor(Math.random() * range);
    return random + min;
}

let mode = null;
let dataIndex = null;
let timeIntervalId;

const GREAT_SEC = 5;
const GOOD_SEC = 10;
const BAD_SEC = 15;

let gameTime;
let workLength;

function main(){
  let targetRural;

  if(dataIndex === '0'){
    targetRural = '東北';
  }else if(dataIndex === '1'){
    targetRural = '関東';
  }else if(dataIndex === '2'){
    targetRural = '中部';
  }else if(dataIndex === '3'){
    targetRural = '近畿';
  }else if(dataIndex === '4'){
    targetRural = '四国';
  }else if(dataIndex === '5'){
    targetRural = '九州';
  }else if(dataIndex === '6'){
    targetRural = 'ALL';
  }else if(dataIndex === 'r30'){
    targetRural = 'none';
  }else{
    alert('The dataIndex parameter is not set correctly.\n(param:' + dataIndex + ')')
  }
  let ascQuestion = [];
  let ascAnswer = [];
  let ascPos = [];
  for(let rec of jsonFile){

    if(rec.rural === targetRural || targetRural === 'ALL'){
      ascQuestion.push(rec.code);
      ascAnswer.push(rec.prefectures);
      ascPos.push(rec.pos);
    }
  }

  let workQuestion = ascQuestion.slice();
  let workAnswer = ascAnswer.slice();
  let workPos = ascPos.slice();
  workLength = workQuestion.length;
  console.log('workLengh: ' + workLength);
  //SHUFFLE
  let randomQuestion = [];
  let randomAnswer = [];
  let randomPos = [];

  if(mode === 'hard'){
    document.getElementById("imgMap").src = './img/map_noline.svg';
  }
  
  if(mode === 'veryEasy'){
    randomQuestion = workQuestion;
    randomAnswer = workAnswer;
    randomPos = workPos;

  }else{
    while(randomQuestion.length < workLength){
      for(let i in workQuestion){
        let trgIndex = getRandom(0 ,workQuestion.length - i - 1);
        randomQuestion.push(workQuestion[trgIndex]);
        randomAnswer.push(workAnswer[trgIndex]);
        randomPos.push(workPos[trgIndex]);


        workQuestion.splice(trgIndex, 1);
        workAnswer.splice(trgIndex, 1);
        workPos.splice(trgIndex, 1);
      }
    }
  }

  if(mode === 'veryEasy' || mode === 'easy'){
    question = ascQuestion;
    answer = ascAnswer;
    pos = ascPos;
    
    for(let ans of randomAnswer){
      lblHint.innerText += ans + "/";
    }

  }else{
    question = randomQuestion;
    answer = randomAnswer;
    pos = randomPos;
  } 

  //game start init
  gameScore = 0;
  startTime = Date.now();
  timeIntervalId = setInterval(showTime => {

    lblTime.innerText = 'TIME:' + ((Date.now() - startTime) / 1000).toFixed(1);
    gameTime = (Date.now() - answerStartTime) / 1000;

    if(BAD_SEC < gameTime){
        lblResult.innerHTML = 'POOR<br>' + currentAnswer;
        lblResult.style.color = '#FF00FF';
        lblResult.style.opacity = 1.0;
        setQuestion();
    }
    lblResult.style.opacity = lblResult.style.opacity - 0.01;
    prgTime.value = prgTime.max - (gameTime * (prgTime.max / BAD_SEC));

    if(currentAnswer === undefined){
      lblCount.innerText = 'COUNT:' + workLength + '/' + workLength;
      completion();
      clearInterval(timeIntervalId);
    }

  },20);

  setQuestion();
  txtInput.addEventListener('compositionend', (e) => {

    if(txtInput.value === currentAnswer || txtInput.value.replace('県','') === currentAnswer.replace('県','') || txtInput.value.replace('府','') === currentAnswer.replace('府','') || txtInput.value.replace('都','') === currentAnswer.replace('都','')){
      let score;

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

      lblResult.style.opacity = 1.0;
      gameScore += score;
      lblScore.innerText = 'SCORE:' + gameScore;

      setQuestion();

    }else{
      lblQuestion.innerText = currentQuestion + ':NG:' + txtInput.value
    }
  });

}
function drawMarker(pos){

  txtInput.focus();
  const img = document.getElementById("imgMap");
  const SVG_ID="svgMarker";
  
  // 表示されているサイズを取得
  if(pos === undefined){return}
  const svgDiv = document.getElementById(SVG_ID);
  if(svgDiv != null){svgDiv.remove();}

  let posX = pos[0]*(img.offsetWidth/570);
  let posY = img.offsetHeight - pos[1]*(img.offsetHeight/750);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute("id", "svgMarker");
  svg.setAttribute("viewBox", "0 0 "+img.offsetWidth+" "+img.offsetHeight);
  svg.setAttribute("preserveAspectRatio", "xMinYMin meet");

  const circle= document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx','10');
  circle.setAttribute('cy','10');
  circle.setAttribute('r','10');

  circle.setAttribute('fill','none');
  circle.setAttribute('stroke','#EA4335');

 /*
  const circleMini= document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleMini.setAttribute('cx','10');
  circleMini.setAttribute('cy','10');
  circleMini.setAttribute('r','5');
 */
  //circleMini.setAttribute('fill',"none");
  //circleMini.setAttribute('stroke','#811411');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  //path.setAttribute('d',"M 0 10 C 3 23, 7 18, 10 30 T 10 30 C 12 18, 17 23, 20 10 Z");
  path.setAttribute('d',"M 0 10 C 3 23, 7 18, 10 30 T 10 30 C 12 18, 17 23, 20 10");

  path.setAttribute('fill',"none");
  path.setAttribute('stroke',"#EA4335");

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute("transform", "translate("+(posX-10)+","+(posY-30)+")");

  g.appendChild(path);
  g.appendChild(circle);
  //g.appendChild(circleMini);

  svg.appendChild(g);

  map = document.getElementById("mapContainer");
  map.appendChild(svg);
  
  svgMarker.style.position="absolute";
  //中央寄せ
  svgMarker.style.top = 0;
  svgMarker.style.left = 0;
  svgMarker.style.right = 0;
  svgMarker.style.margin = 'auto';
}
function completion(){
  clearInterval(timeIntervalId);
  saveScore();
}


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
  if(gameScore >= maxScore * 8/9){rank = 'AAA';}
  else if(gameScore >= maxScore * 7/9){rank = 'AA';}
  else if(gameScore >= maxScore * 6/9){rank = 'A';}
  else if(gameScore >= maxScore * 5/9){rank = 'B';}
  else if(gameScore >= maxScore * 4/9){rank = 'C';}
  else if(gameScore >= maxScore * 3/9){rank = 'D';}
  else if(gameScore >= maxScore * 2/9){rank = 'E';}
  else{rank = 'F';}

  localStorage.setItem('geography' + ',' + mode + ',' + dataIndex + ',' + year + month + day + hour + minute + second,gameScore + ',' + rank + ',' + time);
  lblQuestion.innerText = 'CLEAR!! --> ' + rank 
}

let currentAnswer;
let currentQuestion;
let currentPos;
function setQuestion(){
  currentQuestion = question.shift();
  lblQuestion.innerText = currentQuestion;

  currentAnswer = answer.shift();
  txtInput.value = '';

  currentPos = pos.shift();
  drawMarker(currentPos);
  questionCount += 1;
  lblCount.innerText = 'COUNT:' + questionCount + '/' + workLength;
  answerStartTime = Date.now();
}

function clickMenu(){
  window.location.href = 'index.html?mode='+ mode + '&index=' + dataIndex;
}

function clickRetry(){
  location.reload() 
}

window.onload = function(){

  init();
  btnMenu.addEventListener("click", clickMenu, false); 
  btnRetry.addEventListener("click", clickRetry, false);
  //------------
  // SET PARAM
  //------------
  let param = location.search.split('&')
  if(param.length === 2){
    mode = param[0].split('=')[1];
    dataIndex = param[1].split('=')[1];
  }else{
    alert('The parameters at the time of calling are not set.\n(url:' + location.href + ')\n\nPlease start from the menu screen.');
    return;
  }

  if(mode === 'veryEasy' || mode === 'easy' || mode === 'normal' || mode === 'hard'){
    document.getElementById("imgMap").style.display ="block";
  }else{
    alert('The parameters are over');
    return;
  }

  //------------
  // JSON Read..
  //------------
  let requestURL = './contents.json'; //CROSSエラーコード
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  
  request.onload = function () {
    jsonFile = request.response;
    isOpenFile = true;
  }

  
  let intervalId = setInterval(firstStart => {
    if(!isOpenFile){return};
    if(readyCount < 0){
      clearInterval(intervalId);
      main();
      return;
    }

    let dot = '';
    for(let i=0;i<readyCount;i++){
      dot += '.'; 
    }

    lblQuestion.innerText = 'Ready' + dot;
    readyCount = readyCount - 1;

    prgTime.value += 1;
  },1000);

}
