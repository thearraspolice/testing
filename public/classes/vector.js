class Vector {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    clone () { return new Vector(this.x, this.y); }

	// In production when you're done debugging, you can remove these two getters and the two setters.
	// They're here so you can more easily find the places where you fucked up.
    get x () { return this.X; }
    get y () { return this.Y; }
    set x (x) {
        if (isNaN(x) || 'number' !== typeof x) {
            throw new TypeError(`Vector property 'x' was attempted to be set to ${ 'function' === typeof x ? 'a function???' : JSON.stringify(x)}`);
        }
        this.X = x;
    }
    set y (y) {
        if (isNaN(y) || 'number' !== typeof y) {
            throw new TypeError(`Vector property 'y' was attempted to be set to ${ 'function' === typeof y ? 'a function???' : JSON.stringify(y)}`);
        }
        this.Y = y;
    }

    set (x, y) { this.x = x; this.y = y; }

    get lengthSquared () { return this.x ** 2 + this.y ** 2; }
    get length () { return Math.sqrt(this.x ** 2 + this.y ** 2); }
    get angle () { return Math.atan2(this.y, this.x); }

    multiplyInPlace (factor) {
        if (!(factor instanceof Vector)) {
            factor = new Vector(factor, factor);
        }
        this.x *= factor.x;
        this.y *= factor.y;
        return this;
    }
    addInPlace (vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    subtractInPlace (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    normaliseInPlace (desiredLength = 1) {
        let length = this.length;
        if (length > 0) {
			this.multiplyInPlace(desiredLength / length);
		}
        return this;
    }
    rotateInPlace (angleRadians) {
        let angle = this.angle + angleRadians,
            length = this.length;
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
        return this;
    }

    multiply (factor) { return this.clone().multiplyInPlace(factor); }
    add (vector) { return this.clone().addInPlace(vector); }
    subtract (vector) { return this.clone().subtractInPlace(vector); }
    normalise (desiredLength) { return this.clone().normaliseInPlace(desiredLength); };
    rotate (angleRadians) { return this.clone().rotateInPlace(angleRadians); }
}

export { Vector };