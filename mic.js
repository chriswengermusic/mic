// Hello world for HTML5 mic input.  Based on code from:
// https://github.com/cwilso/pitchdetect
// https://github.com/mdn/voice-change-o-matic

// Works on chrome (chromium 42 on debian) if run from a (local)
// web server.  Doesn't work as file:///...

// Works for a little while on firefox (iceweasel 31 on debian)
// but then mic input seems to drift to a stable position and
// just stay there.

// Not sure how much of this I should include.  For now just
// enough to make it work on chrome 42 and firefox 31...
// window.AudioContext = window.AudioContext ||
//         window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia; // ||
//         navigator.msGetUserMedia;
// navigator.requestAnimationFrame = 
//         navigator.requestAnimationFrame ||
//         navigator.webkitRequestAnimationFrame ||
//         navigator.mozRequestAnimationFrame;

var FFT_SIZE = 64;
var audioContext = null;
var analyser = null;
var buffer = null;
var out, bufferLength;

window.onload = function() {
    audioContext = new AudioContext();
    out = document.getElementById("out");
    navigator.getUserMedia({ "audio" : true}, successCallback,
            errorCallback);
};

var successCallback = function(stream) {
    var source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    bufferLength = analyser.frequencyBinCount;
    buffer = new Uint8Array(bufferLength);
    source.connect(analyser);
    outputAnimation();
};

var errorCallback = function(errorCode) {
    console.log("Error (errorCallback): " + errorCode);
};

// Draw frequency histogram (vertically, as lines with dashes).
var outputAnimation = function() {
    analyser.getByteFrequencyData(buffer);
    out.innerHTML = "";
    
    for (var i = 0; i < bufferLength; i++) {
        var s = "";
        
        for (var j = 0; j < buffer[i] / 4; j++)
            s += "-";
        
        out.innerHTML += s + "<br />";
    }
    
    window.requestAnimationFrame(outputAnimation);
};
