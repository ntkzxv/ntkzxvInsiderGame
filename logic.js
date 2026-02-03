let totalPlayers = 0;
let currentPlayer = 0;
let roles = [];
let gameWord = "";
let timerInterval;
let secondsLeft = 0;

window.onload = function() {
    const savedPlayers = localStorage.getItem('insider_players') || 4;
    const savedTime = localStorage.getItem('insider_time') || 5;
    document.getElementById('player-count').value = savedPlayers;
    document.getElementById('game-time').value = savedTime;
};

function startGame() {
    if (typeof insider_words === 'undefined') return alert("ไม่พบไฟล์คำศัพท์!");
    
    totalPlayers = parseInt(document.getElementById('player-count').value);
    const gameMinutes = parseInt(document.getElementById('game-time').value);

    if(totalPlayers < 4) return alert("ระบุผู้เล่น 4 คนขึ้นไป");
    
    localStorage.setItem('insider_players', totalPlayers);
    localStorage.setItem('insider_time', gameMinutes);

    secondsLeft = gameMinutes * 60;
    updateTimerDisplay();

    gameWord = insider_words[Math.floor(Math.random() * insider_words.length)];
    
    // สร้างบทบาท
    roles = new Array(totalPlayers).fill("Commoner");
    roles[0] = "Insider";
    roles[1] = "Master";
    roles.sort(() => Math.random() - 0.5);

    document.getElementById('setup-screen').classList.add('hidden');
    showTurnScreen();
}

function showRole() {
    const currentRole = roles[currentPlayer];
    const roleDisplay = document.getElementById('role-display');
    const wordDisplay = document.getElementById('word-display');

    // แปลชื่อบทบาทให้สวยงาม
    if (currentRole === "Insider") roleDisplay.innerText = "ผู้บงการ";
    else if (currentRole === "Master") roleDisplay.innerText = "ผู้รู้";
    else roleDisplay.innerText = "ชาวบ้าน";

    // Logic การแสดงคำศัพท์
    if (currentRole === "Insider" || currentRole === "Master") {
        wordDisplay.innerText = gameWord; // แสดงคำศัพท์จริง
    } else {
        wordDisplay.innerText = "???"; // ชาวบ้านจะเห็นเป็นเครื่องหมายคำถาม
    }

    document.getElementById('turn-screen').classList.add('hidden');
    document.getElementById('role-screen').classList.remove('hidden');
}

// ฟังก์ชันอื่นๆ (nextPlayer, showTurnScreen, updateTimerDisplay ฯลฯ) ให้คงไว้เหมือนเดิม
function nextPlayer() {
    currentPlayer++;
    showTurnScreen();
}

function showTurnScreen() {
    if (currentPlayer < totalPlayers) {
        document.getElementById('player-label').innerText = `ผู้เล่นคนที่ ${currentPlayer + 1}`;
        document.getElementById('turn-screen').classList.remove('hidden');
        document.getElementById('role-screen').classList.add('hidden');
    } else {
        showTimerScreen();
    }
}

function showTimerScreen() {
    document.getElementById('turn-screen').classList.add('hidden');
    document.getElementById('role-screen').classList.add('hidden');
    document.getElementById('timer-screen').classList.remove('hidden');
}

function updateTimerDisplay() {
    let mins = Math.floor(secondsLeft / 60);
    let secs = secondsLeft % 60;
    document.getElementById('timer-display').innerText = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerText = "เริ่มต่อ";
        btn.style.background = "var(--accent)";
    } else {
        btn.innerText = "หยุดชั่วคราว";
        btn.style.background = "var(--danger)";
        timerInterval = setInterval(() => {
            secondsLeft--;
            updateTimerDisplay();
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                alert("หมดเวลาแล้ว!");
            }
        }, 1000);
    }
}

function resetGame() {
    location.reload(); 
}