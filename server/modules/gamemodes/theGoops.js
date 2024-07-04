function startCountdown(totalTimeInSeconds) {
    let timeLeft = totalTimeInSeconds;

    function announceTimeLeft() {
        if (timeLeft > 0) {
            let minutesLeft = Math.ceil(timeLeft / 60);
            sockets.broadcast(`Time left: ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}!`);
            timeLeft -= 60; // Announce every 60 seconds (1 minute)
            return setTimeout(announceTimeLeft, 60000); // Schedule the next announcement
        } else {
            sockets.broadcast("Time's up! Nobody wins!");
            return setTimeout(closeArena, 3000); // Close the arena when the time is up
        }
    }

    // Start the countdown
    return announceTimeLeft();
}

class TheGoops {
    constructor() {
        this.goopBlobTypes = ["goopBlob","goopBlobBirther","goopBlobFarmer","goopBlobAttacker","goopBlobTargeter","goopBlobResistant"],
        this.gameWon = false,
        this.goops = 0,
        this.maxgoops = 0
        this.teamClaimedPanels = {}
        this.teamNums = {};
        this.timerTimeout
    }

    init() {
        Class.basic.UPGRADES_TIER_1.push('healer');
        for (let loc of room.goop) {
            this.spawn(loc);
        }
        console.log('Boss rush initialized.');

        const totalTime = 800;

        this.timerTimeout = startCountdown(totalTime)

    }

    spawn(loc, type = false) {
        this.goops += 1
        this.maxgoops += 1
        type = type ? type : ran.choose(this.goopBlobTypes);
        let o = new Entity(loc);
        o.x +=  (Math.random() - 0.5) * 200;
        o.y +=  (Math.random() - 0.5) * 200;
        o.define(type);
        o.team = 6009;
        const centerX = c.WIDTH/2;
        const centerY = c.HEIGHT/2;
        const distance = util.getDistance(new Vector(o.x,o.y), new Vector(centerX,centerY))
        const maxScore = 10000000;
        const minScore = 1000;
        const exponentialFactor = 0.002;
        o.skill.score = minScore + (maxScore - minScore) * Math.exp(-exponentialFactor * distance);
        o.name = "Goop Blob";
        o.color = "#545c24 0 1 0 false";
        o.SIZE = c.WIDTH / c.X_GRID / 20;
        o.controllers = [new ioTypes.nearestDifferentMaster(o), new ioTypes.spin(o)];

        o.on('dead', () => {


            this.goops -= 1

            let killers = [];
            for (let instance of o.collisionArray) {
                if (isPlayerTeam(instance.team) && 6009 !== instance.team) {
                    killers.push(instance);
                }
            }

                let killer = ran.choose(killers);
                let newTeam = killer.team,
                    teamName = newTeam > 0 ? killer.name : getTeamName(newTeam);
                room.setType((newTeam > 0) ? "dom3" : (newTeam > -9) ? "dom" + (-newTeam) : "dom0", loc);

                if (this.teamClaimedPanels[teamName]==undefined) {
                    this.teamClaimedPanels[teamName]=0
                    this.teamNums[teamName]=newTeam
                }
                this.teamClaimedPanels[teamName]+=1

                sockets.broadcast(`A goop blob has been destroyed by ${teamName}!`);
                sockets.broadcast(`${this.goops} goop blob${this.goops !== 1 ? 's' : ''} remain!`);

                if (this.goops==0 && !this.gameWon) {
                    this.gameWon = true;
                    clearTimeout(this.timerTimeout);
                    // Find the winning team(s) with the highest claimed panels
                    let winningTeams = [];
                    let maxClaimedPanels = 0;

                    for (const teamName in this.teamClaimedPanels) {
                        const claimedPanels = this.teamClaimedPanels[teamName];

                        if (claimedPanels > maxClaimedPanels) {
                            // Found a new leader, clear previous winners
                            maxClaimedPanels = claimedPanels;
                            winningTeams = [teamName];
                        } else if (claimedPanels === maxClaimedPanels) {
                            // Found a tie, add the team to the winners
                            winningTeams.push(teamName);
                        }
                    }
                    const teamNums = this.teamNums
                    setTimeout(function() {
                        if (winningTeams.length === 1) {
                            // Only one winner
                            sockets.broadcast(`${winningTeams[0]} has won the game with ${maxClaimedPanels} panels!`);
                          } else if (winningTeams.length > 1) {
                            // Tie between multiple teams
                            sockets.broadcast(`It's a tie between teams: ${winningTeams.join(', ')} with ${maxClaimedPanels} panels each!`);
                            // Handle the tie as needed
                          }
                        setTimeout(function(){
                            sockets.broadcast(`Celebration! Your enemies are now rare flowers!`);
                            let transformQueue = []
                            for (let i = 0; i < entities.length; i++) {
                                let entity = entities[i];
                                let isEntityInWinningTeam = false;

                                for (let j = 0; j < winningTeams.length; j++) {
                                  if (entity.team === teamNums[winningTeams[j]]) {
                                    isEntityInWinningTeam = true;
                                    break; // No need to check other winning teams for this entity
                                  }
                                }

                                if (!isEntityInWinningTeam) {
                                  transformQueue.push(entity);
                                }
                              }
                            for (let i = 0; i < transformQueue.length; i++) {
                                transformQueue[i].controllers = []
                                transformQueue[i].define("flower");
                                transformQueue[i].SIZE /= 3
                                transformQueue[i].settings.diesAtRange = false
                                transformQueue[i].settings.acceptsScore = true
                                transformQueue[i].skill.score += 200000;
                            }
                            setTimeout(function(){
                                closeArena()
                            }, 30000);
                        }, 3000);
                    }, 1500);
                }

        });
    };
}

module.exports = { TheGoops };
