const MAP_WIDTH = 628;
const MAP_HEIGHT = 360;
const CAMERA_WIDTH = MAP_WIDTH/2;
const CAMERA_HEIGHT = MAP_HEIGHT/2;
const MARK_PERCENT = 1;

const mainContainer = document.getElementById('main-container');
const subContainer = document.getElementById('sub-container');

let m_cameraX;
let m_cameraY;
let m_observer;

function setSvgCss(){
  const eleMainSvg = document.getElementById("mainSvg");  
  const rect = document.getElementById("main-container").getBoundingClientRect();
  let containerHeight = window.innerHeight - rect.top;
  let containerWidth = rect.width;
  let svgHeight = containerWidth * (MAP_HEIGHT / MAP_WIDTH);
  // console.log(`svgHeight:${Math.floor(svgHeight)},containerHeight:${Math.floor(containerHeight)}`);

  if (!eleMainSvg) {
    console.warn("SVG 要素が見つかりません");
    return;
  }

  if(svgHeight >= containerHeight){
    console.log("height base");
    eleMainSvg.style.height = containerHeight-20;
    eleMainSvg.style.width = "100%";
    
    // eleMainSvg.style.width = eleMainSvg.style.height * (MAP_WIDTH/MAP_HEIGHT);

  }else{
    console.log("width base");
    eleMainSvg.style.height = "100%";
    eleMainSvg.style.width = "100%";
  }

  // eleMainSvg.setAttribute("display","flex");
  // eleMainSvg.setAttribute("justify-content","center");       

}
window.addEventListener('resize', function () {
  setSvgCss();
});

function getMapPath(isColor,isBorder){
  let filePath = "img/map"
  if(!isColor){
    filePath += "_nocolor"
  }
  if(!isBorder){
    filePath += "_noborder"
  }
  return filePath += ".svg"
}
// -----------------------------------------------------------------------
// svgを追加されたタイミングでマークをクリア・描画するのにobserverを利用
// observer用に対象座標をsetPoint設定している
// -----------------------------------------------------------------------
export function draw(x,y,_isColor,_isBorder){
  m_observer.setPointX(x);
  m_observer.setPointY(y);
  let mapPath = getMapPath(_isColor,_isBorder);
  drawMap(x,y,mapPath);
}

export function disconnect(){
  m_observer.disconnect();
}

export function drawMarkToGroupCode(jsonData,groupCodes,mode){
  clearMark(mainContainer);
  for(let rec of jsonData){ 
    groupCodes.forEach(function(groupCode){
      if(groupCode.trim() === rec.group){ 
        drawMark(rec.pos[0],rec.pos[1],mainContainer);
      }
    });
  }
}

export function setObserverGame(){
  setObserver();
  function setObserver(){
    m_observer = new MutationObserver((mutationsList) => {
      for(const mutation of mutationsList){
        if(mutation.type === "childList"){
          const addedNodes = Array.from(mutation.addedNodes);
          addedNodes.forEach((node) => {
            if(node.nodeName === "svg"){
              if(addedNodes[0].parentElement.childNodes[0].parentNode.id === 'main-container'){
                clearMark(mainContainer);
                drawMark(m_observer.pointX, m_observer.pointY, mainContainer);
                
              }else if(addedNodes[0].parentElement.childNodes[0].parentNode.id === 'sub-container'){
                clearMark(subContainer);
                drawMark(m_observer.pointX, m_observer.pointY, subContainer,4);
              }
            }
          });
        }
      }
    })
    m_observer.observe(mainContainer, {childList:true});
    m_observer.observe(subContainer, {childList:true});

    m_observer.setPointX = function (x) {this.pointX = x;};
    m_observer.setPointY = function (y) {this.pointY = y;};
  }
}
function clearMark(container){
  if(container.querySelector("svg")){
    const marks = container.querySelector("svg").querySelectorAll('.mark'); 
    marks.forEach(marks => marks.remove());
  }
}

