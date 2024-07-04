const { serverStartTime } = require("../../lib/util");

function rounder(val) {
    if (Math.abs(val) < 0.00001) val = 0;
    return +val.toPrecision(6);
}
// Define mocking up functions
function getMockup(e, positionInfo) {
    let turretsAndProps = e.turrets.concat(e.props);
    return {
        index: e.index,
        name: e.label,
        upgradeName: e.upgradeLabel,
        upgradeTooltip: e.upgradeTooltip,
        x: rounder(e.x),
        y: rounder(e.y),
        color: e.color,
        strokeWidth: e.strokeWidth,
        upgradeColor: e.upgradeColor,
        glow: e.glow,
        borderless: e.borderless,
        drawFill: e.drawFill,
        shape: e.shapeData,
        imageInterpolation: e.imageInterpolation,
        size: rounder(e.size),
        realSize: rounder(e.realSize),
        facing: rounder(e.facing),
        mirrorMasterAngle: e.settings.mirrorMasterAngle,
        layer: e.layer,
        statnames: e.settings.skillNames,
        position: positionInfo,
        rerootUpgradeTree: e.rerootUpgradeTree,
        className: e.className,
        upgrades: e.upgrades.map(r => ({
            tier: r.tier,
            index: r.index
        })),
        guns: e.guns.map(function(gun) {
            return {
                offset: rounder(gun.offset),
                direction: rounder(gun.direction),
                length: rounder(gun.length),
                width: rounder(gun.width),
                aspect: rounder(gun.aspect),
                angle: rounder(gun.angle),
                color: gun.color,
                strokeWidth: gun.strokeWidth,
                alpha: gun.alpha,
                borderless: gun.borderless,
                drawFill: gun.drawFill,
                drawAbove: gun.drawAbove,
            };
        }),
        turrets: turretsAndProps.map(function(t) {
            let out = getMockup(t, {});
            out.sizeFactor = rounder(t.bound.size);
            out.offset = rounder(t.bound.offset);
            out.direction = rounder(t.bound.direction);
            out.layer = rounder(t.bound.layer);
            out.angle = rounder(t.bound.angle);
            return out;
        }),
    };
}

let endPoints;
function getFurthestFrom(x, y) {
    let furthestDistance = 0,
        furthestPoint = [x, y],
        furthestIndex = 0;
    for (let i = 0; i < endPoints.length; i++) {
        let point = endPoints[i];
        let distance = (point[0] - x) ** 2 + (point[1] - y) ** 2;
        if (distance > furthestDistance) {
            furthestDistance = distance;
            furthestPoint = point;
            furthestIndex = i;
        }
    }
    endPoints.splice(furthestIndex, 1);
    return furthestPoint;
}

function getDimensions(entity) {
    // Begin processing from the main body
    endPoints = [];
    sizeEntity(entity);

    // Convert to useful info
    endPoints.sort((a, b) => (b[0] ** 2 + b[1] ** 2 - a[0] ** 2 - a[1] ** 2));
    let point1 = getFurthestFrom(0, 0),
        point2 = getFurthestFrom(point1[0], point1[1]),
        avgX = (point1[0] + point2[0]) / 2,
        avgY = (point1[1] + point2[1]) / 2,
        point3 = getFurthestFrom(avgX, avgY);
    
    let {x, y, r} = constructCircumcirle(point1, point2, point3);

    return {
        axis: r * 2,
        middle: {x, y},
    };
}

