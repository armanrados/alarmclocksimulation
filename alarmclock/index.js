
// FIREBASE START
const firebaseConfig = {
    apiKey: "AIzaSyC6nFSpGQYiIzX4WonzpoB1ILOmC8-mz3E",
    authDomain: "alarm-clock-6f742.firebaseapp.com",
    databaseURL: "https://alarm-clock-6f742-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "alarm-clock-6f742",
    storageBucket: "alarm-clock-6f742.appspot.com",
    messagingSenderId: "959224363872",
    appId: "1:959224363872:web:bbba5b9d372bf8f6033c05"
  };

firebase.initializeApp(firebaseConfig);

let db = firebase.database().ref("datetime");


let time = document.getElementById("time");

db.on("value", (d) => {
    let data = d.val();
    alarmTime = data;
    time.value = data;
  });

const display = document.getElementById('clock');
const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
audio.loop = true;
let alarmTime = null;
let alarmTimeout = null;

function updateTime() {
    const date = new Date();

    const hour = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());

    display.innerText=`${hour} : ${minutes} : ${seconds}`
}

function formatTime(time) {
    if ( time < 10 ) {
        return '0' + time;
    }
    return time;
}

function setAlarmTime(value) {
    alarmTime = value;
}

function setAlarm() {
    if(alarmTime) {
        const current = new Date();
        const timeToAlarm = new Date(alarmTime);

        if (timeToAlarm > current) {

            db.set(timeToAlarm.toISOString().slice(0,16));

            const timeout = timeToAlarm.getTime() - current.getTime();
            alarmTimeout = setTimeout(() => audio.play(), timeout);
            alert('Alarm set');
        }
    } else {
        alert('Invalid value!');
    }
}

function clearAlarm() {
    audio.pause();
    if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        alert('Alarm cleared');
    }
}

setInterval(updateTime, 1000);

let listenBtn = document.getElementById('listen');


function runSpeechRecognition() {
    // new speech recognition object
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        listenBtn.innerHTML = "Listening..";
    };
    
    recognition.onspeechend = function() {
        listenBtn.innerHTML = `Listen <i class="fas fa-microphone"></i>`;
        recognition.stop();
    }
  
    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        if(transcript.includes('off')) {
            // turn alarm off
            clearAlarm();
        }
    };
  
     // start recognition
     recognition.start();
}