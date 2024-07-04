import { Color } from './shared/color.js';
import { Element } from "./element.js";
import { Vector } from '../vector.js';
import { getRGBFromColor } from '../managers/clientColors.js';

class Bar extends Element {
	constructor (opts = {}) {
		super(opts);
		this.colorBackground = opts.colorBackground ?? new Color();
		this.colorFill = opts.colorFill ?? new Color();
		this.colorEmpty = opts.colorEmpty;
		this.innerSize = opts.innerSize ?? 0.8;
		this.width = opts.width ?? 10;
		this.length = opts.length ?? 100;
		this.fill = opts.fill ?? 1;
	}

	get width () { return this.scale.y; }
	set width (width) { this.scale.y = width; }
	get length () { return this.scale.x - this.width; }
	set length (length) { this.scale.x = length - this.width; }

	drawVisuals (cornerTopLeft = new Vector, cornerBottomRight = new Vector) {
		
		// figure out where the line is supposed to be
		let halfWidthVec = new Vector(this.width / 2, this.width / 2),
			start = cornerTopLeft.add(halfWidthVec),
			endOuter = cornerBottomRight.subtract(halfWidthVec),
			endInner = endOuter.subtract(start).multiply(this.fill).add(start);

		// prep for bg
		this.canvasContext.lineWidth = this.width;
		this.canvasContext.beginPath();
		this.canvasContext.lineTo(start.x, start.y);
		this.canvasContext.lineTo(endOuter.x, endOuter.y);
		this.canvasContext.closePath();

		// draw bg
		this.canvasContext.strokeStyle = getRGBFromColor(this.colorBackground);
		this.canvasContext.stroke();

		// prep for inner
		this.canvasContext.lineWidth *= this.innerSize;

		// draw empty inner if desired
		if (this.colorEmpty) {
			this.canvasContext.strokeStyle = getRGBFromColor(this.colorEmpty);
			this.canvasContext.stroke();
		}

		// prep for filled inner
		this.canvasContext.beginPath();
		this.canvasContext.lineTo(start.x, start.y);
		this.canvasContext.lineTo(endInner.x, endInner.y);
		this.canvasContext.closePath();

		// draw fill
		this.canvasContext.strokeStyle = getRGBFromColor(this.colorFill);
		this.canvasContext.stroke();
	}
}

export { Bar };