// Find circumcircle and circumcenter
function constructCircumcirle(point1, point2, point3) {
    // Rounder to avoid floating point nonsense
    let x1 = rounder(point1[0]);
    let y1 = rounder(point1[1]);
    let x2 = rounder(point2[0]);
    let y2 = rounder(point2[1]);
    let x3 = rounder(point3[0]);
    let y3 = rounder(point3[1]);

    // Divide by zero protection
    if (x3 == x1 || x3 == x2) x3 += 1e-5;
    
    let numer1 = x3 ** 2 + y3 ** 2 - x1 ** 2 - y1 ** 2;
    let numer2 = x2 ** 2 + y2 ** 2 - x1 ** 2 - y1 ** 2;
    let factorX1 = 2 * x2 - 2 * x1;
    let factorX2 = 2 * x3 - 2 * x1;
    let factorY1 = 2 * y1 - 2 * y2;
    let factorY2 = 2 * y1 - 2 * y3;
    let y = (numer1 * factorX1 - numer2 * factorX2) / (factorY1 * factorX2 - factorY2 * factorX1);
    let x = ((y - y3) ** 2 - (y - y1) ** 2 - x1 ** 2 + x3 ** 2) / factorX2;
    let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));

    return {x, y, r};
}

function sizeEntity(entity, x = 0, y = 0, angle = 0, scale = 1) {    
    // Process body as octagon
    for (let i = 0; i < 8; i++) {
        endPoints.push([x + Math.cos(Math.PI / 4 * i) * scale, y + Math.sin(Math.PI / 4 * i) * scale]);
    }
    
    // Process guns
    for (let g of entity.guns) {
        // Construct a trapezoid at angle 0
        let widths = g.aspect > 0 ? [g.width * g.aspect / 2, g.width / 2] : [g.width / 2, -g.width * g.aspect / 2],
            points = [],
            sinT = Math.sin(g.angle + angle),
            cosT = Math.cos(g.angle + angle);
        points.push([0, widths[1]]);
        points.push([g.length, widths[0]]);
        points.push([g.length, -widths[0]]);
        points.push([0, -widths[1]]);
    
        for (let point of points) {
            // Rotate it to the new angle via vector rotation
            let newX = point[0] * cosT - point[1] * sinT,
                newY = point[0] * sinT + point[1] * cosT;
            // Translate it to the right position
            newX += g.offset * Math.cos(g.direction + g.angle + angle);
            newY += g.offset * Math.sin(g.direction + g.angle + angle);
            // Save coords
            endPoints.push([x + newX * scale, y + newY * scale]);
        }
    }

    // Process turrets
    for (let t of entity.turrets) {
        let xShift = t.bound.offset * Math.cos(t.bound.direction + t.bound.angle),
            yShift = t.bound.offset * Math.sin(t.bound.direction + t.bound.angle);
        sizeEntity(t, x + xShift * scale, y + yShift * scale, t.bound.angle, t.bound.size * scale);
    }
}

console.log("Started loading mockups...");
let mockupsLoadStartTime = Date.now();

let mockupData = [];
for (let k in Class) {
    try {
        if (!Class.hasOwnProperty(k)) continue;
        let type = Class[k];
        // Create a reference entities which we'll then take an image of.
        let temptank = new Entity({ x: 0, y: 0 });
        temptank.define(type);
        temptank.className = k;
        temptank.name = type.LABEL; // Rename it (for the upgrades menu).
        // Fetch the mockup.
        type.mockup = {
            body: temptank.camera(true),
            position: getDimensions(temptank),
        };
        // This is to pass the size information about the mockup that we didn't have until we created the mockup
        type.mockup.body.position = type.mockup.position;
        // Add the new data to the thing.
        mockupData.push(getMockup(temptank, type.mockup.position));
        // Kill the reference entities.
        temptank.destroy();
    } catch (error) {
        util.error('[WARNING] An error has occured during mockup loading:');
        util.error(error);
        util.error('When attempting to generate mockup "' + k + '":');
        for (let i in Class[k]) util.error("\t" + i + ": " + Class[k][i]);
        throw Error("Mockups load aborted.");
    }
}

// Remove them
purgeEntities();

let mockupsLoadEndTime = Date.now();
console.log("Finished compiling " + mockupData.length + " classes into mockups.");
console.log("Mockups generated in " + (mockupsLoadEndTime - mockupsLoadStartTime) + " milliseconds.\n");
console.log("Server loaded in " + (mockupsLoadEndTime - serverStartTime) + " milliseconds.\n");
mockupsLoaded = true;

let mockupJsonData = JSON.stringify(mockupData);

module.exports = {
    mockupJsonData
};