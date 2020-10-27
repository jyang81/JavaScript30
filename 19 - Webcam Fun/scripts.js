const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const rgb = document.querySelector('.rgb');

let filter = "";

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(MediaStream => {
        // console.log(MediaStream);
        // video.src = window.URL.createObjectURL(localMediaStream); // DEPRECATED!!
        video.srcObject = MediaStream;
        video.play();
    })
    .catch(err => {
        console.error("Webcam access denied. Please change browser camera settings.", err);
        alert("Please allow access to webcam.")
    })
};

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
 
        ctx.globalAlpha = 1;
        rgb.style.display = 'none';

        if (filter === 'red') pixels = redEffect(pixels);
        else if (filter === 'green') pixels = greenEffect(pixels);
        else if (filter === 'blue') pixels = blueEffect(pixels);
        else if (filter === 'rgb') {
            pixels = rgbSplit(pixels);
            ctx.globalAlpha = 0.1; // Ghosting effect
        }
        else if (filter === 'greenScreen') {
            pixels = greenScreen(pixels);
            rgb.style.display = 'block'
        }
        else {
            pixels = pixels;
        }

        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a')
    link.href = data;
    link.setAttribute('download', 'random')
    link.innerHTML = `<img src="${data}" alt="Random pic" />`;
    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // Red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
}

function greenEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] - 500; // Red
        pixels.data[i + 1] = pixels.data[i + 1] + 50; // Green
        pixels.data[i + 2] = pixels.data[i + 2] - 500; // Blue
    }
    return pixels;
}

function blueEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] - 500; // Red
        pixels.data[i + 1] = pixels.data[i + 1] * 0.5; // Green
        pixels.data[i + 2] = pixels.data[i + 2] + 50; // Blue
    }
    return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // Red
    pixels.data[i + 100] = pixels.data[i + 1]; // Green
    pixels.data[i - 150] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll(".rgb input").forEach((input) => {
      levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];

      if (
        red >= levels.rmin &&
        green >= levels.gmin &&
        blue >= levels.bmin &&
        red <= levels.rmax &&
        green <= levels.gmax &&
        blue <= levels.bmax
      ) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }

    return pixels;
}

function setFilter(currentFilter) {
    filter = currentFilter;
}


getVideo();

video.addEventListener('canplay', paintToCanvas)


