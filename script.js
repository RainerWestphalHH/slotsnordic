// Funktion zum Abrufen der Leaderboard-Daten von Ihrem eigenen Backend
async function fetchLeaderboardData() {
    try {
        // --- VORÜBERGEHEND AUSKOMMENTIERT ---
        // Die echte Abfrage funktioniert nur mit einem echten Server.
        /*
        const response = await fetch('/api/leaderbord');
        if (!response.ok) {
            throw new Error(`Server-Fehler: ${response.statusText} (${response.status})`);
        }
        const data = await response.json();
        if (data && data.summarizedBets && Array.isArray(data.summarizedBets)) {
            renderLeaderboard(data.summarizedBets);
        } else {
            renderError('Unerwartetes API-Format.');
        }
        */

        // --- HINZUGEFÜGT: BEISPIELDATEN ZUM TESTEN ---
        // Erstelle hier deine eigenen Testdaten.
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
        // --- ENDE DER BEISPIELDATEN ---

    } catch (error) {
        console.error('Fehler beim Abrufen der Leaderboard-Daten:', error);
        // Zeigt einen Fehler an, falls die Beispieldaten nicht funktionieren
        renderError("Konnte keine Beispieldaten laden.");
    }
}
