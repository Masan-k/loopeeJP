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
let startTime;
let readyCount;

function setReady(){
    gameStatus = 'ready';
}

function init(){
    prgTime.max = 100;
    prgTime.value = 0;

    isOpenFile = false;
    lblQuestion.innerText = 'file reading..'

    readyCount = 1;
}

function main(){
   

    txtInput.addEventListener('input', updateText =>{
	lblQuestion.innerText = '[call updateText] input value -> ' + txtInput.value;
    });

    txtInput.addEventListener('change', updateText =>{
	alert('call change');
	//console.log('value -> ' + txtInput.value);
    });


    //--------
    //初回のみ
    //--------
    //jsonファイルから選択した地区のコードと都道府県名を取得する
    //データのシャッフル
    

    //----------
    //問題の表示
    //----------
    //
    // 答え入力 -> !!!入力完了検知!!!
    //
    //正しい答えが入力された場合は次の問題を表示
    //
    //間違えた場合は画面に警告を表示
    //
    let intervalId = setInterval(mainStart => {
	//console.log('main');
    },16)
}

window.onload = function () {
    'use strict';
    
    init();

    let intervalId = setInterval(firstStart => {
	'use strict';
	if(!isOpenFile){return};
	if(readyCount < 0){
	    clearInterval(intervalId);
	    main();
	}

	let dot = '';
	for(let i=0;i<readyCount;i++){
	    dot += '.'; 
	}

	lblQuestion.innerText = 'Ready' + dot;
	readyCount = readyCount - 1;


	prgTime.value += 0.1;
    },1000);

    let requestURL = 'https://masan-k.github.io/japanese-geography/contents.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    
    request.onload = function () {
        jsonFile = request.response;
	isOpenFile = true;
    }

};
