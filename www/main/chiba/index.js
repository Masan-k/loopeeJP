/*globals window, document, setInterval, event , localStorage */
'use strict';

const APP_CODE ='loopeeCHIBA';

function changeMode(){
  drawHiScore();
}
function changeTarget(){
  drawHiScore();
}

function getSelectMode(){
  let eRdoMode = document.getElementsByName("rdoMode");
  for(let i=0;i<eRdoMode.length;i++){
    if(eRdoMode[i].checked){
      return eRdoMode[i].value;
    }
  }
  return undefined;
}

function getSelectTarget(){
  let eRdoTrg = document.getElementsByName("rdoTrg");
  for(let i=0;i<eRdoTrg.length;i++){
    if(eRdoTrg[i].checked){
      return eRdoTrg[i].value;
    }
  }
  return undefined;
}

function getHiScore() {
  let MAX_TARGETCODE = 10;

  let result = new Object();

  let score = [];
  let rank = [];
  let sec = [];
  let targetCode = [];
  let mode = [];

  let lsSort = [];
  let lsSortTargetCode = [];

  let selectMode = getSelectMode();
  let selectTarget = getSelectTarget();

  let bestScore;
  let bestRank; 
  let bestSec;
  let beforeTargetCode = -1;

  //Loop for each data index
  for(let i = 0;i <= MAX_TARGETCODE;i++){
    for(let key in localStorage) {
      let keys = key.split(',');

      if(keys[0] === APP_CODE && keys[1] === selectMode && keys[2] === i.toString()){
        lsSort.push(localStorage.getItem(keys));
        lsSortTargetCode.push(i);
      }
    }
  }
  for(let key in localStorage) {
    let keys = key.split(',');

    if(keys[0] === APP_CODE && keys[1] === selectMode && keys[2] === 'all'){
      lsSort.push(localStorage.getItem(keys));
      lsSortTargetCode.push('all');
    }
  }

  for(let i in lsSort){
    let data = lsSort[i].split(',')
    if(beforeTargetCode === -1){
      bestScore = data[0];
      bestRank = data[1];
      bestSec = data[2];
      beforeTargetCode = lsSortTargetCode[i];

    }else if(beforeTargetCode !== lsSortTargetCode[i]){
      score.push(bestScore);
      rank.push(bestRank);
      sec.push(bestSec);
      targetCode.push(beforeTargetCode);

      bestScore = data[0];
      bestRank = data[1];
      bestSec = data[2];

      beforeTargetCode = lsSortTargetCode[i];
    }else{
      if(Number(bestScore) < Number(data[0])){
        bestScore = data[0];
        bestRank = data[1];
        bestSec = data[2];
      }
    }
  }
  
  score.push(bestScore);
  rank.push(bestRank);
  sec.push(bestSec);
  targetCode.push(beforeTargetCode);

  result.score = score;
  result.rank = rank;
  result.sec = sec;
  result.targetCode = targetCode;
  
  return result;
}


