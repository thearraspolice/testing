// Want to have custom events but DOM is annoying as shit?
// Here is your solution, a SUBstitute for DOM Events!

const typeSymbol = Symbol('type'),
	stopSymbol = Symbol('stop');

class EventSUB {
	constructor (type, options) {
		this[typeSymbol] = type;
		this[stopSymbol] = false;
		Object.assign(this, options);
	}

	// Immediately stop propagating unverifiable facts
	stopImmediatePropagation () {
		this[stopSymbol] = true;
	}
}

class EventTargetSUB {
	constructor () {
		this.listeners = {};;
	}

	// https://ih1.redbubble.net/image.419622652.9665/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.u20.jpg
	tryCleanup (type) {
		if (this.listeners[type].length == 0) {
			delete this.listeners[type];
		}
	}

	// I didn't add 'capture', 'passive' and 'signal' because they are redundant
	addEventListener (type, listener, once = false) {
		if (type in this.listeners) {
			this.listeners[type].push({ listener, once });
		} else {
			this.listeners[type] = [{ listener, once }];
		}
	}

	dispatchEvent (event) {
		let type = event[typeSymbol],
			remainingListeners = [];

		if (!(type in this.listeners)) {
			return;
		}

		for (let i = 0; i < this.listeners[type].length; i++) {
			let entry = this.listeners[type][i];
			entry.listener(event);

			if (event[stopSymbol]) {
				event[stopSymbol] = false;
				remainingListeners.push(...this.listeners[type].slice(i + entry.once));
				break;

			}
			
			if (!entry.once) {
				remainingListeners.push(entry);
			}
		}

		this.listeners[type] = remainingListeners;
		this.tryCleanup(type);
	}

	removeEventListener (type, listener, once = false) {
		if (type in dict) {

			let i = this.listeners[type].findIndex(entry => entry.listener === listener && entry.once === once);
			if (i != -1) {
				this.listeners[type].splice(i, 1);
			}

			this.tryCleanup(type);
		}
	}
}

export { EventSUB, EventTargetSUB };