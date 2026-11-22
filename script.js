/* Sheikah Archive — projeto acadêmico não oficial. Tudo roda localmente, sem dependências JS. */
const PUZZLE = {"width":20,"height":18,"words":[{"word":"DMA","x":1,"y":0,"dir":"V","number":1,"clue":"Mecanismo que transfere dados para a memória sem ocupar continuamente a CPU."},{"word":"MEMORIADEMASSA","x":9,"y":1,"dir":"V","number":2,"clue":"Categoria que inclui SSD e HD para guardar arquivos permanentemente."},{"word":"RAM","x":0,"y":2,"dir":"H","number":3,"clue":"Memória volátil que guarda aplicativos ativos e dados temporários."},{"word":"MICROCONTROLADOR","x":2,"y":2,"dir":"V","number":4,"clue":"Chip que reúne processamento, memória e interfaces de entrada e saída."},{"word":"CACHE","x":5,"y":2,"dir":"H","number":5,"clue":"Memória rápida que guarda cópias de informações acessadas recentemente."},{"word":"ADDRESSBUS","x":6,"y":2,"dir":"V","number":6,"clue":"Conjunto de linhas que identifica qual posição de memória será acessada."},{"word":"QUADCORE","x":12,"y":5,"dir":"V","number":7,"clue":"Processador que possui quatro núcleos de execução."},{"word":"DATABUS","x":14,"y":5,"dir":"V","number":8,"clue":"Conjunto de linhas bidirecionais que transporta valores e instruções entre componentes."},{"word":"EEPROM","x":18,"y":5,"dir":"V","number":9,"clue":"Memória não volátil que permite guardar configurações mesmo após desligar o dispositivo."},{"word":"ROM","x":1,"y":6,"dir":"H","number":10,"clue":"Tipo de memória não volátil associado ao firmware de inicialização."},{"word":"ULA","x":12,"y":6,"dir":"H","number":11,"clue":"Parte da CPU responsável por cálculos e operações lógicas."},{"word":"DUALCORE","x":12,"y":8,"dir":"H","number":12,"clue":"Processador que possui dois núcleos de execução."},{"word":"CPU","x":16,"y":8,"dir":"V","number":13,"clue":"Componente central que busca e executa instruções de um programa."},{"word":"UC","x":11,"y":9,"dir":"H","number":14,"clue":"Parte da CPU que interpreta instruções e coordena os demais componentes."},{"word":"REGISTRADORES","x":2,"y":11,"dir":"H","number":15,"clue":"Pequenas memórias internas da CPU que guardam valores em uso imediato."},{"word":"FLASH","x":0,"y":14,"dir":"H","number":16,"clue":"Tecnologia regravável e não volátil utilizada para armazenar o programa no Arduino."}]};
const WORDS = PUZZLE.words.map((w,id)=>({...w,id}));
const $ = id => document.getElementById(id);
const keyOf=(x,y)=>`${x},${y}`;
const positions=w=>[...w.word].map((_,i)=>({x:w.x+(w.dir==='H'?i:0),y:w.y+(w.dir==='V'?i:0)}));
let currentScreen='home';
function setLinkMessage(message){const el=$('linkMessage');if(el)el.textContent=message;}
function showScreen(name){
  currentScreen=name;
  for(const s of document.querySelectorAll('.screen')){const on=s.id===`screen-${name}`;s.classList.toggle('active',on);s.hidden=!on;}
  if(name==='home') setLinkMessage('Link, selecione uma runa para começar sua jornada.');
  window.scrollTo({top:0,behavior:'instant'});
  if(name==='crossword'){renderCross(); setLinkMessage('Link, cada pista recuperada revela parte do mapa ancestral.');}
  if(name==='term'){renderTerm(); setLinkMessage('Link, preste atenção aos sinais da runa. Azul, âmbar e sombra guiarão seu caminho.');}
}
$('brandHome').addEventListener('click',()=>showScreen('home'));
for(const b of document.querySelectorAll('[data-home]'))b.addEventListener('click',()=>showScreen('home'));
$('openCrossword').addEventListener('click',()=>showScreen('crossword'));
$('openTerm').addEventListener('click',()=>showScreen('term'));

// Modal de confirmação — evita apagar uma partida acidentalmente.
function askConfirm(title,message,callback){
  const dialog=$('confirmDialog');$('dialogTitle').textContent=title;$('dialogMessage').textContent=message;
  function finished(){dialog.removeEventListener('close',finished);if(dialog.returnValue==='confirm')callback();}
  dialog.addEventListener('close',finished,{once:true});dialog.showModal();
}

