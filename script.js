document.addEventListener('DOMContentLoaded', function() {
    // Kick Video Player JS
    const kickVideoContainer = document.getElementById('kickVideoContainer');
    const openVideoButton = document.getElementById('openVideoButton');
    const closeVideoButton = document.getElementById('closeVideoButton');
    openVideoButton.addEventListener('click', function() { kickVideoContainer.classList.add('show'); openVideoButton.style.display = 'none'; });
    closeVideoButton.addEventListener('click', function() { kickVideoContainer.classList.remove('show'); openVideoButton.style.display = 'flex'; });

    const leaderboardList = document.getElementById('leaderboard-list');
    const countdownEl = document.getElementById('countdown-timer');

    // NEUE FUNKTION ZUM KÜRZEN DER NAMEN
    function truncateName(name) {
        if (name.length > 5) {
            return name.substring(0, 3) + '***';
        }
        return name;
    }

    // Funktion zum Abrufen der Leaderboard-Daten von Ihrem eigenen Backend
    async function fetchLeaderboardData() {
        try {
            const response = await fetch('/api/leaderboard');

            if (!response.ok) {
                throw new Error(`Server-Fehler: ${response.statusText} (${response.status})`);
            }

            const data = await response.json();
            
            if (data && data.summarizedBets && Array.isArray(data.summarizedBets)) {
                renderLeaderboard(data.summarizedBets);
            } else {
                renderError('Unerwartetes API-Format.');
            }

        } catch (error) {
            console.error('Fehler beim Abrufen der Leaderboard-Daten:', error);
            renderError(error.message);
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

            if (rank === 1) { topClass = 'top-1'; prizeText = 'PRIZE $400'; }
            else if (rank === 2) { topClass = 'top-2'; prizeText = 'PRIZE $300'; }
            else if (rank === 3) { topClass = 'top-3'; prizeText = 'PRIZE $200'; }
            else {
                const prizes = ['$150', '$100', '$90', '$80', '$70', '$60', '$50'];
                prizeText = prizes[index - 3] || '';
            }

            // HIER WIRD DER NAME GEKÜRZT
            const displayName = truncateName(entry.user.username);

            const listItem = document.createElement('li');
            listItem.className = `leaderboard-item ${topClass}`;
            listItem.innerHTML = `
                <span class="rank">${rank}.</span>
                <span class="name">${displayName}</span>
                <span class="xp">$${(entry.wagered / 100).toFixed(2)}</span>
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
