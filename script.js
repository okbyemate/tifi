let current = 1;
let balloonInterval = null;
const loveAudio = new Audio('love.mp3');

function nextScreen() {
    document.getElementById("screen" + current).classList.remove("active");
    current++;
    if (current <= 4) document.getElementById("screen" + current).classList.add("active");
}

function openCard() {
    document.getElementById("cardFlip").classList.add("open");
    setTimeout(() => nextScreen(), 1200);
}

function startBalloons(fast = false) {
    if (balloonInterval) clearInterval(balloonInterval);
    const imgs = ["1.jpg", "2.jpg", "5.jpg"];
    balloonInterval = setInterval(() => {
        const wrap = document.createElement("div");
        wrap.className = "heart-balloon";
        wrap.style.left = (Math.random() < 0.5 ? Math.random()*20 : 50+Math.random()*50) + "vw";
        wrap.style.bottom = (-100 - Math.random()*50) + "px";

        const img = document.createElement("img");
        img.src = imgs[Math.floor(Math.random()*imgs.length)];
        const ribbon = document.createElement("div");
        ribbon.className = "ribbon";
        wrap.appendChild(img);
        wrap.appendChild(ribbon);
        document.body.appendChild(wrap);

        const duration = fast ? 4 + Math.random()*2 : 15;
        wrap.style.animation = `floatUp ${duration}s linear forwards`;
        setTimeout(() => wrap.remove(), duration*1000);
    }, fast ? 250 : 1300);
}

document.addEventListener("DOMContentLoaded", () => {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");

    if (!noBtn) return;

    // Initial placement
    const yesRect = yesBtn.getBoundingClientRect();
    let currentLeft = yesRect.right + 20;
    let currentTop = yesRect.top;
    noBtn.style.left = currentLeft + "px";
    noBtn.style.top = currentTop + "px";

    const speed = 0.3;
    const buffer = 120;

    document.addEventListener("mousemove", (e) => {
        const rect = noBtn.getBoundingClientRect();
        const dx = rect.left + rect.width/2 - e.clientX;
        const dy = rect.top + rect.height/2 - e.clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < buffer) {
            // play funny No sound
            // if (!noAudio.playing) {
            //     noAudio.currentTime = 0;
            //     noAudio.play().catch(err => console.log(err));
            //     noAudio.playing = true;
            //     setTimeout(() => noAudio.playing = false, 500);
            // }

            // move button away
            currentLeft += (dx/dist)*speed*(buffer-dist);
            currentTop  += (dy/dist)*speed*(buffer-dist);
            currentLeft = Math.max(10, Math.min(window.innerWidth - rect.width -10, currentLeft));
            currentTop = Math.max(10, Math.min(window.innerHeight - rect.height -10, currentTop));
            noBtn.style.left = currentLeft + "px";
            noBtn.style.top  = currentTop + "px";
        }
    });
});

function yesClicked() {
    // play audio
    loveAudio.currentTime = 0;
    loveAudio.play().catch(err => console.log("Audio play failed:", err));

    // hide No button
    const noBtn = document.getElementById("noBtn");
    if (noBtn) noBtn.style.display = "none";

    // show big heart
    const bigHeart = document.getElementById("bigHeart");
    bigHeart.classList.add("show");

    // start flying balloons
    startBalloons(true);

    // orbiting hearts
    const yesBtn = document.getElementById("yesBtn");
    for(let i=0;i<6;i++){
        const heart = document.createElement("div");
        heart.className = "orbit-heart";
        heart.innerText = "💖";
        document.body.appendChild(heart);

        const angle = (360/6)*i;
        const radius = 50 + Math.random()*30;
        heart.style.animation = `orbit 4s linear infinite ${i*0.2}s`;
        heart.style.transform = `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`;
    }

    // sparkles
    for(let i=0;i<50;i++){
        const s = document.createElement("div");
        s.className = "sparkle";
        s.style.left = Math.random()*100 + "vw";
        s.style.top = Math.random()*100 + "vh";
        s.style.animationDelay = Math.random()*5 + "s";
        document.body.appendChild(s);
    }
}
