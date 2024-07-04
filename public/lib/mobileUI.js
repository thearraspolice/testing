import { gameDraw } from "./lib/gameDraw.js";

let mobileUI = {};
mobuleUI.drawMessages = () => {};
mobuleUI.drawSkillBars = () => {};
mobuleUI.drawSelfInfo = () => {};
mobuleUI.drawMinimapAndDebug = (spacing, alcoveSize) => {
    // Draw minimap and FPS monitors
    //minimap stuff starts here
    let len = alcoveSize,
    	height = (len / global.gameWidth) * global.gameHeight;
    if (global.gameHeight > global.gameWidth || global.gameHeight < global.gameWidth) {
        let ratio = [
            global.gameWidth / global.gameHeight,
            global.gameHeight / global.gameWidth,
        ];
        len /= ratio[1] * 1.5;
        height /= ratio[1] * 1.5;
        if (len > alcoveSize * 2) {
            ratio = len / (alcoveSize * 2);
        } else if (height > alcoveSize * 2) {
            ratio = height / (alcoveSize * 2);
        } else {
            ratio = 1;
        }
        len /= ratio;
        height /= ratio;
    }
    ctx.globalAlpha = 0.4;
    let x = spacing,
    	y = spacing,
    	W = global.roomSetup[0].length,
        H = global.roomSetup.length;
    for (let ycell = 0; ycell < H; ycell++) {
        let row = global.roomSetup[ycell];
        for (let xcell = 0; xcell < W; xcell++) {
            let cell = global.roomSetup[ycell][xcell];
            ctx.fillStyle = gameDraw.getZoneColor(cell);
            if (gameDraw.getZoneColor(cell) !== color.white) {
                drawGuiRect(x + xcell * len / W, y + ycell * height / H, len / W, height / H);
            }
        }
    }
    ctx.fillStyle = color.white;
    drawGuiRect(x, y, len, height);
    ctx.globalAlpha = 1;
    ctx.lineWidth = 3;
    ctx.fillStyle = color.black;
    drawGuiRect(x, y, len, height, true);
    for (let entity of minimap.get()) {
        ctx.fillStyle = gameDraw.mixColors(gameDraw.modifyColor(entity.color), color.black, 0.3);
        ctx.globalAlpha = entity.alpha;
        switch (entity.type) {
            case 2:
                drawGuiRect(x + ((entity.x - entity.size) / global.gameWidth) * len - 0.4, y + ((entity.y - entity.size) / global.gameHeight) * height - 1, ((2 * entity.size) / global.gameWidth) * len + 0.2, ((2 * entity.size) / global.gameWidth) * len + 0.2);
                break;
            case 1:
                drawGuiCircle(x + (entity.x / global.gameWidth) * len, y + (entity.y / global.gameHeight) * height, (entity.size / global.gameWidth) * len + 0.2);
                break;
            case 0:
                if (entity.id !== gui.playerid) drawGuiCircle(x + (entity.x / global.gameWidth) * len, y + (entity.y / global.gameHeight) * height, 2);
                break;
        }
    }
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.strokeStyle = color.black;
    ctx.fillStyle = color.black;
    drawGuiCircle(x + (global.player.cx / global.gameWidth) * len - 1, y + (global.player.cy / global.gameHeight) * height - 1, 2, false);
    if (global.showDebug) {
        drawGuiRect(x, y - 40, len, 30);
        lagGraph(lag.get(), x, y - 40, len, 30, color.teal);
        gapGraph(global.metrics.rendergap, x, y - 40, len, 30, color.pink);
        timingGraph(GRAPHDATA, x, y - 40, len, 30, color.yellow);
    }
    //minimap stuff ends here
    //debug stuff
    y += height;
    if (global.showDebug) {
        drawText("APS++", x + len, y + 5 * 14 + 2, 15, "#B6E57C", "right");
        drawText("Prediction: " + Math.round(GRAPHDATA) + "ms", x + len, y + 4 * 14, 10, color.guiwhite, "right");
        drawText(`Bandwidth: ${gui.bandwidth.in} in, ${gui.bandwidth.out} out`, x + len, y + 3 * 14, 10, color.guiwhite, "right");
        drawText("Update Rate: " + global.metrics.updatetime + "Hz", x + len, y + 2 * 14, 10, color.guiwhite, "right");
        drawText((100 * gui.fps).toFixed(2) + "% : " + global.metrics.rendertime + " FPS", x + len, y + 1 * 14, 10, global.metrics.rendertime > 10 ? color.guiwhite : color.orange, "right");
        drawText(global.metrics.latency + " ms - " + global.serverName, x + len, y, 10, color.guiwhite, "right");
    } else {
        drawText("APS++", x + len, y + 2 * 14 + 2, 15, "#B6E57C", "right");
        drawText((100 * gui.fps).toFixed(2) + "% : " + global.metrics.rendertime + " FPS", x + len, y + 1 * 14, 10, global.metrics.rendertime > 10 ? color.guiwhite : color.orange, "right");
        drawText(global.metrics.latency + " ms : " + global.metrics.updatetime + "Hz", x + len, y, 10, color.guiwhite, "right");
    }
    global.fps = global.metrics.rendertime;
};
mobuleUI.drawLeaderboard = () => {};
mobuleUI.drawAvailableUpgrades = () => {};

export { mobileUI }