function drawMark(x,y,ele,zoomLevel = 1){
  //console.log(`x:${x}  y:${y}`);
  const radius = MAP_WIDTH * MARK_PERCENT/100;
  const svgEle = ele.querySelector('svg');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', radius * zoomLevel);
  circle.setAttribute('stroke-width', 1*zoomLevel);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', 'red');
  circle.classList.add('mark');

  const circleSmall = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleSmall.setAttribute('cx', x);
  circleSmall.setAttribute('cy', y);
  circleSmall.setAttribute('r', radius/4 * zoomLevel);
  circleSmall.setAttribute('fill', 'red');
  circleSmall.classList.add('mark');

  svgEle.appendChild(circle);
  svgEle.appendChild(circleSmall);
}

export function drawMapFullMainContainer(_isColor,_isBorder){
  clearMark(mainContainer);
  let mapPath = getMapPath(_isColor,_isBorder)
  drawMapAll(0,0,'main-container',mapPath);
}
function isMobile() {
  return window.innerWidth <= 768; // 768px 以下ならスマホと判定
}
function drawMapAll(x,y,mapId,mapPath){
  fetch(mapPath)
    .then(response => response.text())
    .then(svg => {

      document.getElementById(mapId).innerHTML = svg;
      const svgElement = document.getElementById(mapId).querySelector('svg');
      // viewBoxを設定してトリミング（x, y, width, height）
      svgElement.setAttribute('viewBox', `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`);
      //console.log(`map_width:${MAP_WIDTH} map_height:${MAP_HEIGHT}`);
      if(mapId === 'sub-container'){
          svgElement.setAttribute('width', `100%`);

          svgElement.setAttribute('height', `100%`);
      }else if(mapId === 'main-container'){
          svgElement.setAttribute('width', '100%');
          svgElement.setAttribute('height', '100%');
      }
      // アスペクト比を維持
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      if(mapId === 'sub-container'){
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', m_cameraX);
        rect.setAttribute('y', m_cameraY);
        rect.setAttribute('width', CAMERA_WIDTH);
        rect.setAttribute('height', CAMERA_HEIGHT);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', 'red');
        rect.setAttribute('stroke-width', '0.5');
        svgElement.appendChild(rect);
      }
    });
}

function drawMap(pointX,pointY,mapPath){
  _drawMapZoom(pointX,pointY);
  drawMapAll(pointX,pointY,'sub-container',mapPath);

  function _drawMapZoom(x,y){
    fetch(mapPath)
      .then(response => response.text())
      .then(svg => {
        //const mainContainer = document.getElementById('main-container');
        mainContainer.innerHTML = svg;
        const svgElement =  mainContainer.querySelector('svg');
        const viewBox = svgElement.getAttribute('viewBox');

        if (viewBox) {
          const [x, y, width, height] = viewBox.split(' ').map(Number);
          //console.log(`viewBox - 幅: ${width}, 高さ: ${height}`);
        } else {
          //console.log('viewBox属性がありません');
        }

        if(x <= CAMERA_WIDTH/2){
          m_cameraX = 0;
        }else if(MAP_WIDTH - CAMERA_WIDTH/2 < x){
          m_cameraX = MAP_WIDTH - CAMERA_WIDTH;
        }else{
          m_cameraX = pointX-CAMERA_WIDTH/2;
        }

        if(y <= CAMERA_HEIGHT/2){
          m_cameraY = 0;
        }else if(MAP_HEIGHT - CAMERA_HEIGHT/2 < y){
          m_cameraY = MAP_HEIGHT - CAMERA_HEIGHT;
        }else{
          m_cameraY = pointY-CAMERA_HEIGHT/2;
        } 

        // viewBoxを設定してトリミング（x, y, width, height）
        svgElement.setAttribute('viewBox', `${m_cameraX} ${m_cameraY} ${CAMERA_WIDTH} ${CAMERA_HEIGHT}`);
        svgElement.setAttribute("id", "mainSvg");
        // svgElement.setAttribute('width', `100%`);
        setSvgCss();
        
        svgElement.setAttribute('preserveAspectRatio', 'xMinYMin meet'); // アスペクト比を維持
        // svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet'); // アスペクト比を維持
        // svgElement.setAttribute('preserveAspectRatio', 'none'); // アスペクト比を維持
      });
  }
}