// MODO CRUZADINHA
const crossValues=new Map(),crossCells=new Map(),crossMembership=new Map();
let selectedId=0,selectedIndex=0,crossEvaluated=false;
let crossCorrect=new Set();
function crossWord(id){return WORDS[id]}
function wordLetters(w){return positions(w).map(p=>crossValues.get(keyOf(p.x,p.y))||'').join('')}
function wordSolved(w){return wordLetters(w)===w.word}
function setupCross(){
  const board=$('board');board.style.gridTemplateColumns=`repeat(${PUZZLE.width},var(--cell))`;
  board.style.gridTemplateRows=`repeat(${PUZZLE.height},var(--cell))`;
  const starts=new Map();
  for(const w of WORDS){
    starts.set(keyOf(w.x,w.y),w.number);
    positions(w).forEach((p,i)=>{const k=keyOf(p.x,p.y);if(!crossMembership.has(k))crossMembership.set(k,[]);crossMembership.get(k).push({id:w.id,index:i})});
  }
  for(let y=0;y<PUZZLE.height;y++)for(let x=0;x<PUZZLE.width;x++){
    const k=keyOf(x,y),tile=document.createElement('button');tile.type='button';tile.className='cross-tile';
    if(!crossMembership.has(k)){tile.classList.add('empty');tile.tabIndex=-1;tile.setAttribute('aria-hidden','true');}
    else{
      const number=starts.get(k);
      if(number!==undefined){const label=document.createElement('span');label.className='tile-number';label.textContent=number;tile.append(label)}
      const letter=document.createElement('span');letter.className='tile-letter';tile.append(letter);
      tile.setAttribute('aria-label',`Casa coluna ${x+1}, linha ${y+1}`);
      tile.addEventListener('click',()=>{
        const members=crossMembership.get(k),existing=members.find(m=>m.id===selectedId);
        const picked=existing&&members.length>1?members.find(m=>m.id!==selectedId):existing||members[0];
        selectCross(picked.id,picked.index,true);
      });
    }
    crossCells.set(k,tile);board.append(tile);
  }
  for(const [direction,target,count] of [['H','horizontalClues','horizontalCount'],['V','verticalClues','verticalCount']]){
    const ws=WORDS.filter(w=>w.dir===direction).sort((a,b)=>a.number-b.number);$(count).textContent=String(ws.length).padStart(2,'0');
    for(const w of ws){const btn=document.createElement('button');btn.type='button';btn.className='clue-item';btn.dataset.word=w.id;
      const n=document.createElement('span');n.className='n';n.textContent=String(w.number).padStart(2,'0');
      const text=document.createElement('span');text.textContent=w.clue;btn.append(n,text);
      btn.addEventListener('click',()=>selectCross(w.id,0,true));$(target).append(btn);
    }
  }
  renderCross();
}
function selectCross(id,index,focus=false){selectedId=id;selectedIndex=index;renderCross();
  if(focus){const p=positions(crossWord(id))[index];crossCells.get(keyOf(p.x,p.y))?.focus({preventScroll:true})}
  document.querySelector(`.clue-item[data-word="${id}"]`)?.scrollIntoView({block:'nearest',behavior:'instant'});
}
function renderCross(){
  const w=crossWord(selectedId),wps=positions(w),selectedKey=keyOf(wps[selectedIndex].x,wps[selectedIndex].y);
  const wkeys=new Set(wps.map(p=>keyOf(p.x,p.y)));
  for(const [key,tile] of crossCells){if(!crossMembership.has(key))continue;
    const members=crossMembership.get(key);
    const correct=crossEvaluated&&members.some(m=>crossCorrect.has(m.id));
    const wrong=crossEvaluated&&!correct&&members.some(m=>{const word=crossWord(m.id);return wordLetters(word).length===word.word.length&&!crossCorrect.has(word.id)});
    tile.className='cross-tile';if(correct)tile.classList.add('correct');else if(wrong)tile.classList.add('wrong');
    if(wkeys.has(key))tile.classList.add('in-word');if(key===selectedKey)tile.classList.add('selected');
    tile.querySelector('.tile-letter').textContent=crossValues.get(key)||'';
  }
  for(const item of document.querySelectorAll('.clue-item')){const id=+item.dataset.word;item.classList.toggle('active',id===selectedId);item.classList.toggle('solved',crossEvaluated&&crossCorrect.has(id));}
  $('focusNumber').textContent=String(w.number).padStart(2,'0');$('focusDirection').textContent=w.dir==='H'?'HORIZONTAL':'VERTICAL';$('focusClue').textContent=w.clue;$('focusLength').textContent=`${w.word.length} CARACTERES`;
  $('crossScore').innerHTML=`${String(crossCorrect.size).padStart(2,'0')} <span>/ ${WORDS.length}</span>`;
  $('crossProgress').style.width=`${Math.round(crossCorrect.size*100/WORDS.length)}%`;
}
function crossEdited(){crossEvaluated=false;crossCorrect.clear();renderCross();setCrossFeedback('Alterações não verificadas. Clique em Conferir registros.');}
function setCrossFeedback(text,kind=''){$('crossFeedback').textContent=text;$('crossFeedback').className=`feedback ${kind}`}
function inputCrossLetter(letter){const w=crossWord(selectedId),p=positions(w)[selectedIndex];crossValues.set(keyOf(p.x,p.y),letter);
  if(selectedIndex<w.word.length-1)selectedIndex++;crossEdited();}
