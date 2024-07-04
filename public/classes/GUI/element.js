import { EventTargetSUB } from "../eventsSUB.js";
import { Vector } from "../vector.js";

let lerp = (a, b, t) => a + (b - a) * t;

class Element extends EventTargetSUB {
	static DefaultRenderingContext = undefined;
	constructor ({
		canvasContext = DefaultRenderingContext,
		position = new Vector,
		origin = new Vector,
		pivot = new Vector,
		scale = new Vector,
		children = [],
		opacity = 1
	} = {}) {
		if (!(canvasContext instanceof CanvasRenderingContext2D)) {
			throw new TypeError('either canvasContext is not set to an instance of CanvasRenderingContext2D or Element.DefaultRenderingContext is not set to an instance of CanvasRenderingContext2D');
		}

		// vectors
		this.position = position;
		this.origin = origin;
		this.pivot = pivot;
		this.scale = scale;

		// not vectors
		this.canvasContext = canvasContext;
		this.children = children;
		this.opacity = opacity;
	}

	calculateCornerPositions (parentCornerTopLeft = new Vector, parentCornerBottomRight = new Vector) {
		let t = this.origin.add(1).multiply(0.5),

			A = new Vector(
				lerp(parentCornerTopLeft.x, parentCornerBottomRight.x, t.x),
				lerp(parentCornerTopLeft.y, parentCornerBottomRight.y, t.y)
			).add(position),

			B = A.add(this.scale.multiply(this.pivot));

		return {
			cornerTopLeft: new Vector(Math.min(A.x, B.x), Math.min(A.y, B.y)),
			cornerBottomRight: new Vector(Math.max(A.x, B.x), Math.max(A.y, B.y))
		}
	}

	// this is the method to overwrite, everything else should stay untouched
	drawVisuals (cornerTopLeft = new Vector, cornerBottomRight = new Vector) {
		let centerPos = cornerTopLeft.add(cornerBottomRight).multiply(0.5);

		this.canvasContext.fillText('Base Element', centerPos.x, centerPos.y);
	}

	draw (parentCornerTopLeft = new Vector, parentCornerBottomRight = new Vector) {
		let corners = this.calculateCornerPositions(parentCornerTopLeft, parentCornerBottomRight);
		this.canvasContext.globalAlpha = this.opacity;
		this.canvasContext.textAlign = 'center';
		this.canvasContext.textBaseline = 'middle';
		this.drawVisuals(corners.cornerTopLeft, corners.cornerBottomRight);
		for (let child of this.children) {
			child.draw(corners.cornerTopLeft, corners.cornerBottomRight);
		}
	}
}

export { Element };