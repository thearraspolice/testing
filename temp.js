function calculateInterpoletedValuesBetweenKeyframes(currentKeyframe, nextKeyframe, progress) {
        const interpolatedValues = {};
        for (const prop in currentKeyframe.MOTION) {
            const interpolatedValue = this.interpolate(currentKeyframe.MOTION[prop], nextKeyframe.MOTION[prop], progress, currentKeyframe.EASING);
            interpolatedValues[prop] = interpolatedValue;
        }
        return interpolatedValues;
    }
function interpolate(start, end, progress, easing) {
        if (Array.isArray(start) && Array.isArray(end)) {
            if (start.length !== end.length) {
                throw new SyntaxError('Start and end values must have the same length for array interpolation.');
            }
            return start.map((startValue, index) => this.interpolate(startValue, end[index], progress, easing));
        } else {
            switch (easing) {
                case 'linear':
                    return start + (end - start) * progress;
                case 'easeIn':
                    return start + (end - start) * Math.pow(progress, 2);
                case 'easeOut':
                    return start + (end - start) * (1 - Math.pow(1 - progress, 2));
                case 'easeInOut':
                    return start + (end - start) * ((progress < 0.5) ? 2 * Math.pow(progress, 2) : 1 - Math.pow(-2 * progress + 2, 2) / 2);
                case 'step':
                    return progress < 0.5 ? start : end;
                default:
                    if (typeof easing === 'function') {
                        return easing(progress);
                    } else {
                        throw new SyntaxError('A keyframe needs to have an easing function.')
                    }
            }
        }
    }