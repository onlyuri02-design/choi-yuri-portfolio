(function(){
 'use strict';
 function legacy(){
  var match=location.hash.match(/^#note\/([a-z0-9-]+)$/);
  if(match&&document.querySelector('a[href="/notes/'+match[1]+'"]'))location.replace('/notes/'+match[1]+location.search);
 }
 legacy();window.addEventListener('hashchange',legacy);
 document.querySelectorAll('[data-filter]').forEach(function(button){button.addEventListener('click',function(){
  document.querySelectorAll('[data-filter]').forEach(function(b){b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  var filter=button.dataset.filter;
  document.querySelectorAll('[data-topic]').forEach(function(card){card.hidden=filter!=='all'&&card.dataset.topic!==filter;});
  var count=document.querySelector('.count'),total=document.querySelectorAll('[data-topic]:not([hidden])').length;if(count)count.textContent=total+' '+(total===1?'NOTE':'NOTES');
  var label=document.querySelector('.section-label');if(label)label.hidden=filter==='travel';
 });});
})();
