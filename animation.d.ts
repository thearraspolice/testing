import { Entity, Gun } from "./server/modules/live/entity";

type TankShape = number | string | Array<number>

type TankColor = number | string | {
      BASE: number | string;
      HUE_SHIFT?: number;
      SATURATION_SHIFT?: number;
      BRIGHTNESS_SHIFT?: number;
      ALLOW_BRIGHTNESS_INVERT?: boolean;
    }

type AnimationEasingValues = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'step' | ((x: number) => number)

type AnimationSpec = Record<string, AnimationPreset>
type AnimationPreset = Array<AnimationKeyframe>

type AnimationKeyframe = {
  TIME: number; // Percentage
  EASING: AnimationEasingValues;
  MOTION: AnimationMotion;
};

type AnimationMotion = {
    MOVE?: [number, number];
    SCALE?: [number, number] | number; // 2D Vector for guns, 1 number for Turrets and Bodies.
    ROTATE?: number; // In Degrees
    COLOR?: TankColor;
    ASPECT?: number; // Errors if used for any other types except 'gun'
    SHAPE?: TankShape; // Errors if used for type 'gun'
    ALPHA?: number;
}

// -------------------------------

type OnTriggers = 'fire' | 'altFire' | 'death' | 'collide' | 'damage' | 'upgrade' | 'tick' | 'define' | 'animationStart' | 'animationKeyframe' | 'animationEnd' | 'trigger'
type OnSpec = Array<OnEventHandler>

type OnEventHandler = {
  event: OnTriggers;
  handler: (values: TriggerValues) => any;
};

interface CommonOnEventHandlerTriggerValues {
    body?: Entity;
    masterStore?: Entity['store'];
    gunStore?: Gun['store'];
}

interface FireTriggerValues extends CommonOnEventHandlerTriggerValues {
  gun?: Gun;
  child?: Entity;
  globalGunStore?: Gun["globalStore"];
  globalMasterStore?: Entity["globalStore"];
}

interface AltFireTriggerValues extends CommonOnEventHandlerTriggerValues {
  gun?: Gun;
  child?: Entity;
  globalGunStore?: Gun["globalStore"];
  globalMasterStore?: Entity["globalStore"];
}

interface DeathTriggerValues extends CommonOnEventHandlerTriggerValues {
    killers?: Array<Entity>;
    killTools?: Array<Entity>;
}

interface CollideTriggerValues extends CommonOnEventHandlerTriggerValues {
    instance?: Entity;
    other?: Entity;
}

interface DamageTriggerValues extends CommonOnEventHandlerTriggerValues {
    damageInflictor?: Entity;
    damageTool?: Entity;
}

interface UpgradeTriggerValues extends CommonOnEventHandlerTriggerValues {
    oldEntity?: Entity
}

interface AnimationStartTriggerValues extends CommonOnEventHandlerTriggerValues {
    animationName?: string;
    time?: number;
}

interface AnimationKeyframeTriggerValues extends CommonOnEventHandlerTriggerValues {
    animationName?: string;
    time?: number;
}

interface AnimationEndTriggerValues extends CommonOnEventHandlerTriggerValues {
    animationName?: string;
    time?: number;
}

interface ManualTriggerValues extends CommonOnEventHandlerTriggerValues {
    info?: any;
}

type TriggerValues = {
  fire: FireTriggerValues;
  altFire: AltFireTriggerValues;
  death: DeathTriggerValues;
  collide: CollideTriggerValues;
  damage: DamageTriggerValues;
  upgrade: UpgradeTriggerValues;
  animationStart: AnimationStartTriggerValues;
  animationKeyframe: AnimationKeyframeTriggerValues;
  animationEnd: AnimationEndTriggerValues;
  trigger: ManualTriggerValues;
};

/*
    Intended Use:
    ON: [{
        event: 'animationStart',
        handler: ({ body, animationName, time }) => {
            //code
        }
    }, {
        event: 'fire',
        handler: ({ body, gun, globalMasterStore }) => {
            //code
        }
    }, {
        event: 'define',
        handler: ({ body, gun, animationName }) => { // Error, no parameter 'animationName' for event 'define'
            //code
        }
    }]

    ANIMATION: {
        gunOut: [{
            TIME: 1,
            TYPE: 'gun',
            EASING: 'linear',
            MOTION: {
                MOVE: [0, 10]
            }
        }]
    }
*/