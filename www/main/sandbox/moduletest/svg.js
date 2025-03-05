const MAP_WIDTH = 239;
const MAP_HEIGHT = 179;
const CAMERA_WIDTH = MAP_WIDTH/2;
const CAMERA_HEIGHT = MAP_HEIGHT/2;
let m_cameraX;
let m_cameraY;
let m_observer;
const mainContainer = document.getElementById('main-container');
const subContainer = document.getElementById('sub-container');

export function draw(x,y){
  // -----------------------------------------------------------------------
  // svgを追加されたタイミングでマークをクリア・描画するため、
  // observerでマークを描画するため、書き込む座標をsetPointで事前に設定する
  // -----------------------------------------------------------------------
  m_observer.setPointX(x);
  m_observer.setPointY(y);
  drawMap(x,y);
}

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
              drawMark(m_observer.pointX,m_observer.pointY,mainContainer);
              
            }else if(addedNodes[0].parentElement.childNodes[0].parentNode.id === 'sub-container'){
              clearMark(subContainer);
              drawMark(m_observer.pointX,m_observer.pointY,subContainer,4);
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


function clearMark(container){
  if(container.querySelector("svg")){
    const marks = container.querySelector("svg").querySelectorAll('.mark'); 
    marks.forEach(marks => marks.remove());
  }
}
  
function drawMark(x,y,ele,zoomLevel = 1){
  let svgEle = ele.querySelector('svg');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', 4*zoomLevel);
  circle.setAttribute('stroke-width', 0.2*zoomLevel);
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', 'red');
  circle.classList.add('mark');

  const circleSmall = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circleSmall.setAttribute('cx', x);
  circleSmall.setAttribute('cy', y);
  circleSmall.setAttribute('r', 1*zoomLevel);
  circleSmall.setAttribute('fill', 'red');
  circleSmall.classList.add('mark');

  svgEle.appendChild(circle);
  svgEle.appendChild(circleSmall);
}

function drawMap(pointX,pointY){
  const SVG_MAP_FILE_PATH = 'img/map_tokyo.svg'
  _drawMapZoom(pointX,pointY);
  _drawMapAll(pointX,pointY);

  function _drawMapAll(x,y){
    fetch(SVG_MAP_FILE_PATH)
      .then(response => response.text())
      .then(svg => {

        document.getElementById('sub-container').innerHTML = svg;
        const svgElement = document.getElementById('sub-container').querySelector('svg');
        // viewBoxを設定してトリミング（x, y, width, height）
        svgElement.setAttribute('viewBox', `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`);
        svgElement.setAttribute('width', `50%`);
        svgElement.setAttribute('height', `50%`);
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet'); // アスペクト比を維持

        // 属性を設定
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', m_cameraX);
        rect.setAttribute('y', m_cameraY);
        rect.setAttribute('width', CAMERA_WIDTH);
        rect.setAttribute('height', CAMERA_HEIGHT);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', 'red');
        rect.setAttribute('stroke-width', '0.5');

        svgElement.appendChild(rect);
      });
  }
  function _drawMapZoom(x,y){
    fetch(SVG_MAP_FILE_PATH)
      .then(response => response.text())
      .then(svg => {
        const mainContainer = document.getElementById('main-container');
        mainContainer.innerHTML = svg;
        const svgElement =  mainContainer.querySelector('svg');
        const viewBox = svgElement.getAttribute('viewBox');

        if (viewBox) {
          const [x, y, width, height] = viewBox.split(' ').map(Number);
          //console.log(`viewBox - 幅: ${width}, 高さ: ${height}`);
        } else {
          console.log('viewBox属性がありません');
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
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet'); // アスペクト比を維持
      });
  }
}
