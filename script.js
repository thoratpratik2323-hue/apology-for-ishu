const musicToggle = document.getElementById('music-toggle');
const musicText = document.getElementById('music-text');
const entryOverlay = document.getElementById('entry-overlay');
const startBtn = document.getElementById('start-btn');
const heartContainer = document.getElementById('heart-container');

// YouTube Music Integration
let player;
let isPlaying = false;
const videoId = 'yTqm9nLGByo'; // User's requested song

// Define the global function for YouTube API
window.onYouTubeIframeAPIReady = function () {
    console.log("YouTube API Ready, creating player...");
    player = new YT.Player('player', {
        height: '200',
        width: '200',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': videoId,
            'controls': 0,
            'mute': 0,
            'playsinline': 1,
            'enablejsapi': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
};

// Load YouTube API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onPlayerError(e) {
    console.error("YouTube Player Error:", e);
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
        entryOverlay.classList.add('fade-out');
    }
}

function startMusic() {
    if (player && player.playVideo) {
        player.unMute();
        player.setVolume(100);
        player.playVideo();
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicText.textContent = "Pause Music";
    }
}

// Interaction Listeners
const handleInteraction = () => {
    if (!isPlaying) {
        startMusic();
        entryOverlay.classList.add('fade-out');
    }
};

if (startBtn) startBtn.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction, { once: true });
document.addEventListener('mousedown', handleInteraction, { once: true });

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
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
if (slider) {
    slider.addEventListener('input', (e) => {
        if (!isPlaying) startMusic();

        // Hide hint once she starts sliding
        const hint = document.getElementById('slider-hint');
        if (hint) hint.style.display = 'none';

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

            // Reveal the Gift Button
            const giftBtn = document.getElementById('gift-btn');
            if (giftBtn) giftBtn.classList.remove('hidden');

            createExplosion();
        }
    });
}

// Video Modal Logic
const giftBtn = document.getElementById('gift-btn');
const modal = document.getElementById('video-modal');
const closeModal = document.querySelector('.close-modal');
const video = document.getElementById('jaanu-video');

if (giftBtn && modal) {
    giftBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        if (player && player.pauseVideo) {
            player.pauseVideo();
            player.mute(); // Double insurance
        }
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicText.textContent = "Play Music";

        video.currentTime = 0;
        video.play();
    });
}

// Extra safety: If the video starts playing for any reason, kill the background music
if (video) {
    video.addEventListener('play', () => {
        if (player && player.pauseVideo) {
            player.pauseVideo();
            player.mute();
        }
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicText.textContent = "Play Music";
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        video.pause();
        // Don't auto-resume to avoid jumpscare, let her click play if she wants
    });
}

// Close modal if clicking outside the video
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.classList.add('hidden');
        video.pause();
    }
});

function assignPunishment(type) {
    const text = document.getElementById('punishment-text');
    text.textContent = `Done! I accept: ${type}. 😅 I'll do it right now!`;
    text.classList.remove('hidden');
    let currentVal = parseInt(slider.value);
    slider.value = Math.min(currentVal + 15, 100);
    slider.dispatchEvent(new Event('input'));
}

function createHeart() {
    if (!heartContainer) return;
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}

setInterval(createHeart, 300);

function createExplosion() {
    for (let i = 0; i < 20; i++) {
        setTimeout(createHeart, i * 50);
    }
}
