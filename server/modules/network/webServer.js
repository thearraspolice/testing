let server,
    wsServer = new (require('ws').WebSocketServer)({ noServer: true });

server = require('http').createServer((req, res) => {
    let resStr = "";

    switch (req.url) {
        case "/lib/json/mockups.json":
            resStr = mockupJsonData;
            break;
        case "/serverData.json":
            resStr = JSON.stringify({
                gameMode: Config.gameModeName,
                players: views.length,
                closed: arenaClosed,
                location: Config.LOCATION,
                hidden: Config.HIDDEN,
            });
            break;
    }

    if (req.url == '/serverData.json' || req.url == '/lib/json/mockups.json') {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.writeHead(200);
    res.end(resStr);
});

server.on('upgrade', (req, socket, head) => wsServer.handleUpgrade(req, socket, head, ws => sockets.connect(ws, req)));
server.listen(Config.port, Config.host, () => console.log("Server listening on port", Config.port));

module.exports = { server };
