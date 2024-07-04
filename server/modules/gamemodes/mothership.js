module.exports = class Mothership extends Gamemode {
    constructor () {
        super();
        this.choices = ['mothership'];
        this.motherships = [];
        this.aliveNow = 0;
        this.teamWon = false;
    }
    init () {
        let locs = [
            { x: c.WIDTH * 0.1, y: c.HEIGHT * 0.1 }, 
            { x: c.WIDTH * 0.9, y: c.HEIGHT * 0.9 }, 
            { x: c.WIDTH * 0.9, y: c.HEIGHT * 0.1 }, 
            { x: c.WIDTH * 0.1, y: c.HEIGHT * 0.9 }, 
            { x: c.WIDTH * 0.9, y: c.HEIGHT * 0.5 }, 
            { x: c.WIDTH * 0.1, y: c.HEIGHT * 0.5 }, 
            { x: c.WIDTH * 0.5, y: c.HEIGHT * 0.9 }, 
            { x: c.WIDTH * 0.5, y: c.HEIGHT * 0.1 }
        ].sort(() => 0.5 - Math.random());
        for (let i = 0; i < c.TEAMS; i++) {
            let o = new Entity(locs[i]),
                team = -i - 1;
            o.define(ran.choose(this.choices));
            o.define({ ACCEPTS_SCORE: false, VALUE: 643890 });
            o.color = getTeamColor(team);
            o.team = team;
            o.name = "Mothership";
            o.isMothership = true;
            o.controllers.push(new ioTypes.nearestDifferentMaster(o), new ioTypes.mapTargetToGoal(o));
            o.refreshBodyAttributes();

            global.controllableEntities.push(o);
            this.motherships.push(o);
            this.aliveNow++;

            o.on('dead', () => {
                this.aliveNow--;
                if (global.controllableEntities.includes(o)) {
                    global.controllableEntities.splice(global.controllableEntities.indexOf(o), 1);
                }
                if (this.motherships.includes(o)) {
                    this.motherships.splice(this.motherships.indexOf(o), 1);
                }

                sockets.broadcast(getTeamName(o.team) + "'s mothership has been killed!");
                global.defeatedTeams.push(o.team);
                if (this.teamWon) return;

                for (let i = 0; i < entities.length; i++) {
                    let entity = entities[i];
                    if (entity.team === o.team) {
                        entity.sendMessage("Your team has been eliminated.");
                        entity.kill();
                    }
                }
                if (this.aliveNow === 1) {
                    this.teamWon = true;
                    setTimeout(teamId => {
                        sockets.broadcast(getTeamName(teamId) + " has won the game!");
                        setTimeout(closeArena, 3000);
                    }, 2500, this.motherships[0].team);
                }
            });
        }
    }
    stop () {
        while (this.motherships.length) {
            this.motherships.shift().kill();
        }
        this.teamWon = false;
    }
};