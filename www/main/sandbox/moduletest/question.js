
export let questionCode;
export let answer;
export let pos;
export let kana;

export function setData(jsonData,m_mode,m_targetCode){
  let workQuestionCode = [];
  let workAnswer = [];
  let workPos = [];
  let workKana = [];
  let randomQuestionCode = [];
  let randomAnswer = [];
  let randomPos = [];
  let randomKana = [];

  for(let rec of jsonData){
    if(rec.group === m_targetCode || m_targetCode ==='all'){
      workQuestionCode.push(rec.code);
      workAnswer.push(rec.name);
      workPos.push(rec.pos);
      workKana.push(rec.kana);
    }
  }
  if(m_mode === 'veryEasy'){
    randomQuestionCode = workQuestionCode;
    randomAnswer = workAnswer;
    randomPos = workPos;
    randomKana = workKana;

  }else{
    workLength = workQuestionCode.length;
    while(randomQuestionCode.length < workLength){
      for(let i in workQuestionCode){
        let trgIndex = getRandom(0 ,workQuestionCode.length - i - 1);
        randomQuestionCode.push(workQuestionCode[trgIndex]);
        randomAnswer.push(workAnswer[trgIndex]);
        randomPos.push(workPos[trgIndex]);
        randomKana.push(workKana[trgIndex]);

        workQuestionCode.splice(trgIndex, 1);
        workAnswer.splice(trgIndex, 1);
        workPos.splice(trgIndex, 1);
        workKana.splice(trgIndex, 1);
      }
    }
  }

  if(m_mode === 'veryEasy' || m_mode === 'easy'){
    questionCode = workQuestionCode.slice();
    answer = workAnswer.slice();
    pos = workPos.slice();
    kana = workKana.slice();

  }else{
    questionCode = randomQuestionCode;
    answer = randomAnswer;
    pos = randomPos;
  } 

  function getRandom(min, max) {
    let range = max - min + 1;
    let random = Math.floor(Math.random() * range);
    return random + min;
  };
}