function eraseCross(backspace){const w=crossWord(selectedId);let p=positions(w)[selectedIndex],k=keyOf(p.x,p.y);
  if(backspace&&!crossValues.has(k)&&selectedIndex>0){selectedIndex--;p=positions(w)[selectedIndex];k=keyOf(p.x,p.y)}
  crossValues.delete(k);crossEdited();}
function moveCross(key){const w=crossWord(selectedId),p=positions(w)[selectedIndex],desired=key==='ArrowLeft'||key==='ArrowRight'?'H':'V';
  const members=crossMembership.get(keyOf(p.x,p.y));const across=members.find(m=>crossWord(m.id).dir===desired);
  if(across&&across.id!==selectedId){selectCross(across.id,across.index);return}
  selectedIndex=Math.max(0,Math.min(w.word.length-1,selectedIndex+(key==='ArrowRight'||key==='ArrowDown'?1:-1)));renderCross();}
$('checkCrossword').addEventListener('click',()=>{
  crossEvaluated=true;crossCorrect=new Set(WORDS.filter(wordSolved).map(w=>w.id));renderCross();
  const complete=WORDS.filter(w=>wordLetters(w).length===w.word.length).length;
  if(crossCorrect.size===WORDS.length){setCrossFeedback('Todos os 16 registros restaurados! Santuário concluído.','success');setLinkMessage('Link... você conseguiu! A memória da Pedra Sheikah foi restaurada.');}
  else if(!complete){setCrossFeedback('Preencha ao menos uma palavra completa para conferir.');setLinkMessage('Link, as inscrições ainda estão incompletas. Continue sua busca.');}
  else {setCrossFeedback(`${crossCorrect.size} / ${WORDS.length} corretas · ${complete-crossCorrect.size} palavra(s) completas com erro.`,crossCorrect.size?'success':'error');setLinkMessage(crossCorrect.size?'Link, as primeiras runas responderam ao seu conhecimento.':'Link, há símbolos fora de ordem. Consulte as inscrições novamente.');}
});
$('resetCrossword').addEventListener('click',()=>{
  const reset=()=>{crossValues.clear();crossCorrect.clear();crossEvaluated=false;selectedId=0;selectedIndex=0;renderCross();setCrossFeedback('Mapa reiniciado. Bom desafio!')};
  if(crossValues.size)askConfirm('Reiniciar mapa?','Todas as letras preenchidas serão apagadas.',reset);else reset();
});

