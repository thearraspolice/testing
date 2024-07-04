import { PlayerInput, InputBind, Input } from './playerInput.js';
import { Vector } from '../classes/vector.js';
import { c2s } from './shared/packetTypes.js';
import { click } from './clickables.js';

// TODO: patch this away, we shouldnt want it
import { gui } from "../lib (legacy)/socketInit.js";

class PlayerController {
    constructor (element, inputbinds, extraEvents, socket, global, settings) {
        this.target = new Vector;
        this.goal = new Vector;
        this.toggles = {
            autoalt: false,
            autofire: false,
            autospin: false,
            override: false,
            reversetank: false,
            reversemouse: false,
            spinlock: false
        };

        this.upgradeTankQueue = [];
        this.upgradeSkillQueue = [];
        this.maxstat = false;

        this.socket = socket;
        this.global = global;
        this.settings = settings;

        this.playerInput = new PlayerInput(element, inputbinds);
        for (let [name, listener] of [...PlayerController.VanillaBinds, ...extraEvents]) {
            if ('string' !== typeof name) {
                throw new Error('event name not string :(');
            }
            if ('function' !== typeof listener) {
                throw new Error('event listener not function :(');
            }

            this.playerInput.addEventListener(name, listener.bind(this));
        }
    }

    currentCommands () {
        return {
            goal: this.goal,
            target: this.target,
            toggles: this.toggles
        };
    }
}

PlayerController.DefaultInputBinds = {
    // mouse
    'Mouse0': ['primaryfire', false],
    'Mouse2': ['secondaryfire', false],
    'Mouse1': ['tertiaryfire', false], // Mouse1 is middle click
    'MouseMove': 'lookAround',
    'MouseWheelUp': 'zoom_up',
    'MouseWheelDown': 'zoom_down',

    // keyboard
    'g': ['toggle_autoalt', false],
    'e': ['toggle_autofire', false],
    'c': ['toggle_autospin', false],
    'r': ['toggle_override', false],
    'v': ['toggle_reversetank', false],
    'b': ['toggle_reversemouse', false],
    'x': ['toggle_spinlock', false],

    't': ['toggle_classtree', false],
    'f': ['become', false],
    'Enter': ['respawn', false],

    'p': ['upgradetank_token', false],

    'y': ['upgradetank_option1', false],
    'u': ['upgradetank_option2', false],
    'i': ['upgradetank_option3', false],
    'h': ['upgradetank_option4', false],
    'j': ['upgradetank_option5', false],
    'k': ['upgradetank_option6', false],

    '1': ['upgradeskill_player_damage', false],
    '2': ['upgradeskill_player_health', false],
    '3': ['upgradeskill_bullet_speed', false],
    '4': ['upgradeskill_bullet_health', false],
    '5': ['upgradeskill_bullet_penetration', false],
    '6': ['upgradeskill_bullet_damage', false],
    '7': ['upgradeskill_reload', false],
    '8': ['upgradeskill_player_speed', false],
    '9': ['upgradeskill_player_shieldregeneration', false],
    '0': ['upgradeskill_player_shieldhealth', false],

    'ArrowUp': 'up_classtree',
    'ArrowLeft': 'down_classtree',
    'ArrowDown': 'left_classtree',
    'ArrowRight': 'right_classtree',
    'w': 'up',
    'a': 'down',
    's': 'left',
    'd': 'right',

    'l': ['levelup', false],
    'm': 'upgradeskill_maxstat',
    'Shift': 'secondaryfire_classtreesprint',
    'o': ['suicide', false],

    '+': ['zoom_up', false],
    '-': ['zoom_down', false]
};

