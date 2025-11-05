
/* v5.6: 7-point Likert, auto-advance, single page */
(function(){
  'use strict';
  const $ = sel => document.querySelector(sel);
  const el = (tag, cls) => { const n=document.createElement(tag); if(cls) n.className=cls; return n; };

  document.addEventListener('DOMContentLoaded', ()=>{
    const nav = $('#nav');
    if(nav && !nav.dataset.enhanced){
      nav.dataset.enhanced='1';
      nav.querySelectorAll('a').forEach(a=>{
        if(!a.querySelector('.ic')){
          const i = el('span','ic');
          i.textContent = (a.textContent.includes('診断')?'🧭': a.textContent.includes('タイプ一覧')?'🗂': a.textContent.includes('相性')?'💞':'ℹ️');
          a.prepend(i);
        }
      });
    }
  });

  const Q = [
    {axis:'X', title:'朝のはじまり', left:'そう思う', right:'そう思わない', bl:'ゆっくり整える', br:'すぐ動く'},
    {axis:'X', title:'計画が崩れたら勢いで切り替える', left:'そう思う', right:'そう思わない', bl:'静かに立て直す', br:'勢いで切替'},
    {axis:'X', title:'誘いがあればまず挑戦する', left:'そう思う', right:'そう思わない', bl:'様子を見る', br:'まず挑戦'},
    {axis:'Y', title:'話すほど元気が出るほうだ', left:'そう思う', right:'そう思わない', bl:'短めが楽', br:'話すと元気'},
    {axis:'Y', title:'判断は筋道を重視するほうだ', left:'そう思う', right:'そう思わない', bl:'気持ち優先', br:'筋道優先'},
    {axis:'Y', title:'困っている人には具体的に動いて助ける', left:'そう思う', right:'そう思わない', bl:'そっと寄りそう', br:'具体的に動く'},
    {axis:'Y', title:'夜は誰かと発散するほうが回復しやすい', left:'そう思う', right:'そう思わない', bl:'静かに回復', br:'誰かと発散'}
  ];

  function mountQuiz(){
    const box = document.getElementById('quiz');
    const bar = document.getElementById('bar');
    if(!box || !bar) return;
    box.classList.add('slide');
    const view = el('div','qview show');
    const old = document.getElementById('qwrap'); if(old) box.replaceChild(view, old); else box.insertBefore(view, box.children[1]);

    let idx=0;
    const ans = Array(Q.length).fill(4); // center default (1..7)

    function render(){
      const q=Q[idx];
      bar.style.width = Math.round((idx/Q.length)*100)+'%';
      view.classList.remove('show');
      setTimeout(()=>{
        view.innerHTML='';
        const h2 = el('h2','q-title'); h2.textContent=`Q${idx+1} / ${Q.length}：${q.title}`; view.appendChild(h2);

        const likert = el('div','likert');
        const row = el('div','lk-row');
        for(let i=1;i<=7;i++){
          const b = el('button','lk'); b.type='button'; b.dataset.i=String(i);
          const cls = i<=3 ? 'agree' : (i===4 ? 'neu' : 'dis');
          b.classList.add(cls);
          if(ans[idx]===i) b.classList.add('sel');
          b.onclick=()=>{ ans[idx]=i; if(idx<Q.length-1){ idx++; render(); } else { finish(); } };
          row.appendChild(b);
        }
        likert.appendChild(row);
        const labs = el('div','lk-labels'); labs.innerHTML = `<span>${q.left}</span><span>${q.right}</span>`;
        likert.appendChild(labs);
        view.appendChild(likert);

        view.classList.add('show');
      }, 10);
    }

    function finish(){
      const norm = ans.map(v=>(v-1)/6);
      let x=0,y=0,xc=0,yc=0;
      for(let i=0;i<Q.length;i++){
        if(Q[i].axis==='X'){ x+=norm[i]; xc++; } else { y+=norm[i]; yc++; }
      }
      const X=x/xc, Y=y/yc;
      const lv=v=>v<.25?1: v<.5?2: v<.75?3: 4;
      const code='ABCD'[lv(X)-1]+String(lv(Y));
      const t=(window.AFFINIA_TYPES||[]).find(t=>t.code===code) || (window.AFFINIA_TYPES||[])[0] || {code, name:'タイプ', catch:'', desc:''};
      sessionStorage.setItem('affinia_result', JSON.stringify({type:t, code, axes:{X,Y}}));
      location.href='result.html?t='+encodeURIComponent(code);
    }

    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    if(prev){ prev.onclick=()=>{ if(idx>0){ idx--; render(); } }; }
    if(next){ next.onclick=()=>{ if(idx<Q.length-1){ idx++; render(); } else { finish(); } }; }

    render();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ try{ mountQuiz(); }catch(e){ console.error(e); } });
})();
