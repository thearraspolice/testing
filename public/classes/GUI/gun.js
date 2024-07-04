import { Element } from "./element.js";
import { Vector } from '../vector.js';

class Gun extends Element {
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
		// NOTE: also ask frostbyte what exactly he has planned with gun rendering, i assume it will be more than a single drawTrapezoid call
		drawEntity(baseColor, xx, yy, entry.image, 1 / scale, 1, (scale * scale) / entry.image.size, 1, -Math.PI / 4, true);
	}
}

export { Gun };