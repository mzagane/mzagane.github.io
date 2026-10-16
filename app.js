'use strict';
document.body.classList.add('js-ready');
const menu=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
menu.hidden=false;
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu()});
const rows=[...document.querySelectorAll('.publication')];
const search=document.querySelector('#publication-search');
const year=document.querySelector('#publication-year');
const more=document.querySelector('#show-publications');
const count=document.querySelector('#result-count');
let type='All',expanded=false;
document.querySelector('.publication-controls').hidden=false;count.hidden=false;
function filterPublications(){
 const query=search.value.toLocaleLowerCase().trim();
 const matches=rows.filter(row=>(type==='All'||row.dataset.type===type)&&(year.value==='All'||row.dataset.year===year.value)&&row.textContent.toLocaleLowerCase().includes(query));
 const filtering=query||type!=='All'||year.value!=='All';
 const shown=expanded||filtering?matches:matches.slice(0,4);
 rows.forEach(row=>row.hidden=!shown.includes(row));
 count.textContent=`Showing ${shown.length} of ${matches.length} publications`;
 document.querySelector('#no-results').hidden=matches.length!==0;
 more.hidden=Boolean(filtering)||matches.length<=4;
 more.innerHTML=expanded?'Show fewer publications <span aria-hidden="true">↑</span>':`Show all ${matches.length} publications <span aria-hidden="true">↓</span>`;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{type=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});filterPublications()}));
search.addEventListener('input',filterPublications);year.addEventListener('change',filterPublications);more.addEventListener('click',()=>{expanded=!expanded;filterPublications();if(!expanded)document.querySelector('#publications').scrollIntoView({block:'start'})});filterPublications();
document.querySelector('.course-filters').hidden=false;
document.querySelectorAll('[data-level-filter]').forEach(button=>button.addEventListener('click',()=>{const level=button.dataset.levelFilter;document.querySelectorAll('[data-level-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelectorAll('.course').forEach(row=>row.hidden=level!=='All'&&row.dataset.level!==level)}));
document.querySelectorAll('[data-cite]').forEach(button=>button.hidden=false);
const dialog=document.querySelector('#citation-dialog');
const citation=document.querySelector('#citation-text');
const citationStatus=document.querySelector('#citation-status');
const bibEscape=value=>String(value).replace(/[{}]/g,'').replace(/&/g,'\\&');
document.querySelectorAll('[data-cite]').forEach(button=>button.addEventListener('click',()=>{const p=window.PUBLICATIONS[Number(button.dataset.cite)];const fields=[`  title = {${bibEscape(p.title)}}`,`  author = {${bibEscape(p.authors.split(', ').join(' and '))}}`,`  year = {${p.year}}`, `  ${p.type==='Conference'?'booktitle':'journal'} = {${bibEscape(p.venue.split(' · ')[0])}}`,p.doi?`  doi = {${p.doi}}`:`  url = {${p.url}}`];citation.textContent=`@${p.type==='Conference'?'inproceedings':'article'}{zagane${p.year}_${Number(button.dataset.cite)+1},\n${fields.join(',\n')}\n}`;citationStatus.textContent='';dialog.showModal()}));
document.querySelector('#close-citation').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
async function copyText(text,status){try{if(!navigator.clipboard)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(text);status.textContent='Copied to clipboard.'}catch{status.textContent='Please select and copy the text manually.'}}
document.querySelector('#copy-citation').addEventListener('click',()=>copyText(citation.textContent,citationStatus));
const emailButton=document.querySelector('.copy-email');emailButton.hidden=false;emailButton.addEventListener('click',()=>copyText(emailButton.dataset.email,document.querySelector('#copy-status')));
document.querySelector('#current-year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window){
 const sections=document.querySelectorAll('main section[id]');
 const activeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}),{rootMargin:'-15% 0px -65% 0px'});sections.forEach(section=>activeObserver.observe(section));
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal');revealObserver.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.section-heading,.research-card,.project,.news-item').forEach(el=>revealObserver.observe(el))}
}

