const https = require('https');

https.get('https://github.com/neoforged/ModTemplate/archive/refs/heads/1.21.x.zip', (res) => {
    console.log('1.21.x:', res.statusCode);
});

https.get('https://github.com/neoforged/ModTemplate/archive/refs/heads/1.21.zip', (res) => {
    console.log('1.21:', res.statusCode);
});

https.get('https://github.com/neoforged/ModTemplate/archive/refs/heads/1.21.1.zip', (res) => {
    console.log('1.21.1:', res.statusCode);
});

https.get('https://github.com/neoforged/ModTemplate/archive/refs/heads/main.zip', (res) => {
    console.log('main:', res.statusCode);
});
