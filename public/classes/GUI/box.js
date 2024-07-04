import { Color } from './shared/color.js';
import { Element } from "./element.js";
import { Vector } from '../vector.js';
import { getRGBFromColor } from '../managers/clientColors.js';

class Box extends Element {
	constructor (opts = {}) {
		super(opts);
		this.colorBorder = opts.colorBorder ?? new Color('black');
		this.colorPrimary = opts.colorPrimary ?? new Color('gray');
		this.colorSecondary = opts.colorSecondary;
		this.innerOpacity = opts.innerOpacity ?? 1;
		this.secondarySpan = opts.innerOpacity ?? 0.4;
	}

	drawVisuals (cornerTopLeft = new Vector, cornerBottomRight = new Vector) {
		this.canvasContext.lineWidth = 5;
		this.canvasContext.strokeStyle = getRGBFromColor(this.colorBorder);
		this.canvasContext.strokeRect(cornerTopLeft.x, cornerTopLeft.y, this.scale.x, this.scale.y);

		this.canvasContext.globalAlpha *= this.innerOpacity;

		// we don't have a secondary color, just fill the box
		if (!this.secondarySpan) {
			this.canvasContext.fillStyle = getRGBFromColor(this.colorPrimary);
			this.canvasContext.fillRect(cornerTopLeft.x, cornerTopLeft.y, this.scale.x, this.scale.y);
			return;
		}

		// we do have a secondary color, draw both colors
		let primaryScale = this.scale.multiply(new Vector(1, 1 - this.secondarySpan)),
			secondaryScale = this.scale.multiply(new Vector(1, this.secondarySpan)),
			secondaryTopLeft = new Vector(cornerTopLeft.x, primaryScale.y);

		this.canvasContext.fillStyle = getRGBFromColor(this.colorPrimary);
		this.canvasContext.fillRect(cornerTopLeft.x, cornerTopLeft.y, primaryScale.x, primaryScale.y);

		this.canvasContext.fillStyle = getRGBFromColor(this.colorSecondary);
		this.canvasContext.fillRect(secondaryTopLeft.x, secondaryTopLeft.y, secondaryScale.x, secondaryScale.y);
	}
}

export { Box };