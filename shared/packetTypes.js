// socket.talk('M', this.chatInput.value); // send chat msg
// socket.talk('s', global.playerName, 0, 1 * settings.game.autoLevelUp); // spawn
// socket.talk('L'); // level up
// socket.talk('0'); // token tank
// socket.talk('H'); // become
// socket.talk('1'); // kill yourself
// socket.talk('t', toggleIndex);
// socket.talk('x', statIndex, upgradeFully);
// socket.talk('U', upgradeIndex);

// socket.talk('C', xAim, yAim, reverseTank, commandsBitfield);
// socket.talk('k', token);
// socket.talk('p', pingPayload);
// socket.talk('S', syncTime);
// socket.talk('d', lastCamUpdateTime);

// [ 'A', 'B' ]  =>  [ [ 'A', 0 ], [ 'B', 1 ] ]  =>  { A: 0, B: 1 }
let doThing = packettypes => Object.fromEntries(packettypes.map((t, i) => [t, i])),

c2s = doThing([
	'chatMessage', // [ String: message ] // send chat msg
	'spawn', // [ String: name, boolean: needsRoom, boolean: autoLVLup ] // (re)spawn
	'levelup', // [ ] // level up
	'upgradeTankToken', // [ ] // token tank
	'spectate', // [ ] // spectate
	'become', // [ ] // become
	'suicide', // [ ] // suicide
	'toggleauto', // [ Uint8: autoId ] // toggle stuff like autospin autofire etc
	'upgradeSkill', // [ Uint8: statId, boolean: wantsMax ] // upgrade stat
	'upgradeTank', // [ Uint8: upgrade, Uint8: branchId ] // upgrade tank
	'command', // [ Vector: target, Vector: goal, bitfield: commands ] // aim and commands
	'token', // [ String: token ] // token
	'ping', // [ BigInt: sentTime ] // ping
	'sync' // [ BigInt: syncTick ] // sync
]),

s2c = doThing([
	'welcome', // we can spawn
	'roomInit', // [ vector: roomSizeTiles, 2Darray: tile colors, bigint: serverStartTime, float: roomSpeed ] // room setup
	"roomUpdate", // [ vector: roomSizeTiles, 2Darray: tile colors ] // room update
	'info', // [ string: notFullyConnectedInfoMessage ] // info
	'setCamera', // [ vector: camPos, float: fov, string: namecolor ] // teleport camera and set hud data
	'sync', // clock syncing
	'broadcastMessage', // [ string: message ] // message
	'uplink', // PACKET: [
		//     BigInt: tickHappenedWhen,
		//     vector: camPos,
		//     float: fov,
		//     vector: camVel,
		//     boolean: isScoping,
		//
		//     structDynamic: gui {
		//         float: fps,
		//         Label: label,
		//         BigInt: score,
		//         Uint32: points,
		//         Array16<Upgrade>: upgrades,
		//         StatBar[10]: statsdata,
		//         Float: accel,
		//         Float: top, // unused
		//         boolean: root, // unused
		//         String: class
		//     },
		//
		//     Array32<Entity>: entities
		// ]
		//
		// structs needed:
		// Label: { string: type, Color: color, Uint32: playerid }
		// Upgrade: { uint: branchId, string: branchLabel, string: upgradeIndex }
		// StatBar: { Uint16: amount, Uint16: cap, Uint16: softcap, String8: name }
		// Entity: {
		//     bitfield: type,
		//     TurretAttributes?: issa turret, // type & 0x01
		//     EntityAttributes?: issa something real, // !(type & 0x01)
		//     Array<Gun>: guns,
		//     Array<Entity>: turrets
		// }
		// TurretAttributes: {
		//     float: facing, // what its actually looking at
		//     float: layer, // this is float cuz idk what kind of thing this is but its definitely numeric
		//     String: index, // ??????????????? something branch related // could be just the class its defined as
		//     Color: color,
		//     float: strokeWidth,
		//     boolean: borderless,
		//     boolean: drawfill,
		//     float: size, // size in relation to parent entity
		//     float: realSize, // what its actual size is if turret
		//     float: sizeFactor, // i dont know
		//     float: angle, // default angle it rests in
		//     float: direction, // in which direction to shift this entity in
		//     float: offset, // how much to shift this entity in
		//     boolean: mirrorMasterAngle,
		// }
		// EntityAttributes: {
		//     Int32: id,
		//     string: index, // just the class its defined as
		//     float: x,
		//     float: y,
		//     float: vx,
		//     float: vy,
		//     float: size,
		//     float: facing,
		//     float : perceptionAngleIndependence,
		//     float : defaultAngle,
		//     float: twiggle,
		//     float: layer,
		//     Color: color,
		//     boolean: borderless,
		//     boolean: drawFill,
		//     boolean: invuln,
		//     float: health,
		//     float: shield,
		//     float: alpha,
		//     string: name, // these only exist if `type & 0x04`
		//     BigInt: score, // these only exist if `type & 0x04`
		//     boolean: nameplate  // these is true if `type & 0x04`
		// }
		// Gun: {
		//     BigInt: time,
		//     float: power,
		//     Color: color,
		//     float: alpha,
		//     float: strokeWidth,
		//     boolean: borderless,
		//     boolean: drawFill,
		//     boolean: drawAbove,
		//     float: length,
		//     float: width,
		//     float: aspect,
		//     float: angle,
		//     float: direction,
		//     float: offset,
		// }
		//
		// // uplink
	"minimapAndLeaderboard", // [
		//     array<Uint32>: minimapAllDeleted,
		//     array<minimapAllEntry>: minimapAllUpdated,
		//     array<Uint32>: miinimapTeamDeleted,
		//     array<minimapTeamEntry>: minimapTeamUpdated,
		//     array<Uint32>: leaderboardDeleted,
		//     array<leaderboardEntry>: leaderboardUpdated,
		// ]
		//
		// structs needed:
		// minimapAllEntry: {
		//     Uint32: id,
		//     Uint8: type,
		//     float: x,
		//     float: y,
		//     Color: color,
		//     float: size
		// }
		// minimapTeamEntry: {
		//     Uint32: id,
		//     float: x,
		//     float: y,
		//     Color: color
		// }
		// leaderboardEntry: {
		//     id: Uint32,
		//     BigInt: score,
		//     Uint8: index,
		//     String: name,
		//     Color: color,
		//     Color: bar,
		//     String: nameColor,
		//     String: label
		// }
		//
		// // minimap data
	'ping', // [ BigInt: receivedTime ] // ping
	'deathScreen', // [ BigInt: score, Uint32: totalLifetime,
		//     Uint16: kills, Uint16: assists, Uint16: bosskills, Uint16: polygonkills,
		//     Array<String>: killerClasses ] // killscreen info
	'kicked', // kicked
	'nameColor', // [ Color: nameColor ] // name color
	'entityChatMessages' // [ String: message ] // currently visible chat messages from entities in range
]);


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Bitfield } from './liteSockets/Bitfield.js';
import { Builder } from './liteSockets/Walker/builder.js';
import { Reader } from './liteSockets/Walker/reader.js';
import { Color } from './color.js';

