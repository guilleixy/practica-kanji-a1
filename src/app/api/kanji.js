const fs = require('fs');

// Read the kanjis.json file
fs.readFile('kanjis.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading kanjis.json:', err);
        return;
    }

    // Parse the JSON data
    const kanjis = JSON.parse(data);

    // Get a random kanji
    const randomKanji = kanjis[Math.floor(Math.random() * kanjis.length)];

    console.log('Random kanji:', randomKanji);
});