function getRankColor(rank){
  if(rank === 'AAA' || rank === 'AA' || rank === 'A' || rank === 'B'){
    return '#00CC00';
  }else if(rank === 'C' || rank === 'D'){
    return '#FFFF00';
  }else if(rank === 'E'){
    return '#FF0000';
  }else if(rank === 'F'){
    return '#FF00FF';
  }else{
    return '#FFFFFF';
  }
}
function drawHiScore(){
  lblRank1.innerText = '-';
  lblRank2.innerText = '-';
  lblRank3.innerText = '-';
  lblRank4.innerText = '-';
  lblRank5.innerText = '-';
  lblRank6.innerText = '-';
  lblRank7.innerText = '-';
  lblRankAll.innerText = '-';

  lblRank1.style.color = 'grey';
  lblRank2.style.color = 'grey';
  lblRank3.style.color = 'grey';
  lblRank4.style.color = 'grey';
  lblRank5.style.color = 'grey';
  lblRank6.style.color = 'grey';
  lblRank7.style.color = 'grey';
  lblRankAll.style.color = 'grey';

  lblScore.textContent = ' - ';
  lblTime.textContent = ' - ';

  let selectMode = getSelectMode();
  let selectTarget = getSelectTarget();

  let record = getHiScore();
  for(let i=0; i<record.targetCode.length; i++){
    if(record.targetCode[i].toString() === selectTarget){
      lblScore.textContent = record.score[i];
      lblTime.textContent = record.sec[i];
    }
  }

  for(let i=0; i<record.targetCode.length; i++){
    if(record.targetCode[i] === 1){
      lblRank1.innerText = record.rank[i];
      lblRank1.style.color = getRankColor(record.rank[i]);

    }else if(record.targetCode[i] === 2){
      lblRank2.innerText = record.rank[i];
      lblRank2.style.color = getRankColor(record.rank[i]);

    }else if(record.targetCode[i] === 3){
      lblRank3.innerText = record.rank[i];
      lblRank3.style.color = getRankColor(record.rank[i]);

    }else if(record.targetCode[i] === 4){
      lblRank4.innerText = record.rank[i];
      lblRank4.style.color = getRankColor(record.rank[i]);

    }else if(record.targetCode[i] === 5){
      lblRank5.innerText = record.rank[i];
      lblRank5.style.color = getRankColor(record.rank[i]);

    }else if(record.targetCode[i] === 6){
      lblRank6.innerText = record.rank[i];
      lblRank6.style.color = getRankColor(record.rank[i]);

    }else if(record.targetCode[i] === 7){
      lblRank7.innerText = record.rank[i];
      lblRank7.style.color = getRankColor(record.rank[i]);

    }else if(record.targetCode[i] === 'all'){
      lblRankAll.innerText = record.rank[i];
      lblRankAll.style.color = getRankColor(record.rank[i]);

    }
  }
}

window.onload = function () {
  let param = location.search.split('&')
  let prmMode;
  let prmTargetCode;
  

  btnPlay.addEventListener("click", () => {
    let selectTarget = getSelectTarget();
    let selectMode = getSelectMode();
    if(selectMode === undefined){
      alert('Select "Mode".');
      return;
    }
    if(selectTarget === undefined){
      alert('Select "Target".');
      return;
    }
    window.location.href = 'main.html?mode='+ selectMode + '&index=' + selectTarget;
  }); 

  btnReset.addEventListener("click", () => {
    let check = window.confirm("Deletes the score of the selected MODE. Is it OK?");
    if (check){
      let selectMode = getSelectMode();
      for(let key in localStorage) {
        let keys = key.split(',');
        if(keys[0] === APP_CODE &&  keys[1] === selectMode){
          localStorage.removeItem(key);
          drawHiScore();
        }
      }
   }
  }); 

  rdoVeryEasy.addEventListener("click", changeMode, false);
  rdoEasy.addEventListener("click", changeMode, false);
  rdoNormal.addEventListener("click", changeMode, false);
  rdoHard.addEventListener("click", changeMode, false);

  rdo1.addEventListener("click", changeTarget, false);
  rdo2.addEventListener("click", changeTarget, false);
  rdo3.addEventListener("click", changeTarget, false);
  rdoAll.addEventListener("click", changeTarget, false);

  if(param.length === 2){
    prmMode = param[0].split('=')[1];
    prmTargetCode = param[1].split('=')[1];
  }

  if(prmMode === 'easy'){rdoEasy.checked = true;
  }else if(prmMode === 'normal'){rdoNormal.checked = true;
  }else if(prmMode === 'hard'){rdoHard.checked = true;
  }else if(prmMode === 'veryEasy'){rdoVeryEasy.checked = true;
  }else{rdoEasy.checked = true;}

  if(prmTargetCode === '1'){rdo1.checked=true;}
  else if(prmTargetCode === '2'){rdo2.checked=true;}
  else if(prmTargetCode === '3'){rdo3.checked=true;}
  else if(prmTargetCode === 'all'){rdoAll.checked=true;}
  else{rdo1.checked=true;}

  drawHiScore();
};
