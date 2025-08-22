// backend/server.js

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// SICHER: Der API-Schlüssel ist nur hier auf dem Server bekannt.
const API_KEY = '+IzAuLgXATRBlTxnFWdEHrZisLf0DWKc3E/OVXzYpXZSplDDtgFEDcKmlc9912xqsCAnJECuR7Wf7RwqCDE4Lt6XgvXIN6amuobI';
const HYPE_API_URL = 'https://wallet-api.hype.bet/api/v1/affiliate/creator/get-stats';

// --- START: CACHING-LOGIK ---
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten in Millisekunden
// --- ENDE: CACHING-LOGIK ---

// Stellt die index.html-Datei als Hauptseite bereit.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpunkt, den das Frontend aufruft.
app.get('/api/leaderboard', async (req, res) => {
    
    // --- START: CACHE-PRÜFUNG ---
    const nowForCache = new Date();
    if (cachedData && cacheTimestamp && (nowForCache.getTime() - cacheTimestamp.getTime() < CACHE_DURATION)) {
        console.log('Serving from cache...');
        return res.json(cachedData);
    }
    console.log('Fetching new data from API...');
    // --- ENDE: CACHE-PRÜFUNG ---

    // Berechnet den Zeitraum für die LETZTEN 21 TAGE ab heute.
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 21);

    const from_formatted = fromDate.toISOString().slice(0, 10);
    const to_formatted = toDate.toISOString().slice(0, 10);

    // Diese Zeile gibt das genaue Datum im Terminal aus, um es zu prüfen
    console.log(`Fetching data from ${from_formatted} to ${to_formatted}`);

    // KORREKTER Body für die Hype.bet API.
    const requestBody = {
        apiKey: API_KEY,
        from: from_formatted,
        to: to_formatted
    };

    try {
        const apiResponse = await fetch(HYPE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error(`Hype.bet API Error: ${apiResponse.status} - ${errorBody}`);
            throw new Error(`API-Fehler von Hype.bet: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        
        // --- START: VERBESSERTES CACHING ---
        // Nur cachen, wenn die Leaderboard-Liste (summarizedBets) Daten enthält.
        if (data && data.summarizedBets && data.summarizedBets.length > 0) {
            cachedData = data;
            cacheTimestamp = new Date();
            console.log('Data is valid and has been cached.');
        } else {
            console.log('API returned no leaderboard data. Response will not be cached.');
        }
        // --- ENDE: VERBESSERTES CACHING ---

        res.json(data);

    } catch (error) {
        console.error('Server-side fetch error:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Daten von der Hype.bet API.' });
    }
});

// Stellt andere statische Dateien bereit
app.use(express.static(__dirname));

// Serverstart
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});