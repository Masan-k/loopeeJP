
export let code;
export let answer;
export let pos;
export let kana;

export function setData(jsonData,mode,groupCodes){
  let workCode = [];
  let workAnswer = [];
  let workPos = [];
  let workKana = [];

  let randomCode = [];
  let randomAnswer = [];
  let randomPos = [];
  let randomKana = [];

  for(let rec of jsonData){
    groupCodes.forEach(groupCode =>{
      if(rec.group === groupCode){
        workCode.push(rec.code);
        workAnswer.push(rec.name);
        workPos.push(rec.pos);
        workKana.push(rec.kana);
      }
    });
  }
  if(mode === 'easy1' || mode === 'check'){
    randomCode = workCode;
    randomAnswer = workAnswer;
    randomPos = workPos;
    randomKana = workKana;

  }else{
    const questionCount = workCode.length;
    while(randomCode.length < questionCount){
      let trgIndex = getRandom(0 ,workCode.length-1);
      
      randomCode.push(workCode[trgIndex]);
      randomAnswer.push(workAnswer[trgIndex]);
      randomPos.push(workPos[trgIndex]);
      randomKana.push(workKana[trgIndex]);

      workCode.splice(trgIndex, 1);
      workAnswer.splice(trgIndex, 1);
      workPos.splice(trgIndex, 1);
      workKana.splice(trgIndex, 1);
    }
  }

  if(mode === 'easy1' || mode === 'check'){
    code = workCode.slice();
    answer = workAnswer.slice();
    pos = workPos.slice();
    kana = workKana.slice();
    
  }else{
    code = randomCode.slice();
    answer = randomAnswer.slice();
    pos = randomPos.slice();
    kana = randomKana.slice();
  }

  function getRandom(min, max) {
    let range = max - min + 1;
    let random = Math.floor(Math.random() * range);
    return random + min;
  };
}

