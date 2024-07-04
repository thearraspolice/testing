// An addon is guaranteed to run only after all groups are loaded.
// This is helpful, if your group relies on all other definitions already being loaded.
// Addons that are dependant on other addons should be named something like
// "[PARENT ADDON NAME]-[EXTENSION NAME].js", to make sure that it would run after that addon ran.

const { combineStats, makeAuto } = require('../facilitators.js');
const { gunCalcNames, smshskl } = require('../constants.js');
const g = require('../gunvals.js');
const ensureIsClass = (Class, str) => {
    if ("object" == typeof str) {
        return str;
    }
    if (str in Class) {
        return Class[str];
    }
    throw Error(`Definition ${str} is attempted to be gotten but does not exist!`);
};
const dreadnoughtBody = {
    ACCEL: 1.6,
    SPEED: 1.4,
    HEALTH: 400,
    DAMAGE: 10,
    RESIST: 3,
    PENETRATION: 2,
    SHIELD: 40,
    REGEN: 0.025,
    FOV: 1.5,
    DENSITY: 3,
};

module.exports = ({ Class }) => {
	// Comment out the line below to enable this addon, uncomment it to disable this addon.
	//return console.log('--- Dreadnoughts v1 addon [dreadv1.js] is disabled. See lines 32-33 to enable it. ---');;

	// Misc
	Class.genericDreadnought1 = {
	    PARENT: ["genericTank"],
	    BODY: dreadnoughtBody,
	    SHAPE: 6,
	    COLOR: 9,
	    SIZE: 50,
	    SKILL_CAP: Array(10).fill(smshskl+3),
		REROOT_UPGRADE_TREE: "dreadOfficialV1",
	};
	Class.mechanismMainTurret = {
	    PARENT: ["genericTank"],
	    LABEL: "Turret",
	    CONTROLLERS: ["nearestDifferentMaster"],
	    INDEPENDENT: true,
	    BODY: {
	        FOV: 0.8,
	    },
	    COLOR: 16,
	    GUNS: [{
	        POSITION: [22, 10, 1, 0, 0, 0, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret, g.pound, g.morespeed, g.morereload, g.doublereload]),
	            TYPE: "bullet"
	        }
	    }]
	};
	Class.automationMainTurret = {
	    PARENT: ["genericTank"],
	    LABEL: "Turret",
	    CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
	    INDEPENDENT: true,
	    BODY: {
	        FOV: 0.8,
	    },
	    COLOR: 16,
	    GUNS: [{
	        POSITION: [22, 10, 1, 0, 0, 0, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret, g.morereload]),
	            TYPE: "bullet"
	        }
	    }]
	};
	Class.automationSecondaryTurret = {
	    PARENT: ["genericTank"],
	    LABEL: "Turret",
	    CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
	    INDEPENDENT: true,
	    BODY: {
	        FOV: 0.8,
	    },
	    COLOR: 16,
	    GUNS: [{
	        POSITION: [22, 10, 1, 0, 0, 0, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.morerecoil, g.turret, g.morereload]),
	            TYPE: "bullet"
	        }
	    }]
	};
	Class.turretedTrap = makeAuto(Class.trap);

	// T0
	Class.dreadOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Dreadnought",
		LEVEL: 150,
		EXTRA_SKILL: 48,
	}

	// T1
	Class.swordOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Sword",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.swordOfficialV1.GUNS.push({
	        POSITION: [18, 7, 1, 0, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.sniper, g.morereload]),
	            TYPE: "bullet"
	        }
	    });
	}

	Class.pacifierOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Pacifier",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.pacifierOfficialV1.GUNS.push({
	        POSITION: [15, 7, 1, 0, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.morereload]),
	            TYPE: "bullet"
	        }
	    });
	}

	Class.invaderOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Invader",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.invaderOfficialV1.GUNS.push({
	        POSITION: [5.5, 7.5, 1.3, 7.5, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.morespeed]),
	            TYPE: "drone",
	            AUTOFIRE: true,
	            SYNCS_SKILLS: true,
	            STAT_CALCULATOR: gunCalcNames.drone,
	            WAIT_TO_CYCLE: true,
	            MAX_CHILDREN: 4,
	        }
	    });
	}

	Class.centaurOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Centaur",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.centaurOfficialV1.GUNS.push({
	        POSITION: [12, 7, 1, 0, 0, 120*i, 0],
	    }, {
	        POSITION: [2.5, 7, 1.6, 12, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.trap, g.pound, g.morereload, {range: 3}]),
	            TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
	            STAT_CALCULATOR: gunCalcNames.trap,
	        },
	    });
	}

	Class.automationOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Automation",
	    TURRETS: [],
	}
	for (let i = 0; i < 6; i++) {
	    Class.automationOfficialV1.TURRETS.push({
	        POSITION: [4, 8.7, 0, 60*i+30, 180, 1],
	        TYPE: "automationSecondaryTurret",
	    });
	}
	Class.automationOfficialV1.TURRETS.push({
	    POSITION: [7, 0, 0, 0, 360, 1],
	    TYPE: "automationMainTurret",
	});

	Class.juggernautOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Juggernaut",
	    BODY: {
	        HEALTH: 2,
	        SHIELD: 3,
	        REGEN: 1.5,
	        SPEED: 0.7,
	    },
	    TURRETS: [{
	        POSITION: [22, 0, 0, 0, 0, 0],
	        TYPE: ["smasherBody", {INDEPENDENT: false} ]
	    }]
	}

	// T2
	Class.sabreOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Sabre",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.sabreOfficialV1.GUNS.push({
	        POSITION: [25, 7, 1, 0, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.sniper, g.assass, g.morespeed, g.morereload]),
	            TYPE: "bullet"
	        }
	    }, {
	        POSITION: [5, 7, -1.4, 9, 0, 120*i, 0]
	    });
	}
	Class.gladiusOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Gladius",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.gladiusOfficialV1.GUNS.push({
	        POSITION: [16, 8, 1, 0, 0, 120*i, 0]
	    }, {
	        POSITION: [20, 6, 1, 0, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.sniper, g.rifle, g.morespeed, g.morereload]),
	            TYPE: "bullet"
	        }
	    });
	}

	Class.appeaserOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Appeaser",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.appeaserOfficialV1.GUNS.push({
	        POSITION: [6, 8, 1.3, 7, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.pound, g.morereload, g.slow, {size: 0.55}]),
	            TYPE: "bullet"
	        }
	    }, {
	        POSITION: [6, 7.5, 1.2, 9, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.pound, g.morereload, g.slow, {size: 0.55 * 8 / 7.5}]),
	            TYPE: "bullet"
	        }
	    });
	}
	Class.peacekeeperOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Peacekeeper",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.peacekeeperOfficialV1.GUNS.push({
	        POSITION: [17, 10, 1, 0, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.destroy, g.morereload]),
	            TYPE: "bullet",
	        }
	    });
	}
	Class.diplomatOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Diplomat",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.diplomatOfficialV1.GUNS.push({
	        POSITION: [13.5, 6, 1, 0, 2.2, 120*i, 0.5],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.slow, g.pound, g.morereload]),
	            TYPE: "bullet"
	        }
	    }, {
	        POSITION: [13.5, 6, 1, 0, -2.2, 120*i, 0.5],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.slow, g.pound, g.morereload]),
	            TYPE: "bullet"
	        }
	    }, {
	        POSITION: [15.5, 6, 1, 0, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triple, g.slow, g.pound, g.morereload]),
	            TYPE: "bullet"
	        }
	    });
	}

	Class.inquisitorOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Inquisitor",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.inquisitorOfficialV1.GUNS.push({
	        POSITION: [7, 8.5, 1.3, 7.5, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.drone, g.over, g.morespeed, g.battle, {SIZE: 1.25}]),
	            TYPE: "drone",
	            AUTOFIRE: true,
	            SYNCS_SKILLS: true,
	            STAT_CALCULATOR: gunCalcNames.drone,
	            WAIT_TO_CYCLE: true,
	            MAX_CHILDREN: 4,
	        }
	    });
	}
	Class.assailantOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Assailant",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.assailantOfficialV1.GUNS.push({
	        POSITION: [13.5, 8, 1, 0, 0, 120*i, 0],
	    }, {
	        POSITION: [1.5, 10, 1, 13.5, 0, 120*i, 0],
	        PROPERTIES: {
	            MAX_CHILDREN: 4,
	            SHOOT_SETTINGS: combineStats([g.factory, g.weak, g.morespeed]),
	            TYPE: "minion",
	            STAT_CALCULATOR: gunCalcNames.drone,
	            AUTOFIRE: true,
	            SYNCS_SKILLS: true
	        }
	    }, {
	        POSITION: [11.5, 10, 1, 0, 0, 120*i, 0]
	    });
	}
	Class.infiltratorOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Infiltrator",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.infiltratorOfficialV1.GUNS.push({
	        POSITION: [7, 6, 0.6, 5.5, 2.8, 120*i, 0.5],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.pound]),
	            TYPE: "swarm",
	            STAT_CALCULATOR: gunCalcNames.swarm
	        }
	    }, {
	        POSITION: [7, 6, 0.6, 5.5, -2.8, 120*i, 0.5],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.pound]),
	            TYPE: "swarm",
	            STAT_CALCULATOR: gunCalcNames.swarm
	        }
	    }, {
	        POSITION: [7, 6, 0.6, 8, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.swarm, g.battle, g.carrier, g.pound]),
	            TYPE: "swarm",
	            STAT_CALCULATOR: gunCalcNames.swarm
	        }
	    });
	}

	Class.cerberusOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Cerberus",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.cerberusOfficialV1.GUNS.push({
	        POSITION: [11.5, 2.5, 1, 0, 4, 120*i, 0]
	    }, {
	        POSITION: [1.75, 2.5, 1.7, 11.5, 4, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.fast, g.pound, g.morereload, {range: 3}]),
	            TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
	            STAT_CALCULATOR: gunCalcNames.trap,
	        },
	    }, {
	        POSITION: [11.5, 2.5, 1, 0, -4, 120*i, 0]
	    }, {
	        POSITION: [1.75, 2.5, 1.7, 11.5, -4, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.fast, g.pound, g.morereload, {range: 3}]),
	            TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
	            STAT_CALCULATOR: gunCalcNames.trap
	        }
	    }, {
	        POSITION: [13.5, 3.2, 1, 0, 0, 120*i, 0.5]
	    }, {
	        POSITION: [1.75, 3.2, 1.7, 13.5, 0, 120*i, 0.5],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.fast, g.pound, g.morereload, {range: 3}]),
	            TYPE: ["trap", {HITS_OWN_TYPE: "never"} ],
	            STAT_CALCULATOR: gunCalcNames.trap
	        }
	    });
	}
	Class.minotaurOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Minotaur",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.minotaurOfficialV1.GUNS.push({
	        POSITION: [13, 9, 1, 0, 0, 120*i, 0],
	    }, {
	        POSITION: [3, 9, 1.6, 13, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.trap, g.block, g.veryfast, g.pound, g.morereload, {range: 3}]),
	            TYPE: ["unsetTrap", {HITS_OWN_TYPE: "never"} ],
	            STAT_CALCULATOR: gunCalcNames.trap
	        }
	    });
	}
	Class.sirenOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Siren",
	    GUNS: [],
	}
	for (let i = 0; i < 3; i++) {
	    Class.sirenOfficialV1.GUNS.push({
	        POSITION: [13, 7, -1.4, 0, 0, 120*i, 0],
	    }, {
	        POSITION: [2.5, 7, 1.6, 13, 0, 120*i, 0],
	        PROPERTIES: {
	            SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.fast, g.pound, g.morereload, {range: 3}]),
	            TYPE: ["turretedTrap", {HITS_OWN_TYPE: "never"} ],
	            STAT_CALCULATOR: gunCalcNames.trap,
	        }
	    });
	}

	Class.mechanismOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Mechanism",
	    TURRETS: [],
	}
	for (let i = 0; i < 6; i++) {
	    Class.mechanismOfficialV1.TURRETS.push({
	        POSITION: [4, 8.75, 0, 60*i+30, 180, 1],
	        TYPE: "automationMainTurret",
	    })
	}
	Class.mechanismOfficialV1.TURRETS.push({
	    POSITION: [9, 0, 0, 0, 360, 1],
	    TYPE: "mechanismMainTurret",
	})

	Class.behemothOfficialV1 = {
	    PARENT: ["genericDreadnought1"],
	    LABEL: "Behemoth",
	    BODY: {
	        HEALTH: 4,
	        SHIELD: 5,
	        REGEN: 2.25,
	        SPEED: 0.5,
	    },
	    TURRETS: [{
	        POSITION: [23.5, 0, 0, 0, 0, 0],
	        TYPE: ["smasherBody", {INDEPENDENT: false} ]
	    }],
	}

	Class.addons.UPGRADES_TIER_0.push("dreadOfficialV1");
		Class.dreadOfficialV1.UPGRADES_TIER_1 = ["swordOfficialV1", "pacifierOfficialV1", "invaderOfficialV1", "centaurOfficialV1"];
			Class.swordOfficialV1.UPGRADES_TIER_M1 = ["sabreOfficialV1", "gladiusOfficialV1"];
			Class.pacifierOfficialV1.UPGRADES_TIER_M1 = ["appeaserOfficialV1", "peacekeeperOfficialV1", "diplomatOfficialV1"];
			Class.invaderOfficialV1.UPGRADES_TIER_M1 = ["inquisitorOfficialV1", "assailantOfficialV1", "infiltratorOfficialV1"];
			Class.centaurOfficialV1.UPGRADES_TIER_M1 = ["cerberusOfficialV1", "minotaurOfficialV1", "sirenOfficialV1"];
			Class.automationOfficialV1.UPGRADES_TIER_M1 = ["mechanismOfficialV1"];
			Class.juggernautOfficialV1.UPGRADES_TIER_M1 = ["behemothOfficialV1"];

	for (let primary of Class.dreadOfficialV1.UPGRADES_TIER_1) {
		let primaryName = primary;
		primary = ensureIsClass(Class, primary);
		primary.UPGRADES_TIER_1 = [];

		for (let secondary of [ "swordOfficialV1", "pacifierOfficialV1", "invaderOfficialV1", "centaurOfficialV1", "automationOfficialV1", "juggernautOfficialV1" ]) {
			let secondaryName = secondary;
	        secondary = ensureIsClass(Class, secondary);

			let GUNS = [],
				TURRETS = [],
				LABEL = primary.LABEL + "-" + secondary.LABEL,
				BODY = JSON.parse(JSON.stringify(dreadnoughtBody));

			// Label it
			if (primary.LABEL == secondary.LABEL) LABEL = primary.LABEL;

			// Guns
			if (primary.GUNS) GUNS.push(...primary.GUNS);
			for (let g in secondary.GUNS) {
				let POSITION = JSON.parse(JSON.stringify(secondary.GUNS[g].POSITION)),
					PROPERTIES = secondary.GUNS[g].PROPERTIES;
				POSITION[5] += 60;
				GUNS.push({ POSITION, PROPERTIES });
			}

			// Turrets
			if (primary.TURRETS) TURRETS.push(...primary.TURRETS);
			if (secondary.TURRETS) TURRETS.push(...secondary.TURRETS);

			// Body
			if (primary.BODY) for (let m in primary.BODY) BODY *= primary.BODY[m];
			if (secondary.BODY) for (let m in secondary.BODY) BODY *= secondary.BODY[m];

			// Definition name
			let definitionName = primaryName + secondaryName;

			// Actually make that guy
			Class[definitionName] = {
				PARENT: ["genericDreadnought1"],
				UPGRADES_TIER_2: [],
				BODY, LABEL, GUNS, TURRETS
			};
			Class[primaryName].UPGRADES_TIER_1.push(definitionName);

			// Compile T2
			for (let primary2 of primary.UPGRADES_TIER_M1) {
				let primaryName2 = primary2;
				primary2 = ensureIsClass(Class, primary2);

				for (let secondary2 of secondary.UPGRADES_TIER_M1) {
					let secondaryName = secondary2;
					secondary2 = ensureIsClass(Class, secondary2);

					let GUNS = [],
						TURRETS = [],
						LABEL = primary2.LABEL + "-" + secondary2.LABEL,
						BODY = JSON.parse(JSON.stringify(dreadnoughtBody));

					// Label it
					if (primary2.LABEL == secondary2.LABEL) LABEL = primary2.LABEL;

					// Guns
					if (primary2.GUNS) GUNS.push(...primary2.GUNS);
					for (let g in secondary2.GUNS) {
						let POSITION = JSON.parse(JSON.stringify(secondary2.GUNS[g].POSITION)),
							PROPERTIES = secondary2.GUNS[g].PROPERTIES;
						POSITION[5] += 60;
						GUNS.push({ POSITION, PROPERTIES });
					}

					// Turrets
					if (primary2.TURRETS) TURRETS.push(...primary2.TURRETS);
					if (secondary2.TURRETS) TURRETS.push(...secondary2.TURRETS);

					// Body
					if (primary2.BODY) for (let m in primary2.BODY) BODY[m] *= primary2.BODY[m];
					if (secondary2.BODY) for (let m in secondary2.BODY) BODY[m] *= secondary2.BODY[m];

					// Definition name
					let definitionName2 = primaryName2 + secondaryName;

					// Actually make that guy
					Class[definitionName2] = {
						PARENT: ["genericDreadnought1"],
						BODY, LABEL, GUNS, TURRETS
					};
					Class[definitionName].UPGRADES_TIER_2.push(definitionName2);
				}
			}
		}
	}
};
