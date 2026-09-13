(function(){
  var SB_URL='https://zilmaasikrkjgvyuikja.supabase.co';
  var SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbG1hYXNpa3Jramd2eXVpa2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODA1OTcsImV4cCI6MjEwMjg1NjU5N30.GH-gyARlolXgxdlbasKAW9PbEkWfSGVgsGhpS-6FOl4';
  var q=new URLSearchParams(location.search);
  var utm={}; ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){ if(q.get(k)) utm[k]=q.get(k); });
  var camp=q.get('camp')||q.get('utm_campaign')||'';
  var owner=(camp==='owner-check');
  var sid=null; try{ sid=sessionStorage.getItem('tb_sid'); if(!sid){ sid=Math.random().toString(36).slice(2)+Date.now().toString(36); sessionStorage.setItem('tb_sid',sid);} }catch(e){ sid='na'; }

  function post(table,body){
    if(owner) return Promise.resolve();
    return fetch(SB_URL+'/rest/v1/'+table,{method:'POST',headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(body),keepalive:true}).catch(function(){});
  }
  var ref=''; try{ ref=document.referrer||''; }catch(e){}
  function ev(name,label){
    var u={}; for(var k in utm) u[k]=utm[k];
    if(ref) u.referrer=ref.slice(0,200);
    post('tb_events',{event:name,label:label||null,camp:camp,utm:u,page:location.pathname,session_id:sid,user_agent:navigator.userAgent.slice(0,200)});
  }
  function yen(n){ return Math.round(n).toLocaleString('ja-JP')+'円'; }
  function man(n){
    var m=n/10000;
    return (Math.abs(m-Math.round(m))<0.005 ? Math.round(m) : m.toFixed(1))+'万円';
  }

  var SIZES={
    S:{w:1000,sqm:0.70,thin:79, mix:43, price:480000, fit:'51〜100戸・小さな店舗', members:60},
    M:{w:1500,sqm:1.05,thin:128,mix:68, price:780000, fit:'101〜200戸',            members:150},
    L:{w:2000,sqm:1.40,thin:173,mix:93, price:1280000,fit:'201戸以上・商業施設・駅',members:300}
  };
  var OPTS={
    device:{name:'解錠デバイス（必ずセット）',price:40000,req:true},
    install:{name:'組立＋送料',price:175000,req:true},
    divider:{name:'仕切り板セット（5cm間隔・棚1段ぶん）',price:8000},
    shelf:{name:'追加の棚板',price:6000},
    wrap:{name:'物件名・ロゴのラッピング',price:50000},
    joint:{name:'連結金具（横に並べて固定）',price:15000}
  };
  var MONTHLY=15000;

  function initLeadForm(formId,thanksId,btnId,extra){
    var form=document.getElementById(formId); if(!form) return;
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var btn=document.getElementById(btnId); btn.disabled=true; btn.textContent='送信中…';
      var fd=new FormData(form); var body={};
      fd.forEach(function(v,k){ body[k]=String(v); });
      if(typeof extra==='function'){ var x=extra()||{}; for(var k in x) body[k]=x[k]; }
      body.camp=camp; body.utm=utm; body.page=location.pathname; body.user_agent=navigator.userAgent.slice(0,200);
      post('tb_leads',body).then(function(){
        ev('form_submit',(body.size_interest||'')+'/'+(body.property_type||''));
        form.hidden=true; document.getElementById(thanksId).hidden=false;
        window.scrollTo({top:document.getElementById(thanksId).offsetTop-80,behavior:'smooth'});
      });
    });
  }

  window.TB={SIZES:SIZES,OPTS:OPTS,MONTHLY:MONTHLY,yen:yen,man:man,ev:ev,post:post,initLeadForm:initLeadForm};
  ev('page_view');
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('[data-ev]');
    if(el) ev(el.getAttribute('data-ev'), (el.textContent||'').trim().slice(0,60));
  });
})();
