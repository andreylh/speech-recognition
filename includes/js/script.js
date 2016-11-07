var audioContext;
var recorder;
var isRecording = false;
var API_KEY = "AIzaSyBmmqjUsStJat65IP7KgKuH2cz6rRvlIr8";
var SERVICE_URL = "https://speech.googleapis.com/v1beta1/speech:syncrecognize?key=" + API_KEY;

document.getElementById("recButton").onclick = function(e) {
    e.preventDefault();

    audioContext ? toggleRecord() : initContext();
}

function initContext() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    audioContext = new AudioContext();

    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        console.log(e);
    });
}

function startUserMedia(s) {
    var stream = audioContext.createMediaStreamSource(s);

    recorder = new Recorder(stream);

    toggleRecord();
}

function toggleRecord() {
    isRecording ? stopRecording() : startRecording();
}

function startRecording() {
    isRecording = true;
    recorder.clear();
    recorder.record();

    $('#recButton').removeClass('btn-success');
    $('#recButton').addClass('btn-danger');
    $('#recButton span').html("Parar Gravação");
    $('#micIcon').removeClass('fa-microphone');
    $('#micIcon').addClass('fa-microphone-slash');
}

function stopRecording() {
    isRecording = false;

    recorder.stop();

    recorder.exportWAV(function(a) {

        var f = new FileReader();

        f.onload = function(a) {
            a = a.target.result;
            console.log(btoa(a));
        };

        f.readAsBinaryString(a);

    });

    $('#recButton').removeClass('btn-danger');
    $('#recButton').addClass('btn-success');
    $('#recButton span').html("Iniciar Gravação");
    $('#micIcon').removeClass('fa-microphone-slash');
    $('#micIcon').addClass('fa-microphone');
}

function sendAudio(a, b, c, e) {
    a = JSON.stringify({
        config: {
            encoding: c,
            sampleRate: e,
            languageCode: b,
            maxAlternatives: 1
        },
        audio: {
            content: a
        }
    });
    var d = new XMLHttpRequest;
    d.onload = function(a) {
        200 <= d.status && 400 > d.status ? (a = JSON.parse(d.responseText),
        console.log(a) : console.log(a)
    };
    d.open("POST", this.SERVICE_URL, !0);
    d.send(a);
}