// TODO: test these
Builder.prototype.StructDynamic = function (object, struct) {
	let structKeys = Object.keys(struct.map(x => x[0])),
		doesPropertyExist = new Bitfield(keys);

	doesPropertyExist.forEach(field => {
		if (field in object) {
			doesPropertyExist.set(field, true);
		}
	});

	switch (structKeys.length >> 3) {
		case 0:
			// should i throw an error here?
			break;
		case 1:
			this.Uint8(parseInt(doesPropertyExist.store));
			break;
		case 2:
			this.Uint16(parseInt(doesPropertyExist.store));
			break;
		case 3: case 4:
			this.Uint32(parseInt(doesPropertyExist.store));
			break;
		default:
			this.BitUint64(doesPropertyExist.store);
	}

	for (let [key, type, ...argument] of struct) {
		if (!doesPropertyExist.get(key)) continue;
		if ('function' != typeof this[type]) throw new Error(`Nonexistant type in struct!\nkey: ${key}\ntype: ${type}\nstruct: ${struct}`);
		if (this[type].length && !argument) throw new Error(`Missing argument in struct!\nkey: ${key}\ntype: ${type}\nstruct: ${struct}`);
		if (!(key in object)) throw new Error(`Missing property in object!\nmissing property: ${key}\nexpected type: ${type}`);
		this[type](object[key], ...argument);
	}
	return this;
};

Reader.prototype.StructDynamic = function (struct) {
	let structKeys = Object.keys(struct.map(x => x[0])),
		bitfieldInit = 0n;
	switch (structKeys.length >> 3) {
		case 0:
			// should i throw an error here?
			break;
		case 1:
			bitfieldInit = BigInt(this.Uint8());
			break;
		case 2:
			bitfieldInit = BigInt(this.Uint16());
			break;
		case 3: case 4:
			bitfieldInit = BigInt(this.Uint32());
			break;
		default:
			bitfieldInit = this.BitUint64();
	}
	let doesPropertyExist = new Bitfield(keys, bitfieldInit),
		result = {};
	for (let [key, type, ...argument] of struct) {
		if (!doesPropertyExist.get(key)) continue;
		if ('function' != typeof this[type]) throw new Error(`Nonexistant type in struct!\nkey: ${key}\ntype: ${type}\nstruct: ${struct}`);
		if (this[type].length && !argument) throw new Error(`Missing argument in struct!\nkey: ${key}\ntype: ${type}\nstruct: ${struct}`);
		result[key] = this[type](...argument);
	}
	return result;
}

let vectorStruct = [ [ 'x', 'Float32' ], [ 'y', 'Float32' ] ],

	clientPackages = [
		['chatMessage', 'StringRemaining'], // StringRemaining is the chat message
		['spawn', 'Struct', [
			['name', 'String8'],
			['needsRoom', 'Int8'], // TODO: merge those two into a bitfield
			['autoLevelUp', 'Int8']
		]],
		['levelup'], // no payload needed
		['upgradeTankToken'], // no payload needed
		['spectate'], // no payload needed
		['become'], // no payload needed
		['suicide'], // no payload needed
		['toggleauto', 'Int8'], // Int8 is the auto-type // TODO: check if we should merge this with the 'command' packet
		['upgradeSkill', 'Struct', [
			['statId', 'Uint8'],
			['shouldMax', 'Int8'], // boolean
		]],
		['upgradeTank', 'Struct', [
			['upgradeId', 'Uint8'],
			['branchId', 'Uint8']
		]],
		['command', 'Struct', [
			['target', 'Struct', vectorStruct],
			['goal', 'Struct', vectorStruct],
			['commands', 'Uint16'] // bitfield
		]],
		['token', 'StringRemaining'], // StringRemaining is the token
		['ping', 'BigInt64'], // BigInt64, here and everywhere else, are timestamps
		['sync', 'Struct', [
			['clientTime', 'BigInt64'], // idk if both of these have to be bigints
			['serverTime', 'BigInt64'] // we should redo the lag compensation code lol
		]]
	],

	serverPackages = [
		// LOOK HOW MUCH EASIER THIS IS
		['entityChatMessages', 'ArrayRemaining', 'Struct', [
			['entityId', 'Uint32'],
			['messages', 'Array8', 'Struct', [
				['text', 'String16'],
				['expires', 'BigInt64']
			]]
		]]
	]

export { serverPackages, clientPackages };