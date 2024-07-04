import { Color } from './shared/color.js';
import { Element } from "./element.js";
import { Vector } from '../vector.js';

class Text extends Element {
	constructor (opts = {}) {
		super(opts);
		this.colorBackground = opts.colorBackground ?? new Color('black');
		this.colorFill = opts.colorFill ?? new Color('white');
		this.text = opts.text ?? '';
		this.fontSize = opts.fontSize ?? 20;
	}

	get width () { return this.scale.y; }
	set width (width) { this.scale.y = width; }
	get length () { return this.scale.x - this.width; }
	set length (length) { this.scale.x = length - this.width; }

	drawVisuals (cornerTopLeft = new Vector, cornerBottomRight = new Vector) {

		// TODO: unfuck text rendering, then finish this element
		drawText(rawText, x, y, size, defaultFillStyle, align = "left", center = false, fade = 1, stroke = true, context = ctx)
	}
}

export { Text };