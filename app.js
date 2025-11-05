
/* v5.7 inline quiz on index */
(function(){
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const el = (t,c)=>{const n=document.createElement(t); if(c) n.className=c; return n;};

  document.addEventListener('DOMContentLoaded', ()=>{
    const mountPoint = document.getElementById('instant-quiz');
    if(!mountPoint) return;

    const Q = [
      {axis:'X', title:'朝のはじまり', left:'そう思う', right:'そう思わない', bl:'ゆっくり整える', br:'すぐ動く'},
      {axis:'X', title:'計画が崩れたら勢いで切り替える', left:'そう思う', right:'そう思わない', bl:'静かに立て直す', br:'勢いで切替'},
      {axis:'X', title:'誘いがあればまず挑戦する', left:'そう思う', right:'そう思わない', bl:'様子を見る', br:'まず挑戦'},
      {axis:'Y', title:'話すほど元気が出るほうだ', left:'そう思う', right:'そう思わない', bl:'短めが楽', br:'話すと元気'},
      {axis:'Y', title:'判断は筋道を重視するほうだ', left:'そう思う', right:'そう思わない', bl:'気持ち優先', br:'筋道優先'},
      {axis:'Y', title:'困っている人には具体的に動いて助ける', left:'そう思う', right:'そう思わない', bl:'そっと寄りそう', br:'具体的に動く'},
      {axis:'Y', title:'夜は誰かと発散するほうが回復しやすい', left:'そう思う', right:'そう思わない', bl:'静かに回復', br:'誰かと発散'}
    ];

    const sec = el('section','iq-sec container');
    const heroStick = el('div','iq-stick');
    heroStick.innerHTML = '<div class="iq-progress"><div class="bar" id="iqBar"></div></div><div style="font-size:13px;color:#666">タップで進みます（全'+Q.length+'問）</div>';
    sec.appendChild(heroStick);

    const card = el('div','iq-card');
    sec.appendChild(card);
    mountPoint.replaceWith(sec);

    const ans = Array(Q.length).fill(0);
    function progress(){
      const done = ans.filter(v=>v>0).length;
      const bar = $('#iqBar'); if(bar) bar.style.width = Math.round(done/Q.length*100)+'%';
    }

    function render(){
      card.innerHTML='';
      Q.forEach((q,i)=>{
        const wrap = el('div','iq-q'); wrap.id='q'+i;
        const h = el('h3','iq-title'); h.textContent = `Q${i+1}：${q.title}`; wrap.appendChild(h);
        const row = el('div','lk-row');
        for(let j=1;j<=7;j++){
          const b = el('button','lk'); b.type='button'; b.dataset.i=j;
          const cls = j<=3?'agree': j===4?'neu':'dis'; b.classList.add(cls);
          if(ans[i]===j) b.classList.add('sel');
          b.onclick = ()=>{
            ans[i]=j; wrap.classList.add('answered');
            $$('#q'+i+' .lk').forEach(x=>x.classList.remove('sel')); b.classList.add('sel');
            progress();
            const nextIndex = ans.findIndex((v,idx)=>v===0 && idx>i);
            if(nextIndex!=-1){
              const target = document.getElementById('q'+nextIndex);
              target && target.scrollIntoView({behavior:'smooth', block:'center'});
            } else if(ans.every(v=>v>0)){
              finish();
            }
          };
          row.appendChild(b);
        }
        wrap.appendChild(row);
        const labs = el('div','iq-labels'); labs.innerHTML = `<span>${q.left}</span><span>${q.right}</span>`;
        wrap.appendChild(labs);
        card.appendChild(wrap);
      });
      progress();
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

    render();
  });
})();
