module.exports = class TrainWars extends Gamemode {
    loop () {
        let train_able = entities.filter(isPlayerTeam),
            teams = new Set(train_able.map(r => r.team));
        for (let team of teams) {
            let train = train_able.filter(r => r.team === team).sort((a, b) => b.skill.score - a.skill.score);

            for (let [i, player] of train.entries()) {
                if (i === 0) continue;

                let beforeYou = new Vector(train[i - 1].x - player.x, train[i - 1].y - player.y);
                if (!beforeYou.isShorterThan(90)) {
                    let factor = 90 / beforeYou.length;
                    beforeYou.x *= factor;
                    beforeYou.y *= factor;
                }
                player.velocity.x = beforeYou.x * player.damp * 2;
                player.velocity.y = beforeYou.y * player.damp * 2;
            }
        }
    }
};