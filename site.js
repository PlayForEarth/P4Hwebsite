// Shared nav: background on scroll, mobile menu (same behaviour as the home page).
const nav=document.getElementById('mainNav');
if(nav)window.addEventListener('scroll',()=>{
  nav.style.background=window.scrollY>60?'rgba(247,248,252,0.98)':'rgba(247,248,252,0.94)';
});
const h=document.getElementById('hamburger'),m=document.getElementById('mobileMenu');
if(h&&m){
  h.addEventListener('click',()=>{const o=h.classList.toggle('open');m.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';});
  m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{h.classList.remove('open');m.classList.remove('open');document.body.style.overflow='';}));
}

// Analytics consent (Google Consent Mode v2). Everything is denied by default and
// the GA script is only loaded after Accept. Inside an iframe (the demo on the
// home page) neither GA nor the banner runs.
(()=>{
  if(window.self!==window.top)return;
  const GA_ID='G-7JM995K277',KEY='p4h-cookie-consent',MAX_AGE=365*24*60*60*1000;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){dataLayer.push(arguments);};
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});

  let loaded=false,banner=null;
  function loadGA(){
    if(loaded)return;
    loaded=true;
    gtag('js',new Date());
    gtag('config',GA_ID);
    const s=document.createElement('script');
    s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(s);
  }
  function read(){
    try{
      const c=JSON.parse(localStorage.getItem(KEY));
      if(c&&(c.choice==='granted'||c.choice==='denied')&&Date.now()-c.time<MAX_AGE)return c.choice;
    }catch(e){}
    return null;
  }
  function save(choice){
    try{localStorage.setItem(KEY,JSON.stringify({choice,time:Date.now()}));}catch(e){}
  }
  // After a change of mind, remove the GA cookies on this host and its parent domains.
  function clearGACookies(){
    const parts=location.hostname.split('.'),domains=[''];
    for(let i=0;i<parts.length-1;i++)domains.push('.'+parts.slice(i).join('.'));
    document.cookie.split(';').map(c=>c.split('=')[0].trim()).filter(n=>n==='_ga'||n.startsWith('_ga_')).forEach(n=>
      domains.forEach(d=>{document.cookie=n+'=; Max-Age=0; path=/'+(d?'; domain='+d:'');}));
  }
  function apply(choice){
    if(choice==='granted'){gtag('consent','update',{analytics_storage:'granted'});loadGA();}
    else{gtag('consent','update',{analytics_storage:'denied'});clearGACookies();}
  }
  function pad(){if(banner&&!banner.hidden)document.body.style.paddingBottom=banner.offsetHeight+'px';}
  function show(){
    if(!banner){
      banner=document.createElement('div');
      banner.className='cookie-banner';
      banner.setAttribute('role','region');
      banner.setAttribute('aria-label','Cookie choice');
      banner.innerHTML='<p>We use Google Analytics cookies to understand how the site is used. You can accept or decline. <a href="/privacy#cookies">Privacy</a></p>'
        +'<div class="cookie-actions"><button type="button" class="btn-outline" data-choice="granted">Accept</button><button type="button" class="btn-outline" data-choice="denied">Decline</button></div>';
      banner.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.choice)));
      document.body.appendChild(banner);
      window.addEventListener('resize',pad);
    }
    banner.hidden=false;
    pad();
  }
  function choose(choice){
    save(choice);apply(choice);
    banner.hidden=true;document.body.style.paddingBottom='';
  }

  const stored=read();
  if(stored)apply(stored);else show();
  document.querySelectorAll('.cookie-settings').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show();}));
})();
