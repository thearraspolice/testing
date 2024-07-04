// Global Utilities Requires
let EventEmitter = require('events'),
    path = require('path'),
    fs = require('fs');
global.events = new EventEmitter();
global.ran = require(".././lib/random.js");
global.util = require(".././lib/util.js");
global.hshg = require(".././lib/hshg.js");
global.protocol = require(".././lib/fasttalk.js");

// Global Variables (These must come before we import from the modules folder.)
global.fps = "Unknown";
global.defeatedTeams = [];
global.controllableEntities = [];
global.minimap = [];
global.entities = [];
global.views = [];
global.chats = {};
global.entitiesToAvoid = [];
global.grid = new hshg.HSHG();
global.arenaClosed = false;
global.mockupsLoaded = false;

global.TEAM_BLUE = -1;
global.TEAM_GREEN = -2;
global.TEAM_RED = -3;
global.TEAM_PURPLE = -4;
global.TEAM_YELLOW = -5;
global.TEAM_ORANGE = -6;
global.TEAM_BROWN = -7;
global.TEAM_CYAN = -8;
global.TEAM_ROOM = -100;
global.TEAM_ENEMIES = -101;
global.getSpawnableArea = team => ran.choose((team in room.spawnable && room.spawnable[team].length) ? room.spawnable[team] : room.spawnableDefault).randomInside();
global.getTeamName = team => ["BLUE", "GREEN", "RED", "PURPLE", "YELLOW", "ORANGE", "BROWN", "CYAN"][-team - 1] || "An unknown team";
global.getTeamColor = team => ([10, 11, 12, 15, 25, 26, 27, 28][-team - 1] || 3) + " 0 1 0 false";
global.isPlayerTeam = team => /*team < 0 && */team > -9;
global.getWeakestTeam = () => {
    let teamcounts = {};
    for (let i = -c.TEAMS; i < 0; i++) {
        teamcounts[i] = 0;
    }
    for (let o of entities) {
        if ((o.isBot || o.isPlayer) && o.team in teamcounts && o.team < 0 && isPlayerTeam(o.team)) {
            if (!(o.team in teamcounts)) {
                teamcounts[o.team] = 0;
            }
            teamcounts[o.team]++;
        }
    }
    teamcounts = Object.entries(teamcounts);
    let lowestTeamCount = Math.min(...teamcounts.map(x => x[1])),
        entries = teamcounts.filter(a => a[1] == lowestTeamCount);
    return parseInt(!entries.length ? -Math.ceil(Math.random() * c.TEAMS) : ran.choose(entries)[0]);
};

global.Tile = class Tile {
    constructor (args) {
        this.args = args;
        if ("object" !== typeof this.args) {
            throw new Error("First argument has to be an object!");
        }

        this.color = args.color;
        this.data = args.data || {};
        if ("object" !== typeof this.data) {
            throw new Error("'data' property must be an object!");
        }
        this.init = args.init || (()=>{});
        if ("function" !== typeof this.init) {
            throw new Error("'init' property must be a function!");
        }
        this.tick = args.tick || (()=>{});
        if ("function" !== typeof this.tick) {
            throw new Error("'tick' property must be a function!");
        }
    }
}

global.tickIndex = 0;
global.tickEvents = [];
global.setSyncedTimeout = (callback, ticks = 0, ...args) => tickEvents.push(tickIndex + ticks, callback, args);
global.syncedDelaysLoop = () => {
    tickIndex += 1 / c.runSpeed;

    // theyre q and p because i thought it looked like a sad guy and i wanted to keep that
    // expecially (q - p)
    tickEvents.sort(([q], [p]) => q - p);
    //if an idiot pushes their own custom stuff into tickEvents its their own fault
    while (tickIndex > tickEvents[0]) {
        let tickEvent = tickEvents.shift();
        tickEvent[1](...tickEvent[2]);
    }
}

global.c = require("./setup/config.js");
global.c.port = process.env.PORT || c.port;

// Now that we've set up the global variables, we import all the modules, then put them into global varialbles and then export something just so this file is run.
const requires = [
    "./physics/relative.js", // Some basic physics functions that are used across the game.
    "./physics/collisionFunctions.js", // The actual collision functions that make the game work.
    "./live/entitySubFunctions.js", // Skill, HealthType and other functions related to entities are here.
    "./live/controllers.js", // The AI of the game.
    "./live/entity.js", // The actual Entity constructor.
    "./live/class.js", // Class dictionary.
    "./setup/room.js", // These are the basic room functions, set up by config.json
    "./network/sockets.js", // The networking that helps players interact with the game.
    "./network/webServer.js", // The networking that actually hosts the server.
    "./setup/mockups.js", // This file loads the mockups.
    "./debug/logs.js", // The logging pattern for the game. Useful for pinpointing lag.
    "./debug/speedLoop.js", // The speed check loop lmao.

    "./gamemodes/groups.js", // Duos/Trios/Squads
    "./gamemodes/gamemodeLoop.js", // The gamemode loop.
    "./gamemodes/tag.js", // Tag
    "./gamemodes/maze.js", // Maze
    "./gamemodes/closeArena.js", // Arena Closing mechanics
];

for (let file of requires) {
    const module = require(file);
    if (module.init) module.init(global);
    for (let key in module) {
        if (module.hasOwnProperty(key)) global[key] = module[key];
    }
}

global.loadedGamemodes = [];
global.Gamemode = class Gamemode {

    // should usually not spawn entities or change the game in any way
    // but it can prepare things like conditional flags like integer counters or empty arrays
    constructor () {
        this._activatedPrev = false;
        this.activated = false;
        global.loadedGamemodes.push(this);
    }
    
    // runs once when gamemode activated
    // should prepare required stuff for the gamemode
    init () {}
    
    // runs once every frame
    loop () {}
    
    // runs once when gamemode deactivated
    // should clean up everything done by init and loop
    stop () {}
}
global.gamemodeLoop = () => {
    for (let i = 0; i < loadedGamemodes.length; i++) {
        let gamemode = loadedGamemodes[i];
        if (gamemode.activated == gamemode._activatedPrev) {
            if (gamemode.activated) {
                gamemode.loop();
            }
        } else if (gamemode.activated) {
            gamemode.init();
        } else {
            gamemode.stop();
        }
        gamemode._activatedPrev = gamemode.activated;
    }
};

let gamemodes = fs.readdirSync(path.resolve(__dirname, './gamemodes'));

console.log(`Loading ${gamemodes.length} gamemodes...`);
for (let filename of gamemodes) {
    console.log(`Loading Gamemode: ${filename}`);
    let gamemode = new (require('./gamemodes/' + filename))();
    if (c.GAMEMODES_TO_LOAD.includes(filename.slice(0, -3))) {
        console.log(`Activated Gamemode: ${filename}`);
        gamemode.activated = true;
    }
}

module.exports = { creationDate: new Date() };