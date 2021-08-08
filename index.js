/*globals window, document, setInterval, event , localStorage */

let eCmbQuestion;

function clickBtnStart() {
    'use strict';
    
   }

function getRecord() {
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

function drawCtxLastYear() {
    'use strict';

    const X_BLANK_WIDTH = 60;
    const Y_BLANK_WIDTH = 50;
    const RECT_LENGTH = 10;
    const BLANK_LENGTH = 3;
    const INIT_BLANK_HEIGHT = 30;
    const INIT_BLANK_WIDTH = 30;
    const VERTICAL_COUNT = 7;
    const HORIZONTAL_COUNT = 50;

    let canvas = document.getElementById('cvsCatchUp');
    let ctx = canvas.getContext('2d'); 

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Character drawing
    ctx.lineWidth = '0.3';
    ctx.strokeStyle = '#7A756D';
    ctx.textBaseline = 'alphabetic';
    ctx.strokeText('Mon', 5, 50.3);
    ctx.strokeText('Wed', 5, 77.3);
    ctx.strokeText('Fri', 5, 105.3);

    ctx.textBaseline = 'top';
    ctx.strokeText('Less', 500, 130);
    ctx.fillStyle = getRectColor(0);
    ctx.fillRect(528, 133, RECT_LENGTH, RECT_LENGTH)
    
    ctx.textBaseline = 'top';
    ctx.fillStyle = getRectColor(2);
    ctx.fillRect(540, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.fillStyle = getRectColor(4);
    ctx.fillRect(552, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.fillStyle = getRectColor(6);
    ctx.fillRect(564, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.fillStyle = getRectColor(8);
    ctx.fillRect(576, 133, RECT_LENGTH, RECT_LENGTH)

    ctx.fillStyle = '#7A756D';
    ctx.strokeText('More', 595, 130);

    //------------------
    //Drawing of shapes
    //------------------
    ctx.lineWidth = '0.2';

    let nowDate = new Date();
    let dayOfWeek = nowDate.getDay();
    
    let record;
    record = getRecord();

    let blockCount = (VERTICAL_COUNT * HORIZONTAL_COUNT) + dayOfWeek + 1;
    let targetDate = new Date();
    targetDate.setDate(nowDate.getDate() - (blockCount - 1));

    let dateYmd = targetDate.getFullYear() + ('00' + (targetDate.getMonth()+1)).slice(-2) + ('00' + targetDate.getDate()).slice(-2);
    let count = 0;

    for(var x = 0; x <= HORIZONTAL_COUNT - 1; x++){
        for(var y = 0; y <= VERTICAL_COUNT - 1; y++){
                  
            for (var key in Object.keys(record.dateYmd)){
                if(dateYmd === record.dateYmd[key]){
                    count = record.count[key];
                }
            }

            ctx.fillStyle = getRectColor(count);
            count = 0;
            ctx.fillRect(INIT_BLANK_WIDTH + (BLANK_LENGTH + RECT_LENGTH) * x, INIT_BLANK_HEIGHT + (BLANK_LENGTH + RECT_LENGTH) * y, RECT_LENGTH, RECT_LENGTH);

            
            targetDate.setDate(targetDate.getDate() + 1);
            dateYmd = targetDate.getFullYear() + ('00' + (targetDate.getMonth()+1)).slice(-2) + ('00' + targetDate.getDate()).slice(-2);
        }
    }
    for(var y = 0; y <= dayOfWeek; y++){
        for (var key in Object.keys(record.dateYmd)){
            if(dateYmd === record.dateYmd[key]){
                count = record.count[key];
            }
        }

        ctx.fillStyle = getRectColor(count)
        count = 0;
        
        ctx.fillRect(INIT_BLANK_WIDTH + (BLANK_LENGTH + RECT_LENGTH) * HORIZONTAL_COUNT, INIT_BLANK_HEIGHT + (BLANK_LENGTH + RECT_LENGTH) * y, RECT_LENGTH, RECT_LENGTH)
        
        targetDate.setDate(targetDate.getDate() + 1);
        dateYmd = targetDate.getFullYear() + ('00' + (targetDate.getMonth()+1)).slice(-2) + ('00' + targetDate.getDate()).slice(-2);
    }
    ctx.stroke();
}


function init(contents) {
    'use strict';

    for (let key in contents) {
        let option_add = document.createElement("option");
        option_add.value = key;
        option_add.text = key;
        eCmbQuestion.appendChild(option_add);
    }
    
}

function clickButton() {
    'use strict';
    let dataIndex = event.currentTarget.dataset['index'];
    let eRdoMode = document.getElementsByName("rdoMode");
    let selectMode;

    if (dataIndex === 'data'){
	window.location.href = 'contents.json';
	return;
    }

    for(let i=0;i<eRdoMode.length;i++){
	if(eRdoMode[i].checked){
	    selectMode = eRdoMode[i].value
	}
    }
    if(selectMode === undefined){
	alert('Select "Mode".');
	return;
    }
    window.location.href = 'main.html?mode='+ selectMode + '&index=' + dataIndex;

}

window.onload = function () {
    'use strict';
    
    rdoCode.checked = true;
    btnData.addEventListener("click", clickButton, false); 

    btnTohoku.addEventListener("click", clickButton, false); 
    btnKanto.addEventListener("click", clickButton, false);  
    btnChubu.addEventListener("click", clickButton, false);  
    btnKansai.addEventListener("click", clickButton, false); 
    btnChugoku.addEventListener("click", clickButton, false); 
    btnShikoku.addEventListener("click", clickButton, false); 
    btnKyushu.addEventListener("click", clickButton, false); 
    btnRandom.addEventListener("click", clickButton, false); 

    drawCtxLastYear();

};
