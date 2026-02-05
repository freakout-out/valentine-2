(function(){
  // Elements
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const meme = document.getElementById('meme');
  const celebration = document.getElementById('celebration');

  // Meme pool (replace with your own images if desired)
  const memeUrls = [
    'https://placekitten.com/720/420',
    'https://placekitten.com/721/420',
    'https://placekitten.com/722/420',
    'https://cataas.com/cat/says/luv%20u?size=120'
  ];
  setInterval(() => {
    const idx = Math.floor(Math.random()*memeUrls.length);
    meme.src = memeUrls[idx];
  }, 6000);

  // NO button dodge logic
  let dodgeCount = 0;
  const dodgeMessages = [
    "Catch me if you can 😼",
    "I'm a shy floof 🐾",
    "This is my vibe, no hard feelings",
    "Typical cat energy: vanish",
    "Wait, did someone say treats?",
    "Swipe left? More like purr left 😺",
    "No is a mood... a moving one"
  ];

  function viewportSize() {
    return {
      w: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
  }

  function randomPositionFor(element) {
    const padding = 12;
    const {w: vw, h: vh} = viewportSize();
    const rect = element.getBoundingClientRect();
    const elW = rect.width;
    const elH = rect.height;

    const maxX = Math.max(0, vw - elW - padding);
    const maxY = Math.max(0, vh - elH - padding - 40);

    const x = Math.floor(Math.random() * maxX) + padding;
    const y = Math.floor(Math.random() * maxY) + padding + window.scrollY;

    return { x, y };
  }

  function showFloatingNote(x, y, text) {
    const el = document.createElement('div');
    el.className = 'floating-note';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    // fade & remove
    requestAnimationFrame(()=> {
      el.style.transition = 'transform .6s ease, opacity .6s ease';
      setTimeout(()=> { el.style.opacity = '0'; el.style.transform = 'translate(-50%,-70%) scale(.98)'; }, 1100);
      setTimeout(()=> el.remove(), 1700);
    });
  }

  function moveNoBtn() {
    dodgeCount++;
    const { x, y } = randomPositionFor(noBtn);
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    // show message above the button
    const msg = dodgeMessages[dodgeCount % dodgeMessages.length];
    showFloatingNote(x + (noBtn.offsetWidth/2), y - 28, msg);
  }

  // Differentiate touch vs pointer coordinates
  function getEventClient(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) || 0,
             y: e.clientY || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY) || 0 };
  }

  // spawn small fleeing cats
  function spawnFleeingCat(x, y){
    const c = document.createElement('img');
    const size = 56 + Math.floor(Math.random()*36);
    c.src = `https://placekitten.com/${size}/${size}`;
    c.style.width = '56px';
    c.style.height = '56px';
    c.style.position = 'fixed';
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.transform = 'translate(-50%,-50%) rotate(0deg)';
    c.style.borderRadius = '10px';
    c.style.zIndex = 9999;
    c.style.transition = 'transform 900ms cubic-bezier(.2,.9,.2,1), opacity 1100ms ease-out';
    document.body.appendChild(c);

    setTimeout(()=>{
      const dx = (Math.random()*800 - 400);
      const dy = -200 - Math.random()*200;
      c.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random()*60-30)}deg)`;
      c.style.opacity = '0';
    }, 50);

    setTimeout(()=> c.remove(), 1200);
  }

  // NO interactions
  noBtn.addEventListener('mouseenter', moveNoBtn);
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoBtn(); }, {passive:false});
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const coords = getEventClient(e);
    for (let i=0;i<8;i++){
      spawnFleeingCat(coords.x + (Math.random()*80-40), coords.y + (Math.random()*80-40));
    }
    moveNoBtn();
  });

  // YES: hearts + sweet message
  yesBtn.addEventListener('click', () => {
    showSweetMessage();
    for (let i=0;i<18;i++){
      spawnHeart(window.innerWidth * Math.random(), window.innerHeight * Math.random() * 0.9);
    }
  });

  function spawnHeart(x,y){
    const h = document.createElement('div');
    h.className = 'heart';
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    h.style.opacity = 1;
    h.style.zIndex = 9999;
    celebration.appendChild(h);
    setTimeout(()=> h.remove(), 1700);
  }

  function showSweetMessage(){
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'linear-gradient(180deg, rgba(255,200,230,0.2), rgba(255,230,240,0.12))';
    overlay.style.zIndex = 10000;
    overlay.style.backdropFilter = 'blur(4px)';

    const box = document.createElement('div');
    box.style.background = 'white';
    box.style.padding = '22px';
    box.style.borderRadius = '16px';
    box.style.boxShadow = '0 22px 60px rgba(177,0,107,0.12)';
    box.style.textAlign = 'center';
    box.style.maxWidth = '90%';

    const heading = document.createElement('h2');
    heading.textContent = "Yay! You're my favourite notification ❤️";
    heading.style.margin = '0 0 8px';
    heading.style.fontFamily = "'Lobster', 'Poppins', cursive";
    heading.style.color = '#b1006b';

    const p = document.createElement('p');
    p.textContent = "Let's make this TikTok duet legendary — IRL edition. 🍿🐾";
    p.style.margin = '0 0 12px';

    const ok = document.createElement('button');
    ok.textContent = 'Best yes ever 😻';
    ok.style.padding = '10px 16px';
    ok.style.borderRadius = '10px';
    ok.style.border = '0';
    ok.style.background = 'linear-gradient(90deg,#ff5c9e,#ff8fc0)';
    ok.style.color = 'white';
    ok.style.fontWeight = '700';
    ok.style.cursor = 'pointer';
    ok.addEventListener('click', ()=> overlay.remove());

    box.appendChild(heading);
    box.appendChild(p);
    box.appendChild(ok);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  // keyboard nudge for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      moveNoBtn();
    }
  });

  // ensure noBtn starts centered on smaller screens
  window.addEventListener('load', () => {
    // place noBtn near right of yesBtn initially if space
    const rect = yesBtn.getBoundingClientRect();
    noBtn.style.position = 'relative';
  });
})();