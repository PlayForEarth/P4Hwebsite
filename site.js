// Shared nav: background on scroll, mobile menu (same behaviour as the home page).
window.addEventListener('scroll',()=>{
  document.getElementById('mainNav').style.background=window.scrollY>60?'rgba(247,248,252,0.98)':'rgba(247,248,252,0.94)';
});
const h=document.getElementById('hamburger'),m=document.getElementById('mobileMenu');
h.addEventListener('click',()=>{const o=h.classList.toggle('open');m.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';});
m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{h.classList.remove('open');m.classList.remove('open');document.body.style.overflow='';}));
