document.addEventListener('DOMContentLoaded', function() {
    // Kick Video Player JS
    const kickVideoContainer = document.getElementById('kickVideoContainer');
    const openVideoButton = document.getElementById('openVideoButton');
    const closeVideoButton = document.getElementById('closeVideoButton');
    openVideoButton.addEventListener('click', function() { kickVideoContainer.classList.add('show'); openVideoButton.style.display = 'none'; });
    closeVideoButton.addEventListener('click', function() { kickVideoContainer.classList.remove('show'); openVideoButton.style.display = 'flex'; });

    const leaderboardList = document.getElementById('leaderboard-list');
    const countdownEl = document.getElementById('countdown-timer');

    // Funktion zum Kürzen der Namen
    function truncateName(name) {
        if (name.length > 7) {
            return name.substring(0, 3) + '***';
        }
        return name;
    }

    // Funktion zum Abrufen der Leaderboard-Daten (mit Beispieldaten)
    async function fetchLeaderboardData() {
        try {
            // Beispieldaten zum Testen
            const mockData = [
                { user: { username: 'SuperSpieler123' }, wagered: 98550 },
                { user: { username: 'Gewinner_Tom' }, wagered: 85230 },
                { user: { username: 'ZockerZack' }, wagered: 79800 },
                { user: { username: 'Franzi_furt' }, wagered: 65100 },
                { user: { username: 'MaxPower' }, wagered: 50450 },
                { user: { username: 'Lara_Lift' }, wagered: 45300 },
                { user: { username: 'Ben_Berlin' }, wagered: 32100 },
                { user: { username: 'UnbekannterUser' }, wagered: 28900 },
                { user: { username: 'SlotMaster' }, wagered: 21500 },
                { user: { username: 'CasinoKing' }, wagered: 15750 },
            ];
            renderLeaderboard(mockData);

        } catch (error) {
            console.error('Fehler beim Abrufen der Leaderboard-Daten:', error);
            renderError("Konnte keine Beispieldaten laden.");
        }
    }

    // Funktion zum Rendern des Leaderboards
    function renderLeaderboard(bets) {
        leaderboardList.innerHTML = '';

        if (bets.length === 0) {
            renderError('Keine Daten für diesen Zeitraum verfügbar.');
            return;
        }

        bets.sort((a, b) => (b.wagered || 0) - (a.wagered || 0));
        const topTen = bets.slice(0, 10);

        topTen.forEach((entry, index) => {
            const rank = index + 1;
            let topClass = '';
            let prizeText = '';

            // --- HIER WURDE DIE ÄNDERUNG VORGENOMMEN ---
            // Das '$' wurde durch 'XP' in den Preis-Definitionen ersetzt.
            if (rank === 1) { topClass = 'top-1'; prizeText = 'PRIZE 400 XP'; }
            else if (rank === 2) { topClass = 'top-2'; prizeText = 'PRIZE 300 XP'; }
            else if (rank === 3) { topClass = 'top-3'; prizeText = 'PRIZE 200 XP'; }
            else {
                const prizes = ['150 XP', '100 XP', '90 XP', '80 XP', '70 XP', '60 XP', '50 XP'];
                prizeText = prizes[index - 3] || '';
            }

            const displayName = truncateName(entry.user.username);
            const listItem = document.createElement('li');
            listItem.className = `leaderboard-item ${topClass}`;
            
            listItem.innerHTML = `
                <span class="rank">${rank}.</span>
                <span class="name">${displayName}</span>
                <span class="xp">${(entry.wagered / 100).toFixed(2)} XP</span>
                <span class="prize">${prizeText}</span>
            `;
            leaderboardList.appendChild(listItem);
        });
    }

    // Funktion zur Anzeige von Fehlern
    function renderError(message) {
         leaderboardList.innerHTML = `<li class="error-message">Fehler beim Laden: ${message}</li>`;
    }

    // Countdown-Timer JS
    function updateCountdown() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const timeLeft = lastDayOfMonth - now;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            countdownEl.textContent = "00:00:00:00";
            return;
        }
    
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
        countdownEl.textContent = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // Leaderboard beim Laden der Seite abrufen
    fetchLeaderboardData();
});
