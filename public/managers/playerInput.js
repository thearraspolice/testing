import { EventSUB, EventTargetSUB } from '../classes/eventsSUB.js';

let keyboardLayoutMap = { ' ': 'Space' };
if ('function' === typeof navigator?.keyboard?.getLayoutMap) {
	navigator.keyboard.getLayoutMap().then(layout => {
		keyboardLayoutMap = Object.fromEntries(layout.entries());
		keyboardLayoutMap[' '] = 'Space';
	});
} else {
	console.warn('Your browser does not support a feature that helps with keyboard layouts.\n' +
		'While its absence does not directly cause fatal problems, you can switch to a Chromium-based browser if you experience severe keyboard layout problems.\n\n' +

		'Ungoogled Chromium is recommended if you prefer a very simple, private and performant browsing experience:\n' +
		'https://ungoogled-software.github.io/ungoogled-chromium-binaries/\n' +
		'Please also read the FaQ of Ungoogled Chromium if you are not a very technical person:\n' +
		'https://ungoogled-software.github.io/ungoogled-chromium-wiki/faq\n\n' +
	
		'If you do not want Ungoogled Chromium, at the very least do not get an Opera Software product.\n' +
		'Their browsers do not bring any actual benefits.');
}

class Input {
	class ({ key, alt, ctrl, meta, shift }) {
		if ('string' !== typeof key) {
			throw new Error('the first argument (the key) must be a string!');
		}
		this.key = key;
		this.alt = alt;
		this.ctrl = ctrl;
		this.meta = meta;
		this.shift = shift;
	}
}

class InputBind {
	constructor ({ eventName, description = '', inputs = [], down = true, up = true, repeatingDown = false }) {
		if ('string' !== typeof eventName) {
			throw new Error('the first argument (the event name) must be a string!');
		}

		if (!Array.isArray(inputs)) {
			throw new Error("'inputs' must be an array of Input instances!");
		}

		for (let i in inputs) {
			if (!(inputs[i] instanceof Input)) {
				throw new Error('item number ' + i + " of 'inputs' must be an instance of Input!");
			}
		}

		this.eventName = eventName;
		this.description = description;
		this.keys = keys;
		this.down = down;
		this.up = up;
		this.repeatingDown = repeatingDown;
	}
}

class PlayerInput extends EventTargetSUB {
	constructor (element, inputbinds, activated = true) {
		super();
		this.activated = activated;
		this.initElement(element);
		this.initInputBinds(inputbinds);
	}

	initInputBinds (inputbinds) {
		if (!Array.isArray(inputbinds)) {
			throw new Error("the argument must be an array of Input instances!");
		}

		for (let i in inputbinds) {
			if (!(inputbinds[i] instanceof InputBind)) {
				throw new Error('item number ' + i + " of the argument must be an instance of Input!");
			}
		}

		// TODO: make it so we dont need to loop through every input to check if there is a right one
		this.inputbinds = inputbinds;
	}

	initElement (element) {
		element.tabIndex = 0; // RIP people who use Tab to navigate

		element.addEventListener('wheel', event => {
			if (!this.activated || !event.isTrusted) return;
			this.handleMouseEvent({
				isTrusted: true,
				button: event.deltaY > 0 ? 'WheelDown' : 'WheelUp',
				preventDefault: () => event.preventDefault()
			}, Math.abs(event.deltaY));
		});

		element.addEventListener('mousemove', event => this.handleMouseMoveEvent(event));
		element.addEventListener('mouseup', event => this.handleMouseEvent(event, false));
		element.addEventListener('mousedown', event => this.handleMouseEvent(event, true));
		element.addEventListener('keyup', event => this.handleKeyboardEvent(event, false));
		element.addEventListener('keydown', event => this.handleKeyboardEvent(event, true));
		this.element = element;
	}

	// TODO: make it so we dont need to loop through every input to check if there is a right one
	handleEvent (event, inputKey, eventData, isPressed) {
		if (!this.activated || !event.isTrusted) return;

		for (let i = 0; i < this.inputbinds.length; i++) {
			let inputbind = this.inputbinds[i];

			if (event.repeat && !inputbind.repeatingDown) continue;
			if ('boolean' === typeof isPressed) {
				if (isPressed && !inputbind.down) continue;
				if (!isPressed && !inputbind.up) continue;
			}

			for (let j = 0; j < inputbind.inputs.length; j++) {
				let input = inputbind.inputs[j];
				
				if (input.key !== inputKey) continue;
				if ('boolean' === typeof input.alt && input.alt !== event.altKey) continue;
				if ('boolean' === typeof input.ctrl && input.ctrl !== event.ctrlKey) continue;
				if ('boolean' === typeof input.meta && input.meta !== event.metaKey) continue;
				if ('boolean' === typeof input.shift && input.shift !== event.shiftKey) continue;

				event.preventDefault();
				this.dispatchEvent(new EventSUB(inputbind.eventName, Object.assign({}, eventData)));
			}
		}
	}

	handleMouseEvent (mouseEvent, extra) {
		this.handleEvent(
			mouseEvent,
			'Mouse' + mouseEvent.button,
			Object.assign(
				{ x: mouseEvent.x, y: mouseEvent.y },
				'boolean' === typeof extra ? { isPressed: extra } : { yDelta: extra }
			),
			'boolean' === typeof extra ? extra : undefined
		);
	}

	handleMouseMoveEvent (mouseMoveEvent) {
		this.handleEvent(
			mouseMoveEvent,
			'MouseMove',
			{
				x: mouseMoveEvent.x,
				y: mouseMoveEvent.y,
				xDelta: mouseMoveEvent.movementX,
				yDelta: mouseMoveEvent.movementY
			}
		);
	}

	handleKeyboardEvent (keyboardEvent, isPressed) {
		this.handleEvent(
			keyboardEvent,
			keyboardEvent.key in keyboardLayoutMap ? keyboardLayoutMap[keyboardEvent.key] : keyboardEvent.key,
			{ isPressed }
		);
	}
}

export { PlayerInput, InputBind, Input };