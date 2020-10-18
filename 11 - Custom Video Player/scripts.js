// ==== Get elements ====

const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const fullscreenButton = player.querySelector(".fullscreen");

// ==== Build out functions ====

function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function updateButton() {
    const icon = this.paused ? "►" : "❚ ❚";
    toggle.textContent = icon;
    // console.log(icon)
}

function skip() {
    // console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

// **** BONUS ****

function makeFullScreen() {
    video.requestFullscreen()
}

function keyboardShortcuts(e) {
    if (e.keyCode === 32) {
        togglePlay();
    }
    if (e.keyCode === 37) {
        video.currentTime -= 10;
    }
    if (e.keyCode === 39) {
        video.currentTime += 10;
    }
}

// ==== Hook up event listeners ====

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
// listens for time update, and updates the progress bar
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip))

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate))

let mousedown = false;
progress.addEventListener('click', scrub)
progress.addEventListener('mousemove', (e) => mousedown && scrub(e))
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// **** BONUS ****

// Added fullscreen button
fullscreenButton.addEventListener('click', makeFullScreen)

// Added spacebar play/pause functionality, L/R arrow to skip -/+10 sec
window.addEventListener('keydown', keyboardShortcuts)
