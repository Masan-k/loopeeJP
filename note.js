window.onload = function(){
    'use strict';
    //------------
    // JSON Read..
    //------------
    let requestURL = 'https://masan-k.github.io/japanese-geography/contents.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    
    request.onload = function () {
	let jsonFile = request.response;
	//isOpenFile = true;
   	
	for(let rec of jsonFile){
	    const cellCode = document.createElement('td');
	    const cellName = document.createElement('td');
	    const cellNote = document.createElement('td');

	    const row = document.createElement('tr');
	    
	    cellCode.appendChild(document.createTextNode(rec.code));
	    cellName.appendChild(document.createTextNode(rec.prefectures));
	    cellNote.appendChild(document.createTextNode(rec.rural));
     
	    row.appendChild(cellCode);
	    row.appendChild(cellName);
	    row.appendChild(cellNote);
	    
	    noteTable.appendChild(row);
	}
    }

}