PlayerController.VanillaBinds = [
    // misc
    ['toggle_autoalt', e => this.toggles.autoalt = !this.toggles.autoalt ], //this.socket.talk(c2s.toggleauto, 5)],
    ['toggle_autofire', e => this.toggles.autofire = !this.toggles.autofire ], //this.socket.talk(c2s.toggleauto, 1)],
    ['toggle_autospin', e => this.toggles.autospin = !this.toggles.autospin ], //{ this.autoSpin = !this.autoSpin; this.socket.talk(c2s.toggleauto, 0); }],
    ['toggle_override', e => this.toggles.override = !this.toggles.override ], //this.socket.talk(c2s.toggleauto, 2)],
    ['toggle_reversetank', e => this.toggles.reversetank = !this.toggles.reversetank ], //{ this.reverseDirection = !this.reverseDirection; this.socket.talk(c2s.toggleauto, 4); }],
    ['toggle_reversemouse', e => this.toggles.reversemouse = !this.toggles.reversemouse ], //{ this.inverseMouse = !this.inverseMouse; this.socket.talk(c2s.toggleauto, 3); }],
    ['toggle_spinlock', e => this.toggles.spinlock = !this.toggles.spinlock ], //{ this.spinLock = !this.spinLock; this.socket.talk(c2s.toggleauto, 6); }],
    
    ['become', e => this.socket.talk(c2s.become)],
    ['toggle_classtree', e => { global.treeScale = 1; global.showTree = !global.showTree; }],
    ['respawn', e => this.socket.talk(c2s.spawn, global.playerName, 0, settings.game.autoLevelUp)],
    
    // upgrades
    ['upgradetank_token', e => this.socket.talk(c2s.upgradeTankToken)],
    
    ['upgradetank_option1', e => this.upgradeTankQueue.push(0) ], // this.socket.talk(c2s.upgradeTank, 0, parseInt(gui.upgrades[0][0]))],
    ['upgradetank_option2', e => this.upgradeTankQueue.push(1) ], // this.socket.talk(c2s.upgradeTank, 1, parseInt(gui.upgrades[1][0]))],
    ['upgradetank_option3', e => this.upgradeTankQueue.push(2) ], // this.socket.talk(c2s.upgradeTank, 2, parseInt(gui.upgrades[2][0]))],
    ['upgradetank_option4', e => this.upgradeTankQueue.push(3) ], // this.socket.talk(c2s.upgradeTank, 3, parseInt(gui.upgrades[3][0]))],
    ['upgradetank_option5', e => this.upgradeTankQueue.push(4) ], // this.socket.talk(c2s.upgradeTank, 4, parseInt(gui.upgrades[4][0]))],
    ['upgradetank_option6', e => this.upgradeTankQueue.push(5) ], // this.socket.talk(c2s.upgradeTank, 5, parseInt(gui.upgrades[5][0]))],
    
    ['upgradeskill_player_damage'            , e => this.upgradeSkillQueue.push([0, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 0, this.maxstat)],
    ['upgradeskill_player_health'            , e => this.upgradeSkillQueue.push([1, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 1, this.maxstat)],
    ['upgradeskill_bullet_speed'             , e => this.upgradeSkillQueue.push([2, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 2, this.maxstat)],
    ['upgradeskill_bullet_health'            , e => this.upgradeSkillQueue.push([3, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 3, this.maxstat)],
    ['upgradeskill_bullet_penetration'       , e => this.upgradeSkillQueue.push([4, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 4, this.maxstat)],
    ['upgradeskill_bullet_damage'            , e => this.upgradeSkillQueue.push([5, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 5, this.maxstat)],
    ['upgradeskill_reload'                   , e => this.upgradeSkillQueue.push([6, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 6, this.maxstat)],
    ['upgradeskill_player_speed'             , e => this.upgradeSkillQueue.push([7, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 7, this.maxstat)],
    ['upgradeskill_player_shieldregeneration', e => this.upgradeSkillQueue.push([8, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 8, this.maxstat)],
    ['upgradeskill_player_shieldhealth'      , e => this.upgradeSkillQueue.push([9, this.maxstat]) ], // this.socket.talk(c2s.upgradeSkill, 9, this.maxstat)],
    
    // motion
    ['up_classtree', e => global.showTree ? (global.scrollVelocityY = -this.treeScrollSpeed * this.treeScrollSpeedMultiplier) : this.target.y -= e.isPressed * 2 - 1 ],
    ['down_classtree', e => global.showTree ? (global.scrollVelocityY = +this.treeScrollSpeed * this.treeScrollSpeedMultiplier) : this.target.y += e.isPressed * 2 - 1 ],
    ['left_classtree', e => global.showTree ? (global.scrollVelocityX = -this.treeScrollSpeed * this.treeScrollSpeedMultiplier) : this.target.x -= e.isPressed * 2 - 1 ],
    ['right_classtree', e => global.showTree ? (global.scrollVelocityX = +this.treeScrollSpeed * this.treeScrollSpeedMultiplier) : this.target.x += e.isPressed * 2 - 1 ],
    
    ['up', e => this.target.y -= e.isPressed * 2 - 1 ],
    ['down', e => this.target.y += e.isPressed * 2 - 1 ],
    ['left', e => this.target.x -= e.isPressed * 2 - 1 ],
    ['right', e => this.target.x += e.isPressed * 2 - 1 ],
    
    // mouse control
    ['primaryfire', e => click() this.socket.cmd.set(0, e.isPressed)],
    ['secondaryfire', e => click() this.socket.cmd.set(1, e.isPressed)],
    ['tertiaryfire', e => click() this.socket.cmd.set(2, e.isPressed)],
    ['lookAround', e => {
        global.statHover = global.clickables.hover.check({
            x: mouse.clientX * global.ratio,
            y: mouse.clientY * global.ratio,
        }) === 0;
        if (!this.spinLock) return;
        global.mouse.x = mouse.clientX * global.ratio;
        global.mouse.y = mouse.clientY * global.ratio;
    }],
    
    // operator
    ['levelup', e => this.socket.talk(c2s.levelup)],
    ['upgradeskill_maxstat', e => this.maxstat = e.isPressed],
    ['secondaryfire_classtreesprint', e => global.showTree ? (this.treeScrollSpeedMultiplier = e.isPressed ? 5 : 1) : this.socket.cmd.set(6, e.isPressed)],
    ['suicide', e => this.socket.talk(c2s.suicide)],
    ['zoom_up', e => global.showTree && (global.treeScale /= 1.1)],
    ['zoom_down', e => global.showTree && (global.treeScale *= 1.1)]
];





// TODO: check if there is anything from this to port over. if there is none, get rid of the class and implement PlayerController
class Canvas {
    constructor() {
        this.directionLock = false;
        this.target = global.target;
        this.socket = global.socket;
        this.directions = [];

        this.chatInput = document.getElementById('chatInput');
        this.chatInput.addEventListener('keydown', event => {
            if (![global.KEY_ENTER, global.KEY_ESC].includes(event.keyCode)) return;
            this.chatInput.blur();
            this.canvas.focus();
            this.chatInput.hidden = true;
            if (!this.chatInput.value) return;
            if (event.keyCode === global.KEY_ENTER) this.socket.talk('chatMessage', this.chatInput.value);
            this.chatInput.value = "";
        });

        this.canvas = document.getElementById('gameCanvas');
        this.canvas.addEventListener('mousemove', event => this.mouseMove(event), false);
        this.canvas.addEventListener('mousedown', event => this.mouseDown(event), false);
        this.canvas.addEventListener('mouseup', event => this.mouseUp(event), false);
        this.canvas.addEventListener('keypress', event => this.keyPress(event), false);
        this.canvas.addEventListener('keydown', event => this.keyDown(event), false);
        this.canvas.addEventListener('keyup', event => this.keyUp(event), false);
        this.canvas.addEventListener('wheel', event => this.wheel(event), false);
        this.canvas.resize = (width, height) => {
            this.canvas.width = this.width = width;
            this.canvas.height = this.height = height;
        };
        this.canvas.resize(innerWidth, innerHeight);
        this.reverseDirection = false;
        this.inverseMouse = false;
        this.spinLock = true;
        this.treeScrollSpeed = 0.5;
        this.treeScrollSpeedMultiplier = 1;
    }
    wheel(event) {
        if (!global.died && global.showTree) {
            if (event.deltaY > 1) {
                global.treeScale /= 1.1;
            } else {
                global.treeScale *= 1.1;
            }
        }
    }
    keyPress(event) {
        switch (event.keyCode) {
            case global.KEY_ZOOM_OUT:
                if (!global.died && global.showTree) global.treeScale /= 1.1;
                break;
            case global.KEY_ZOOM_IN:
                if (!global.died && global.showTree) global.treeScale *= 1.1;
                break;
        }
    }
    keyDown(event) {
        switch (event.keyCode) {
            case global.KEY_SHIFT:
                if (global.showTree) this.treeScrollSpeedMultiplier = 5;
                else this.socket.cmd.set(6, true);
                break;

            case global.KEY_ENTER:
                // Enter to respawn
                if (global.died) {
                    this.socket.talk(c2s.spawn, global.playerName, 0, 1 * settings.game.autoLevelUp);
                    global.died = false;
                    break;
                }

                // or to talk instead
                if (this.chatInput.hidden && global.gameStart) {
                    this.chatInput.hidden = false;
                    this.chatInput.focus();
                    break;
                }
                break;

            case global.KEY_UP_ARROW:
                if (!global.died && global.showTree) return global.scrollVelocityY = -this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
            case global.KEY_UP:
                this.socket.cmd.set(0, true);
                break;
            case global.KEY_DOWN_ARROW:
                if (!global.died && global.showTree) return global.scrollVelocityY = +this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
            case global.KEY_DOWN:
                this.socket.cmd.set(1, true);
                break;
            case global.KEY_LEFT_ARROW:
                if (!global.died && global.showTree) return global.scrollVelocityX = -this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
            case global.KEY_LEFT:
                this.socket.cmd.set(2, true);
                break;
            case global.KEY_RIGHT_ARROW:
                if (!global.died && global.showTree) return global.scrollVelocityX = +this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
            case global.KEY_RIGHT:
                this.socket.cmd.set(3, true);
                break;
            case global.KEY_MOUSE_0:
                this.socket.cmd.set(4, true);
                break;
            case global.KEY_MOUSE_1:
                this.socket.cmd.set(5, true);
                break;
            case global.KEY_MOUSE_2:
                this.socket.cmd.set(6, true);
                break;
            case global.KEY_LEVEL_UP:
                this.socket.talk('L');
                break;
            case global.KEY_FUCK_YOU:
                this.socket.talk('0');
                break;
            case global.KEY_BECOME:
                this.socket.talk('H');
                break;
            case global.KEY_MAX_STAT:
                global.statMaxing = true;
                break;
            case global.KEY_SUICIDE:
                this.socket.talk('1');
                break;
        }
        if (!event.repeat) {
            switch (event.keyCode) {
                case global.KEY_AUTO_SPIN:
                    global.autoSpin = !global.autoSpin;
                    this.socket.talk('t', 0);
                    break;
                case global.KEY_AUTO_FIRE:
                    this.socket.talk('t', 1);
                    break;
                case global.KEY_OVER_RIDE:
                    this.socket.talk('t', 2);
                    break;
                case global.KEY_REVERSE_MOUSE: //client side only, no server effects except message
                    this.inverseMouse = !this.inverseMouse;
                    this.socket.talk('t', 3);
                    break;
                case global.KEY_REVERSE_TANK: //client side only, no server effects except message
                    this.reverseDirection = !this.reverseDirection;
                    this.socket.talk('t', 4);
                    break;
                case global.KEY_AUTO_ALT:
                    this.socket.talk('t', 5);
                    break;
                case global.KEY_SPIN_LOCK:
                    this.spinLock = !this.spinLock;
                    this.socket.talk('t', 6);
                    break;
                case global.KEY_CLASS_TREE:
                    global.treeScale = 1;
                    global.showTree = !global.showTree;
                    break;
            }
            if (global.canSkill) {
                let skill = [
                    global.KEY_UPGRADE_ATK, global.KEY_UPGRADE_HTL, global.KEY_UPGRADE_SPD,
                    global.KEY_UPGRADE_STR, global.KEY_UPGRADE_PEN, global.KEY_UPGRADE_DAM,
                    global.KEY_UPGRADE_RLD, global.KEY_UPGRADE_MOB, global.KEY_UPGRADE_RGN,
                    global.KEY_UPGRADE_SHI
                ].indexOf(event.keyCode);
                if (skill >= 0) this.socket.talk(c2s.upgradeSkill, skill, 1 * global.statMaxing);
            }
            if (global.canUpgrade) {
                switch (event.keyCode) {
                    case global.KEY_CHOOSE_1:
                        this.socket.talk(c2s.upgradeTank, 0, parseInt(gui.upgrades[0][0]));
                        break;
                    case global.KEY_CHOOSE_2:
                        this.socket.talk(c2s.upgradeTank, 1, parseInt(gui.upgrades[1][0]));
                        break;
                    case global.KEY_CHOOSE_3:
                        this.socket.talk(c2s.upgradeTank, 2, parseInt(gui.upgrades[2][0]));
                        break;
                    case global.KEY_CHOOSE_4:
                        this.socket.talk(c2s.upgradeTank, 3, parseInt(gui.upgrades[3][0]));
                        break;
                    case global.KEY_CHOOSE_5:
                        this.socket.talk(c2s.upgradeTank, 4, parseInt(gui.upgrades[4][0]));
                        break;
                    case global.KEY_CHOOSE_6:
                        this.socket.talk(c2s.upgradeTank, 5, parseInt(gui.upgrades[5][0]));
                        break;
                }
            }
        }
    }
    keyUp(event) {
        switch (event.keyCode) {
            case global.KEY_SHIFT:
                if (global.showTree) this.treeScrollSpeedMultiplier = 1;
                else this.socket.cmd.set(6, false);
                break;
            case global.KEY_UP_ARROW:
                global.scrollVelocityY = 0;
            case global.KEY_UP:
                this.socket.cmd.set(0, false);
                break;
            case global.KEY_DOWN_ARROW:
                global.scrollVelocityY = 0;
            case global.KEY_DOWN:
                this.socket.cmd.set(1, false);
                break;
            case global.KEY_LEFT_ARROW:
                global.scrollVelocityX = 0;
            case global.KEY_LEFT:
                this.socket.cmd.set(2, false);
                break;
            case global.KEY_RIGHT_ARROW:
                global.scrollVelocityX = 0;
            case global.KEY_RIGHT:
                this.socket.cmd.set(3, false);
                break;
            case global.KEY_MOUSE_0:
                this.socket.cmd.set(4, false);
                break;
            case global.KEY_MOUSE_1:
                this.socket.cmd.set(5, false);
                break;
            case global.KEY_MOUSE_2:
                this.socket.cmd.set(6, false);
                break;
            case global.KEY_MAX_STAT:
                global.statMaxing = false;
                break;
        }
    }
    mouseDown(mouse) {
        if (!this.socket) return;
        let primaryFire = 4,
            secondaryFire = 6;
        if (this.inverseMouse) [primaryFire, secondaryFire] = [secondaryFire, primaryFire];
        switch (mouse.button) {
            case 0:
                let mpos = {
                    x: mouse.clientX * global.ratio,
                    y: mouse.clientY * global.ratio,
                };
                let statIndex = global.clickables.stat.check(mpos);
                if (statIndex !== -1) {
                    this.socket.talk(c2s.upgradeSkill, statIndex, 0);
                } else if (global.clickables.skipUpgrades.check(mpos) !== -1) {
                    global.clearUpgrades();
                } else {
                    let upgradeIndex = global.clickables.upgrade.check(mpos);
                    if (upgradeIndex !== -1) this.socket.talk('U', upgradeIndex, parseInt(gui.upgrades[upgradeIndex][0]));
                    else this.socket.cmd.set(primaryFire, true);
                }
                break;
            case 1:
                this.socket.cmd.set(5, true);
                break;
            case 2:
                this.socket.cmd.set(secondaryFire, true);
                break;
        }
    }
    mouseUp(mouse) {
        if (!this.socket) return;
        let primaryFire = 4,
            secondaryFire = 6;
        if (this.inverseMouse) [primaryFire, secondaryFire] = [secondaryFire, primaryFire];
        switch (mouse.button) {
            case 0:
                this.socket.cmd.set(primaryFire, false);
                break;
            case 1:
                this.socket.cmd.set(5, false);
                break;
            case 2:
                this.socket.cmd.set(secondaryFire, false);
                break;
        }
    }
    mouseMove(mouse) {
        global.statHover = global.clickables.hover.check({
            x: mouse.clientX * global.ratio,
            y: mouse.clientY * global.ratio,
        }) === 0;
        if (!this.spinLock) return;
        global.mouse.x = mouse.clientX * global.ratio;
        global.mouse.y = mouse.clientY * global.ratio;
    }
}
export { Canvas, PlayerController };