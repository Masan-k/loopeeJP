/*globals window, document, setInterval, event , localStorage */

function init(contents) {
    'use strict';

    /*
    for (let index in contents) {
	console.log('index -> ' + index);
    }
    for(let value of contents) {
	console.log('value -> ' + value.rural)
    }
    */
    
}

const ANS_SEC = 20;
let isOpenFile;
let jsonFile;

let gameStatus;

let currentIndex;
let readyCount;

function init(){
    prgTime.max = 100;
    prgTime.value = 0;

    isOpenFile = false;
    lblQuestion.innerText = 'file reading..'

    readyCount = 1;
}

let question = [];
let answer = [];
let questionCount;
let startTime;

function getRandom(min, max) {
    'use strict';
    
    let range = max - min + 1;
    let random = Math.floor(Math.random() * range);
    return random + min;
}

let mode = null;
let dataIndex = null;
let timeIntervalId;
function main(){
    'use strict';
    //--------------------
    // SET MODE(GET PRAM)
    //--------------------
    let param = location.search.split('&')
   if(param.length === 2){
	mode = param[0].split('=')[1];
	dataIndex = param[1].split('=')[1];
    }else{
	alert('The parameters at the time of calling are not set.\n(url:' + location.href + ')\n\nPlease start from the menu screen.');
	return;
    }

    if(mode === 'code'){
	let targetRural;

	if(dataIndex === '0'){
	    targetRural = '東北';
	}else if(dataIndex === '1'){
	    targetRural = '関東';
	}else if(dataIndex === '2'){
	    targetRural = '中部';
	}else if(dataIndex === '3'){
	    targetRural = '関西';
	}else if(dataIndex === '4'){
	    targetRural = '中国';
	}else if(dataIndex === '5'){
	    targetRural = '四国';
	}else if(dataIndex === '6'){
	    targetRural = '九州';
	}else if(dataIndex === 'r30'){
	    targetRural = 'none';
	}else{
	    alert('The dataIndex parameter is not set correctly.\n(param:' + dataIndex + ')')
	    return;
	}
	
	let workQuestion = [];
	let workAnswer = [];
	for(let rec of jsonFile){
	    if(rec.rural === targetRural){
		workQuestion.push(rec.code);
		workAnswer.push(rec.prefectures);
	    }
	}
	
	//shuffle
	let workLength = workQuestion.length
	while(question.length < workLength){
	    for(let i in workQuestion){
		let trgIndex = getRandom(0 ,workQuestion.length - i - 1);
		question.push(workQuestion[trgIndex]);
		answer.push(workAnswer[trgIndex]);

		workQuestion.splice(trgIndex, 1);
		workAnswer.splice(trgIndex, 1);
	    }
	}

	startTime = Date.now();
	timeIntervalId = setInterval(showTime => {
	    lblTime.innerText = (Date.now() - startTime)/1000;
        },16);
	questionCount = 0;
	setQuestion();
	
    }else{

    }
	
    txtInput.addEventListener('keyup', updateAnswer);

}

function saveScore(){
    'use strict';

    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = ('00' + (nowDate.getMonth()+1)).slice(-2);
    let day = ('00' + nowDate.getDate()).slice(-2);
    let hour = ('00' + nowDate.getHours()).slice(-2);
    let minute = ('00' + nowDate.getMinutes()).slice(-2);
    let second = ('00' + nowDate.getSeconds()).slice(-2);

    localStorage.setItem('geography' + ',' + mode + ',' + dataIndex + ',' + year + month + day + hour + minute + second,nowDate - startTime);

}
function updateAnswer(){
    if(txtInput.value === currentAnswer){
	setQuestion();
    }
    if(currentAnswer === undefined){
	txtInput.value = '!!CLEAR!!';
	clearInterval(timeIntervalId);
	saveScore();
    }
}
function setQuestion(){

    lblQuestion.innerText = question.pop();
    currentAnswer = answer.pop();
    txtInput.value = '';
    questionCount += 1;
}
window.onload = function () {
    'use strict';
    
    init();

    //------------
    // JSON Read..
    //------------
    let requestURL = 'https://masan-k.github.io/japanese-geography/contents.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    
    request.onload = function () {
	jsonFile = request.response;
	isOpenFile = true;
    }
    
    let intervalId = setInterval(firstStart => {
	'use strict';
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

	prgTime.value += 0.1;
    },1000);

 
};
