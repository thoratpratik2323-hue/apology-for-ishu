const heartContainer = document.getElementById('heart-container');
const musicToggle = document.getElementById('music-toggle');
const musicText = document.getElementById('music-text');

// YouTube Music Integration
let player;
let isPlaying = false;

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const videoId = '1bXy_3Kq6A8'; // Official 'Ishq Wala Love' - More embed friendly

const entryOverlay = document.getElementById('entry-overlay');
const startBtn = document.getElementById('start-btn');

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': videoId,
            'controls': 0,
            'mute': 0,
            'playsinline': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerError(e) {
    console.error("YouTube Player Error:", e);
    // Try to restart if error
    if (e.data === 150 || e.data === 101) {
        console.log("Video not embeddable? Trying fallback...");
    }
}

function onPlayerReady(event) {
    console.log("Music Player Ready");
    event.target.unMute();
    event.target.setVolume(100);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicText.textContent = "Pause Music";
        entryOverlay.classList.add('fade-out'); // Auto-fade if it managed to autoplay
    }
}

// Start everything when she clicks OR touches anywhere
const handleInteraction = () => {
    if (!isPlaying && player && player.playVideo) {
        startMusic();
        entryOverlay.classList.add('fade-out');
    }
};

startBtn.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction, { once: true });
document.addEventListener('mousedown', handleInteraction, { once: true });

function startMusic() {
    player.unMute();
    player.setVolume(100);
    player.playVideo();
    musicToggle.classList.add('playing');
    musicText.textContent = "Pause Music";
    isPlaying = true;
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent main document click from firing
    if (!isPlaying) {
        startMusic();
    } else {
        player.pauseVideo();
        musicToggle.classList.remove('playing');
        musicText.textContent = "Play Music";
        isPlaying = false;
    }
});

const slider = document.getElementById('forgive-slider');
const emoji = document.getElementById('status-emoji');
const statusText = document.getElementById('status-text');
const showReasonsBtn = document.getElementById('show-reasons-btn');
const reasonsList = document.getElementById('reasons-list');
const finalMessage = document.getElementById('final-message');

// Forgiveness Meter Logic
slider.addEventListener('input', (e) => {
    if (!isPlaying) startMusic(); // Start music as soon as she starts sliding
    const val = e.target.value;

    if (val < 25) {
        emoji.textContent = '😡';
        statusText.textContent = 'Ishu is still thinking...';
        emoji.style.transform = 'scale(1)';
    } else if (val < 50) {
        emoji.textContent = '🤔';
        statusText.textContent = 'Okay, fine... listening...';
        emoji.style.transform = 'scale(1.1)';
    } else if (val < 75) {
        emoji.textContent = '😊';
        statusText.textContent = 'Almost forgiven Poku...';
        emoji.style.transform = 'scale(1.2)';
    } else if (val < 100) {
        emoji.textContent = '🥰';
        statusText.textContent = 'Maan gayi meri Ishu!';
        emoji.style.transform = 'scale(1.3)';
    } else {
        emoji.textContent = '❤️';
        statusText.textContent = 'Forgiven Forever! Love you!';
        emoji.style.transform = 'scale(1.5)';
        finalMessage.classList.remove('hidden');
        finalMessage.style.display = 'block';
        createExplosion();
    }
});

// Punishment Logic
function assignPunishment(type) {
    const text = document.getElementById('punishment-text');
    text.textContent = `Done! I accept: ${type}. 😅 I'll do it right now!`;
    text.classList.remove('hidden');

    // Auto-slide the meter a bit
    let currentVal = parseInt(slider.value);
    slider.value = Math.min(currentVal + 15, 100);
    slider.dispatchEvent(new Event('input'));
}

// Show Reasons Logic
showReasonsBtn.addEventListener('click', () => {
    reasonsList.classList.toggle('hidden');
    if (!reasonsList.classList.contains('hidden')) {
        showReasonsBtn.textContent = 'Hide these reasons';
    } else {
        showReasonsBtn.textContent = 'Click to see why I love you...';
    }
});

// Floating Hearts Animation
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heartContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

setInterval(createHeart, 300);

// Explosion effect when forgiven
function createExplosion() {
    for (let i = 0; i < 20; i++) {
        setTimeout(createHeart, i * 50);
    }
}
