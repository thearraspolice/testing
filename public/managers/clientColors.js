import { Color } from './shared/color.js';

let computedColorCache = {},
	colorMap = {},
	colorMapAnimated = {},
	animatedColors = {
        // police
        20: true, flashBlueRed: true,

        21: true, flashBlueGrey: true, flashBlueGray: true,

        22: true, flashGreyBlue: true, flashGrayBlue: true,

        23: true, flashRedGrey: true, flashRedGray: true,

        24: true, flashGreyRed: true, flashGrayRed: true,

        // lesbian
        29: true, lesbian: true,

        // rainbow
        36: true, rainbow: true,

        // trans
        37: true, trans: true,

        // bi
        38: true, bi: true,

        // magenta
        42: true, animatedMagenta: true,
	},

	clearColorCache = () => computedColorCache = {},

	loadTheme = theme => {
        // TODO: load theme into colorMap
    },

    recalculateColorMapAnimated = () => {
        let now = Date.now(),

            //six_gradient = Math.floor((now / 200) % 6),
            five_bars = Math.floor((now % 2000) / 400),
            three_bars = Math.floor((now % 2000) * 3 / 2000),
            blinker = 150 > now % 300,

            lesbian_magenta  = "#a50062",
            lesbian_oredange = "#d62900",
            lesbian_white    = "#ffffff",
            lesbian_useSecondSet = five_bars < 2,

            gay_transition = (now / 2000) % 1,

            ratio        = (Math.sin(now / 2000 * Math.PI)) / 2 + 0.5,
            light_purple = { h: 258/360, s: 1, l: 0.84 },
            purple       = { h: 265/360, s: 0.69, l: 0.47 },

            bi_pink   = "#D70071",
            bi_purple = "#9C4E97",
            bi_blue   = "#0035AA",

            trans_pink  = "#f7a8b8",
            trans_blue  = "#55cdfc",
            trans_white = "#ffffff";

        colorMapAnimated.lesbian = lerpRGBs(lesbian_useSecondSet ? lesbian_oredange : lesbian_white, lesbian_useSecondSet ? lesbian_white : lesbian_magenta, (lesbian_useSecondSet ? five_bars : five_bars - 3) / 2);
        colorMapAnimated.gay = HSLtoRGB(gay_transition, 0.75, 0.5);
        colorMapAnimated.bi = [bi_pink, bi_purple, bi_blue][three_bars];
        colorMapAnimated.trans = [trans_blue, trans_pink, trans_white, trans_pink, trans_blue][five_bars];
        colorMapAnimated.magenta = HSLtoRGB(
            light_purple.h + (purple.h - light_purple.h) * ratio,
            light_purple.s + (purple.s - light_purple.s) * ratio,
            light_purple.l + (purple.l - light_purple.l) * ratio
        );

        colorMapAnimated.blue_red = blinker ? colorMap.blue : colorMap.red;
        colorMapAnimated.blue_grey = blinker ? colorMap.blue : colorMap.grey;
        colorMapAnimated.grey_blue = blinker ? colorMap.grey : colorMap.blue;
        colorMapAnimated.red_grey = blinker ? colorMap.red : colorMap.grey;
        colorMapAnimated.grey_red = blinker ? colorMap.grey : colorMap.red;
    },

    hueToRGB = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 0.166) return p + (q - p) * 6 * t;
        if (t < 0.5  ) return q;
        if (t < 0.666) return p + (q - p) * (2/3 - t) * 6;
        return p;
    },
	
    HSLtoRGB = (h, s, l) => {
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hueToRGB(p, q, h + 1/3);
            g = hueToRGB(p, q, h);
            b = hueToRGB(p, q, h - 1/3);
        }
        return '#' +
            Math.round(r * 255).toString(16).padStart(2, '0') +
            Math.round(g * 255).toString(16).padStart(2, '0') +
            Math.round(b * 255).toString(16).padStart(2, '0');
    },

    RGBtoHSL = (rgb) => {
        let r, g, b, h, s, l;

        r = parseInt(rgb.substring(1, 3), 16) / 255;
        g = parseInt(rgb.substring(3, 5), 16) / 255;
        b = parseInt(rgb.substring(5, 7), 16) / 255;

        let cmax = Math.max(r, g, b);
        let cmin = Math.min(r, g, b);
        let deltaC = cmax - cmin;

        // Hue
        switch (true){
            case deltaC == 0: h = 0; break;
            case cmax == r: h = 1/6 * (((g - b) / deltaC) % 6); break;
            case cmax == g: h = 1/6 * ((b - r) / deltaC + 2); break;
            case cmax == b: h = 1/6 * ((r - g) / deltaC + 4); break;
        }
        // Brightness
        l = (cmax + cmin) / 2
        // Saturation
        s = deltaC === 0 ? 0 : deltaC / (1 - Math.abs(2 * l - 1));

        return [h, s, l];
    },

    clamp = (n, lower, upper) => {
        return Math.min(upper, Math.max(lower, n));
    },

	shiftRGBbyHSL = (baseRGB, hue, saturation, brightness, allowBrightnessInvert = false) => {
		let baseHSL = RGBtoHSL(baseRGB);

		let finalHue = (baseHSL[0] + hue) % 1,
			finalSaturation = clamp(baseHSL[1] * saturation, 0, 1),
			finalBrightness = baseHSL[2] + brightness;

		if (allowBrightnessInvert && (finalBrightness > 1 || finalBrightness < 0)) {
			finalBrightness -= brightness * 2;
		}
		finalBrightness = clamp(finalBrightness, 0, 1);

		return HSLtoRGB(finalHue, finalSaturation, finalBrightness);
	},

	getRGBFromColor = (color = new Color, parent = new Color) => {
		// Split into array
		let colorDetails = color.split(" ");

		// Color mirroring
		if (color.base == "-1" || color.base == "mirror") {
			color.base = parent.base;
		}
		if (color.base == "-1" || color.base == "mirror") {
			color.base = '#000'/*gui.color.split(" ")[0]*/; // what the hell is this?
		}

		// Exit if calculated before
		let colorId = color.compiled;
		if (colorId in computedColorCache) return computedColorCache[colorId];

		// get the final, shifted RGB
		let base = getRGBFromCode(colorDetails[0]),
			finalRGB = shiftRGBbyHSL(base, color.hue, color.saturation, color.brightness, color.allowBrightnessInvert);

		// cache if not animated
		if (!animatedColors[color.base]) {
			computedColorCache[colorId] = finalRGB;
		}
		return finalRGB;
	},
	
	lerpRGBs = (a, b, c = 0.5) => {
        if (0 >= c) return a;
        if (1 <= c) return b;
        let f = 1 - c;
        a = parseInt(a.slice(1, 7), 16);
        b = parseInt(b.slice(1, 7), 16);
        return (
            "#" +
            (
                (((a & 0xff0000) * f + (b & 0xff0000) * c) & 0xff0000) |
                (((a & 0x00ff00) * f + (b & 0x00ff00) * c) & 0x00ff00) |
                (((a & 0x0000ff) * f + (b & 0x0000ff) * c) & 0x0000ff)
            )
            .toString(16).padStart(6, "0")
        );
    },

    getRGBFromCode = code => {
        if (/^\#[0-9a-f]{3}$/i.test(code)) {
			return '#' + code[1] + code[1] + code[2] + code[2] + code[3] + code[3];
		}
        if (/^\#[0-9a-f]{6}$/i.test(code)) {
			return code;
		}

        switch (code) {

        // polygons & other entities
            case "6":
            case "egg":
            case "veryLightGrey":
            case "veryLightGray":
                return colorMap.vlgrey;
            case "13":
            case "square":
            case "gold":
                return colorMap.gold;
            case "2":
            case "triangle":
            case "orange":
                return colorMap.orange;
            case "14":
            case "pentagon":
            case "purple":
                return colorMap.purple;
            case "4":
            case "hexagon":
            case "aqua":
                return colorMap.aqua;
            case "5":
            case "crasher":
            case "pink":
                return colorMap.pink;
            case "1":
            case "shiny":
            case "lightGreen":
                return colorMap.lgreen;
            case "0":
            case "legendary":
            case "teal":
                return colorMap.teal;
            case "7":
            case "wall":
            case "lightGrey":
            case "lightGray":
                return colorMap.lgrey;

        // teams
            case "3":
            case "neutral":
            case "yellow":
                return colorMap.yellow;
            case "10":
            case "blue":
                return colorMap.blue;
            case "11":
            case "green":
                return colorMap.green;
            case "12":
            case "red":
                return colorMap.red;
            case "15":
            case "magenta":
                return colorMap.magenta;
            case "25":
            case "mustard":
                return colorMap.mustard;
            case "26":
            case "tangerine":
                return colorMap.tangerine;
            case "27":
            case "brown":
                return colorMap.brown;
            case "28":
            case "cyan":
            case "turquoise":
                return colorMap.cyan;

        // shades of grey/gray
            case "8":
            case "pureWhite":
                return colorMap.guiwhite;
            case "18":
            case "white":
                return colorMap.white;
            case "16":
            case "grey":
            case "gray":
                return colorMap.grey;
            case "17":
            case "darkGrey":
            case "darkGray":
                return colorMap.dgrey;
            case "9":
            case "black":
                return colorMap.black;
            case "19":
            case "pureBlack":
                return colorMap.guiblack;

        // lgbt
            case "lesbian":
                return colorMapAnimated.lesbian;
            case "rainbow":
            case "gay":
                return colorMapAnimated.gay;
            case "bi":
                return colorMapAnimated.bi;
            case "trans":
                return colorMapAnimated.trans;

        // police
            case "flashBlueRed":
                return colorMapAnimated.blue_red;
            case "flashBlueGrey":
            case "flashBlueGray":
                return colorMapAnimated.blue_grey;
            case "flashGreyBlue":
            case "flashGrayBlue":
                return colorMapAnimated.grey_blue;
            case "flashRedGrey":
            case "flashRedGray":
                return colorMapAnimated.red_grey;
            case "flashGreyRed":
            case "flashGrayRed":
                return colorMapAnimated.grey_red;

        // infinity gems
            case "30":
            case "powerGem":
            case "powerStone":
                return "#a913cf";
            case "31":
            case "spaceGem":
            case "spaceStone":
                return "#226ef6";
            case "32":
            case "realityGem":
            case "realityStone":
                return "#ff1000";
            case "33":
            case "soulGem":
            case "soulStone":
                return "#ff9000";
            case "34":
            case "timeGem":
            case "timeStone":
                return "#00e00b";
            case "35":
            case "mindGem":
            case "mindStone":
                return "#ffd300";

        // seasonal rocks
            case "pumpkinStem":
                return "#654321";
            case "pumpkinBody":
                return "#e58100";
            case "tree":
                return "#267524";

        // unsorted
            case "nest":
            case "lavender":
                return colorMap.lavender;
            case "42":
            case "animatedMagenta":
                return colorMapAnimated.magenta;
        }
    };

export { getRGBFromColor };