// MODO CÓDIGO SECRETO — um Termo de seis tentativas, com uma resposta da lista.
const MAX_TRIES=6;
let secret,termGuesses=[],termInput='',termStatus='playing',termFeedback='',termKeyStates={};
const priority={miss:1,near:2,hit:3};
function newSecret(){
  // Evita repetir o mesmo termo na sequência, quando possível.
  const candidates=WORDS.filter(w=>w.word!==secret);
  secret=candidates[Math.floor(Math.random()*candidates.length)].word;
  termGuesses=[];termInput='';termStatus='playing';termFeedback='Digite sua tentativa e pressione ENTER.';termKeyStates={};setLinkMessage('Link, um novo selo despertou. Confie em sua percepção.');renderTerm();
}
function termClue(){return WORDS.find(w=>w.word===secret).clue}
function evalGuess(guess,solution){
  const result=Array(solution.length).fill('miss'),remaining={};
  for(let i=0;i<solution.length;i++)if(guess[i]===solution[i])result[i]='hit';else remaining[solution[i]]=(remaining[solution[i]]||0)+1;
  for(let i=0;i<guess.length;i++)if(result[i]!=='hit'&&remaining[guess[i]]>0){result[i]='near';remaining[guess[i]]--}
  return result;
}
function termType(key){
  if(currentScreen!=='term'||termStatus!=='playing')return;
  if(key==='BACKSPACE'){termInput=termInput.slice(0,-1);renderTerm();return}
  if(key==='ENTER'){submitTerm();return}
  if(/^[A-Z]$/.test(key)&&termInput.length<secret.length){termInput+=key;renderTerm()}
}
function submitTerm(){
  if(termInput.length!==secret.length){termFeedback=`Este código exige ${secret.length} letras.`;renderTerm();return}
  const evaluated=evalGuess(termInput,secret);
  termGuesses.push({guess:termInput,states:evaluated});
  for(let i=0;i<termInput.length;i++){const letter=termInput[i],state=evaluated[i];if((priority[state]||0)>(priority[termKeyStates[letter]]||0))termKeyStates[letter]=state}
  if(termInput===secret){termStatus='won';termFeedback=`Selo rompido em ${termGuesses.length} tentativa(s)!`;setLinkMessage('Link, você superou a prova! A força ancestral reconhece sua sabedoria.');}
  else if(termGuesses.length===MAX_TRIES){termStatus='lost';termFeedback=`O selo permaneceu fechado. O termo era ${secret}.`;setLinkMessage('Link, até os heróis precisam tentar novamente. Desperte outro selo.');}
  else termFeedback=`Tentativa ${termGuesses.length} de ${MAX_TRIES} registrada. Continue!`;
  termInput='';renderTerm();
}
function renderTerm(){if(!secret)return;
  $('triesLeft').textContent=String(MAX_TRIES-termGuesses.length).padStart(2,'0');$('termMeta').textContent=`${secret.length} CARACTERES`;
  $('termClue').textContent=termClue();const board=$('termBoard');board.replaceChildren();
  const cellSize=Math.min(49,Math.floor((790-(secret.length-1)*5)/secret.length));
  board.style.setProperty('--term-size',`${Math.max(26,cellSize)}px`);
  for(let r=0;r<MAX_TRIES;r++){
    const row=document.createElement('div');row.className='term-row';const past=termGuesses[r];const letters=past?past.guess:(r===termGuesses.length&&termStatus==='playing'?termInput:'');
    for(let i=0;i<secret.length;i++){const cell=document.createElement('span');cell.className='term-cell';
      if(past)cell.classList.add(past.states[i]);else if(r===termGuesses.length&&termStatus==='playing')cell.classList.add('current');
      if(letters[i])cell.classList.add('filled');cell.textContent=letters[i]||'';row.append(cell)}
    board.append(row);
  }
  const feedback=$('termFeedback');feedback.textContent=termFeedback;feedback.className=`term-feedback ${termStatus==='won'?'success':termStatus==='lost'?'error':''}`;
  const keyboard=$('termKeyboard');keyboard.replaceChildren();
  for(const seq of ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM']){const row=document.createElement('div');row.className='keyboard-row';
    if(seq==='ZXCVBNM')row.append(createKey('ENTER'));
    for(const key of seq)row.append(createKey(key));
    if(seq==='ZXCVBNM')row.append(createKey('BACKSPACE'));
    keyboard.append(row);
  }
}
function createKey(value){const btn=document.createElement('button');btn.type='button';btn.className='key';btn.textContent=value==='BACKSPACE'?'⌫':value;
  btn.setAttribute('aria-label',value==='BACKSPACE'?'Apagar':value==='ENTER'?'Confirmar':`Letra ${value}`);
  if(value.length>1)btn.classList.add('special');if(termKeyStates[value])btn.classList.add(termKeyStates[value]);
  btn.addEventListener('click',()=>termType(value));return btn;
}
$('newTerm').addEventListener('click',()=>{
  const reset=()=>newSecret();if(termGuesses.length||termInput)askConfirm('Gerar novo código?','A partida atual será abandonada e uma nova palavra será sorteada.',reset);else reset();
});
// Teclado físico funciona enquanto o foco está no tabuleiro ou na própria página.
document.addEventListener('keydown',event=>{
  if($('confirmDialog').open||event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.target.closest('input, textarea, [contenteditable="true"]'))return;
  if(currentScreen==='crossword'){
    if(/^[a-zA-Z]$/.test(event.key)){event.preventDefault();inputCrossLetter(event.key.toUpperCase())}
    else if(event.key==='Backspace'||event.key==='Delete'){event.preventDefault();eraseCross(event.key==='Backspace')}
    else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();moveCross(event.key)}
    else if(event.key==='Tab'&&event.target.classList.contains('cross-tile')){event.preventDefault();selectCross((selectedId+(event.shiftKey?WORDS.length-1:1))%WORDS.length,0)}
  } else if(currentScreen==='term'){
    if(/^[a-zA-Z]$/.test(event.key)){event.preventDefault();termType(event.key.toUpperCase())}
    else if(event.key==='Backspace'){event.preventDefault();termType('BACKSPACE')}
    else if(event.key==='Enter'&&!event.target.closest('button')){event.preventDefault();termType('ENTER')}
  }
});
setupCross();newSecret();showScreen('home');
