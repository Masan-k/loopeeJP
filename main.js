/*globals window, document, setInterval, event , localStorage */

function init(contents) {
    'use strict';

    for (let index in contents) {
	console.log('index -> ' + index);
    }
    for(let value of contents) {
	console.log('value -> ' + value.rural)
    }
    
}

window.onload = function () {
    'use strict';
    
    /*
    btnTohoku.addEventListener("click", clickButton, false); 
    btnKanto.addEventListener("click", clickButton, false);  
    btnChubu.addEventListener("click", clickButton, false);  
    btnKansai.addEventListener("click", clickButton, false); 
    btnChugoku.addEventListener("click", clickButton, false); 
    btnShikoku.addEventListener("click", clickButton, false); 
    btnKyushu.addEventListener("click", clickButton, false); 
    btnRandom.addEventListener("click", clickButton, false); 
    */

    let requestURL = 'https://masan-k.github.io/japanese-geography/contents.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    
    request.onload = function () {
        let contentsAll = request.response;
        init(contentsAll);
    }

};
