// Número de WhatsApp del organizador, en formato internacional para México.
const WHATSAPP_ORGANIZADOR = '525518335506';
const params = new URLSearchParams(location.search);
const label = document.getElementById('familyName');
const familyFromUrl = params.get('familia');
if (familyFromUrl) label.value = familyFromUrl.slice(0,80);
let counts = { adults:2, children:0 };
function updateCounts(){
  document.getElementById('adults').textContent=counts.adults;
  document.getElementById('children').textContent=counts.children;
  document.getElementById('slots').textContent=(counts.adults+counts.children)+' personas seleccionadas';
}
function step(kind,delta){
  counts[kind] = Math.max(0,Math.min(30,counts[kind]+delta));
  updateCounts();
}
function togglePeople(){
  const yes = document.querySelector('input[name="attendance"]:checked').value==='yes';
  document.getElementById('people').hidden=!yes;
}
function sendWhatsApp(event){
  event.preventDefault();
  const family=label.value.trim();
  if(!family){ label.reportValidity(); return false; }
  const yes=document.querySelector('input[name="attendance"]:checked').value==='yes';
  if(yes && counts.adults+counts.children<1){
    document.getElementById('whatsAppHelp').textContent='Selecciona por lo menos una persona.';
    return false;
  }
  const message=yes
    ? `¡Hola! Somos ${family}. Confirmamos nuestra asistencia a los 3 años de Melani. Iremos ${counts.adults} adulto(s) y ${counts.children} niño(s), ${counts.adults+counts.children} persona(s) en total. ¡Gracias por invitarnos!`
    : `¡Hola! Somos ${family}. Muchas gracias por invitarnos a los 3 años de Melani. Lamentablemente no podremos acompañarlos. ¡Le mandamos un abrazo a Mel!`;
  const recipient=WHATSAPP_ORGANIZADOR.replace(/\D/g,'');
  const url= recipient ? `https://wa.me/${recipient}?text=${encodeURIComponent(message)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  document.getElementById('whatsAppHelp').textContent=recipient?'Se abrirá WhatsApp. Recuerda pulsar Enviar para completar tu confirmación.':'Se abrirá WhatsApp; elige al organizador como destinatario y pulsa Enviar.';
  // Fallback accesible si el visor bloquea la navegación externa.
  const fallback=document.getElementById('whatsAppFallback');
  fallback.href=url;
  fallback.hidden=false;
  // Navegación directa desde el gesto del usuario; evita bloqueadores de popups.
  window.open(url, '_blank', 'noopener,noreferrer');;
  return false;
}
updateCounts();

// Fecha del evento en Celaya, Guanajuato (UTC-06:00 en enero).
(function () {
  const target = new Date('2027-01-23T14:30:00-06:00').getTime();
  const days = document.getElementById('countDays');
  const hours = document.getElementById('countHours');
  const minutes = document.getElementById('countMinutes');
  const status = document.getElementById('countStatus');
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const totalMinutes = Math.floor(diff / 60000);
    days.textContent = Math.floor(totalMinutes / 1440);
    hours.textContent = String(Math.floor(totalMinutes % 1440 / 60)).padStart(2,'0');
    minutes.textContent = String(totalMinutes % 60).padStart(2,'0');
    if (diff === 0) status.textContent = '¡Llegó el gran día de Mel!';
  }
  tick();
  setInterval(tick, 30000);
})();

// La barra aparece una vez que el hero ha dejado de ser protagonista.
(function(){
  const nav=document.getElementById('floatingActions');
  const hero=document.getElementById('inicio');
  if(!nav||!hero)return;
  let keyboardOpen=false;
  function update(){
    const away=hero.getBoundingClientRect().bottom<Math.min(window.innerHeight*0.85,650);
    const visible=away&&!keyboardOpen;
    nav.classList.toggle('is-visible',visible);
    nav.inert=!visible;
  }
  document.addEventListener('focusin',e=>{
    if(e.target.matches('input,textarea,select')){keyboardOpen=true;update();}
  });
  document.addEventListener('focusout',e=>{
    if(e.target.matches('input,textarea,select')){keyboardOpen=false;requestAnimationFrame(update);}
  });
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  update();
})();
