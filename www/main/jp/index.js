/*globals window, document, setInterval, event , localStorage */

let eCmbQuestion;
let record;

function changeMode(){
  drawHiScore();
  changeModeColor();
  updateSelectScore();
}

function changeTarget(){
  changeTargetColor();
  updateSelectScore();

}

function updateSelectScore(){
  let selectMode = getSelectMode();
  let selectTarget = getSelectTarget();

  for(let i in record.dataIndex){
    if(record.dataIndex[i].toString() === selectTarget){
      lblScore.innerText = record.score[i];
      lblTime.innerText = record.sec[i];
      lblSelectDataRank.innerText = record.rank[i];
      lblSelectDataRank.style.color = getRankColor(record.rank[i]);

      return 0;
    }
  }
  lblScore.innerText = '-';
  lblTime.innerText = '-';
  lblSelectDataRank.innerText = '-';
  lblSelectDataRank.style.color = '#7A756D';
}

function changeModeColor(){
  console.log("call change mode");

  if(rdoVeryEasy.checked){
     lblSelectDataMode.innerText = "VERY EASY"
     lblVeryEasy.style.background = "#FFF";
     lblVeryEasy.style.color  = "#000";
  }else{
     lblVeryEasy.style.background = "#000";
     lblVeryEasy.style.color = "#FFF";
  }

  if(rdoEasy.checked){
     lblSelectDataMode.innerText = "EASY"
     lblEasy.style.background = "#FFF";
     lblEasy.style.color  = "#000";
  }else{
     lblEasy.style.background = "#000";
     lblEasy.style.color = "#FFF";
  }
  if(rdoNormal.checked){
     lblSelectDataMode.innerText = "NORMAL"
     lblNormal.style.background = "#FFF";
     lblNormal.style.color  = "#000";
  }else{
     lblNormal.style.background = "#000";
     lblNormal.style.color = "#FFF";
  }
  if(rdoHard.checked){
     lblSelectDataMode.innerText = "HARD"
     lblHard.style.background = "#FFF";
     lblHard.style.color  = "#000";
  }else{
     lblHard.style.background = "#000";
     lblHard.style.color = "#FFF";
  }
}
function changeTargetColor(){
  if(rdoTohoku.checked){
     lblSelectDataTrg.innerText = "Tohoku"
     lblTohoku.style.background = "#FFF";
     lblTohoku.style.color  = "#000";
  }else{
     lblTohoku.style.background = "#000";
     lblTohoku.style.color = "#FFF";
  }
  if(rdoKanto.checked){
     lblSelectDataTrg.innerText = "Kanto"
     lblKanto.style.background = "#FFF";
     lblKanto.style.color  = "#000";
  }else{
     lblKanto.style.background = "#000";
     lblKanto.style.color = "#FFF";
  }
  if(rdoChubu.checked){
     lblSelectDataTrg.innerText = "Chubu"
     lblChubu.style.background = "#FFF";
     lblChubu.style.color  = "#000";
  }else{
     lblChubu.style.background = "#000";
     lblChubu.style.color = "#FFF";
  }
  if(rdoKinki.checked){
     lblSelectDataTrg.innerText = "Kinki"
     lblKinki.style.background = "#FFF";
     lblKinki.style.color  = "#000";
  }else{
     lblKinki.style.background = "#000";
     lblKinki.style.color = "#FFF";
  }
  if(rdoShikoku.checked){
     lblSelectDataTrg.innerText = "Shikoku"
     lblShikoku.style.background = "#FFF";
     lblShikoku.style.color  = "#000";
  }else{
     lblShikoku.style.background = "#000";
     lblShikoku.style.color = "#FFF";
  }
  if(rdoKyushu.checked){
     lblSelectDataTrg.innerText = "Kyushu"
     lblKyushu.style.background = "#FFF";
     lblKyushu.style.color  = "#000";
  }else{
     lblKyushu.style.background = "#000";
     lblKyushu.style.color = "#FFF";
  }
  if(rdoAll.checked){
     lblSelectDataTrg.innerText = "All"
     lblAll.style.background = "#FFF";
     lblAll.style.color  = "#000";
  }else{
     lblAll.style.background = "#000";
     lblAll.style.color = "#FFF";
  }
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

function getSelectMode(){
    let eRdoMode = document.getElementsByName("rdoMode");
    for(let i=0;i<eRdoMode.length;i++){
	if(eRdoMode[i].checked){
	    return eRdoMode[i].value;
	}
    }
    return undefined;
}

function getHiScore() {
    'use strict';

    let result = new Object();

    let score = [];
    let rank = [];
    let sec = [];
    let dataIndex = [];
    let mode = [];

    let dataIndexCount = 6;

    let lsSort = [];
    let lsSortDataIndex = [];

    let selectMode = getSelectMode();

    //Loop for each data index
    for(let i = 0;i <= dataIndexCount;i++){
	for(let key in localStorage) {
	    let keys = key.split(',');

	    if(keys[0] === 'geography' &&  keys[1] === selectMode && keys[2] === i.toString()){
		lsSort.push(localStorage.getItem(keys));
		lsSortDataIndex.push(i);
	    }
	}   
    }

    let bestScore;
    let bestRank; 
    let bestSec;
    
    let beforeDataIndex = -1;

    for(let i in lsSort){
	let data = lsSort[i].split(',')
	if(beforeDataIndex === -1){
	    bestScore = data[0];
	    bestRank = data[1];
	    bestSec = data[2];

	    beforeDataIndex = lsSortDataIndex[i];

	}else if(beforeDataIndex !== lsSortDataIndex[i]){
	    score.push(bestScore);
	    rank.push(bestRank);
	    sec.push(bestSec);
	    dataIndex.push(beforeDataIndex);

	    bestScore = data[0];
	    bestRank = data[1];
	    bestSec = data[2];

	    beforeDataIndex = lsSortDataIndex[i];
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
    dataIndex.push(beforeDataIndex);

    result.score = score;
    result.rank = rank;
    result.sec = sec;
    result.dataIndex = dataIndex;
    
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
    'use strict';

    lblTohokuRank.innerText = '';
    lblTohokuRank.style.color = '#7A756D';

    lblKantoRank.innerText = '';
    lblKantoRank.style.color = '#7A756D';

    lblChubuRank.innerText = '';
    lblChubuRank.style.color =  '#7A756D';

    lblKansaiRank.innerText =  '';
    lblKansaiRank.style.color = '#7A756D';

    lblShikokuRank.innerText = '';
    lblShikokuRank.style.color = '#7A756D';

    lblKyushuRank.innerText = '';
    lblKyushuRank.style.color = '#7A756D';

    lblAllRank.innerText = ''; 
    lblAllRank.style.color = '#7A756D';

    record = getHiScore();
    for(let i in record.dataIndex){
	if(record.dataIndex[i] === 0){
	    lblTohokuRank.innerText = record.rank[i];
	    lblTohokuRank.style.color = getRankColor(record.rank[i]);
	    
	}else if(record.dataIndex[i] === 1){
	    lblKantoRank.innerText = record.rank[i];
	    lblKantoRank.style.color = getRankColor(record.rank[i]);

	}else if(record.dataIndex[i] === 2){
	    lblChubuRank.innerText = record.rank[i];
	    lblChubuRank.style.color = getRankColor(record.rank[i]);

	}else if(record.dataIndex[i] === 3){
	    lblKansaiRank.innerText = record.rank[i];
	    lblKansaiRank.style.color = getRankColor(record.rank[i]);

	}else if(record.dataIndex[i] === 4){
	    lblShikokuRank.innerText = record.rank[i];
	    lblShikokuRank.style.color = getRankColor(record.rank[i]);

	}else if(record.dataIndex[i] === 5){
	    lblKyushuRank.innerText = record.rank[i];
	    lblKyushuRank.style.color = getRankColor(record.rank[i]);

	}else if(record.dataIndex[i] === 6){
	    lblAllRank.innerText = record.rank[i];
	    lblAllRank.style.color = getRankColor(record.rank[i]);
	}

    }	
}

function clickPlay() {
    'use strict';
    let selectDataIndex = getSelectTarget();
    let selectMode = getSelectMode();

    // MAIN
    if(selectMode === undefined){
	alert('Select "Mode".');
	return;
    }
    if(selectDataIndex === undefined){
	alert('Select "Target".');
	return;
    }
    window.location.href = 'main.html?mode='+ selectMode + '&index=' + selectDataIndex;

}
function clickAbout() {
  window.location.href = 'about.html';
}
function clickScoreReset() {
  let check = window.confirm("Deletes the score of the selected MODE. Is it OK?");

  if (check){
    let selectMode = getSelectMode();
    for(let key in localStorage) {
      let keys = key.split(',');
      if(keys[0] === 'geography' &&  keys[1] === selectMode){
        localStorage.removeItem(key);
        drawHiScore();
      }
    }
  }
}


window.onload = function () {
    'use strict';

    rdoTohoku.addEventListener("click", changeTarget, false); 
    rdoKanto.addEventListener("click", changeTarget, false);  
    rdoChubu.addEventListener("click", changeTarget, false);  
    rdoKinki.addEventListener("click", changeTarget, false); 
    rdoShikoku.addEventListener("click", changeTarget, false); 
    rdoKyushu.addEventListener("click", changeTarget, false); 
    rdoAll.addEventListener("click", changeTarget, false); 

    btnScoreReset.addEventListener("click", clickScoreReset, false); 
    btnAbout.addEventListener("click", clickAbout, false); 
    btnPlay.addEventListener("click", clickPlay, false); 

    rdoVeryEasy.addEventListener("click", changeMode, false); 
    rdoEasy.addEventListener("click", changeMode, false); 
    rdoNormal.addEventListener("click", changeMode, false); 
    rdoHard.addEventListener("click", changeMode, false); 

   let param = location.search.split('&')
   let prmMode;
   let prmDataIndex;
   if(param.length === 2){
	prmMode = param[0].split('=')[1];
	prmDataIndex = param[1].split('=')[1];
    }
   if(prmMode === 'easy'){
	rdoEasy.checked = true;
   }else if(prmMode === 'normal'){
	rdoNormal.checked = true;
   }else if(prmMode === 'hard'){
	rdoHard.checked = true;
   }else if(prmMode === 'veryEasy'){
	rdoVeryEasy.checked = true;
   }else{
        rdoEasy.checked = true;
   }
   if(prmDataIndex === '0'){rdoTohoku.checked=true;}
   else if(prmDataIndex === '1'){rdoKanto.checked=true;}
   else if(prmDataIndex === '2'){rdoChubu.checked=true;}
   else if(prmDataIndex === '3'){rdoKinki.checked=true;}
   else if(prmDataIndex === '4'){rdoShikoku.checked=true;}
   else if(prmDataIndex === '5'){rdoKyushu.checked=true;}
   else if(prmDataIndex === '6'){rdoAll.checked=true;}
   else{rdoTohoku.checked=true;}

   drawHiScore();
   changeMode();
   changeTarget();

    let checkOption = document.getElementsByName('rdoMode');
    checkOption.forEach(function(e) {
        e.addEventListener("click", function() {           

        });
    });
};
