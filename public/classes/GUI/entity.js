import { Element } from "./element.js";
import { Vector } from '../vector.js';

class Entity extends Element {
	constructor (opts = {}) {
		super(opts);
		this.definition = opts.definition ?? 'basic';
		this.angle = opts.angle ?? -Math.PI / 4;
		this.size = opts.size ?? 200;
		this.canRotate = opts.canRotate ?? false;
		this.borderWidth = opts.borderWidth ?? 5;
	}

	get width () { return this.scale.y; }
	set width (width) { this.scale.y = width; }
	get length () { return this.scale.x - this.width; }
	set length (length) { this.scale.x = length - this.width; }

	drawVisuals (cornerTopLeft = new Vector, cornerBottomRight = new Vector) {

		// TODO: unfuck this wonky entity rendering function, then finish this element
		drawEntity(baseColor, xx, yy, entry.image, 1 / scale, 1, (scale * scale) / entry.image.size, 1, -Math.PI / 4, true);
	}
}

export { Entity };