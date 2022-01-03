/*globals window, document, setInterval, event , localStorage */

let eCmbQuestion;

function clickRadio(){
  if(rdoEasy.checked){
     lblEasy.style.background = "#FFF";
     lblEasy.style.color  = "#000";
  }else{
     lblEasy.style.background = "#000";
     lblEasy.style.color = "#FFF";
  }
  if(rdoNormal.checked){
     lblNormal.style.background = "#FFF";
     lblNormal.style.color  = "#000";
  }else{
     lblNormal.style.background = "#000";
     lblNormal.style.color = "#FFF";
  }
  if(rdoHard.checked){
     lblHard.style.background = "#FFF";
     lblHard.style.color  = "#000";
  }else{
     lblHard.style.background = "#000";
     lblHard.style.color = "#FFF";
  }
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
function getPerDateCount() {
    'use strict';

    let dateYmd = [];    
    let record = new Object();
    let date = [];
    let count = [];

    for(let key in localStorage) {
	let keys = key.split(',');
        if(keys[0] === 'geography') {
            dateYmd.push(keys[3].slice(0,8));
        }
    }

　　dateYmd.sort();
    
    let wDate;
    for(let d in dateYmd){
        
        if(wDate !== dateYmd[d]) {
            wDate = dateYmd[d];
            count.push(1);
            date.push(wDate);
        }else{
            count[count.length - 1] += 1;
        }
    }

　　record.count = count;
    record.dateYmd = date;
    
    return record;
}


function getRectColor(count){
    'use strict';

    if(count === 0){
        return '#191D21';
    }else if(count <= 2){
        return '#6BF8A3';
    }else if(count <= 4){
        return '#00D65D';
    }else if(count <= 6){
        return '#00AF4A';
    }else {
        return '#007839';
    }
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

    let record = getHiScore();
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

function clickButton() {
    'use strict';
    let dataIndex = event.currentTarget.dataset['index'];
    let eRdoMode = document.getElementsByName("rdoMode");
    let selectMode = getSelectMode();

    // MAIN
    if(selectMode === undefined){
	alert('Select "Mode".');
	return;
    }
    window.location.href = 'main.html?mode='+ selectMode + '&index=' + dataIndex;

}
function clickData(){
  console.log('CALL clickData');
  window.location.href = 'note.html';
}

function clickScoreReset() {
  console.log('CALL clickscorereset');
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

    btnTohoku.addEventListener("click", clickButton, false); 
    btnKanto.addEventListener("click", clickButton, false);  
    btnChubu.addEventListener("click", clickButton, false);  
    btnKansai.addEventListener("click", clickButton, false); 
    btnShikoku.addEventListener("click", clickButton, false); 
    btnKyushu.addEventListener("click", clickButton, false); 
    btnAll.addEventListener("click", clickButton, false); 

    btnScoreReset.addEventListener("click", clickScoreReset, false); 
    btnData.addEventListener("click", clickData, false); 

   let param = location.search.split('&')
   let prmMode;
   if(param.length === 1){
	prmMode = param[0].split('=')[1];
    }

   if(prmMode === 'easy'){
	rdoEasy.checked = true;
   }else if(prmMode === 'normal'){
	rdoNormal.checked = true;
   }else if(prmMode === 'hard'){
	rdoHard.checked = true;
   }else{
        rdoEasy.checked = true;
   }
   clickRadio();
   drawHiScore();

    let checkOption = document.getElementsByName('rdoMode');
    checkOption.forEach(function(e) {
        e.addEventListener("click", function() {           

	    drawHiScore();
        });
    });
};
