// addons can also check permissions and add their own ones,
// so if an addon is talking about custom perms or perms that don't exist here,
// they are talking about equivalents to "infiniteLevelUp" attributes,
// except the addon checks it, not the template itself

/*
{
    // main ones
    "key": string       // the token that the person it belongs to will have to put in their token input box
    "nameColor": string // `#RRGGBB`-formatted string that it sets the ingame name color to
    "class": string     // definition reference of the entity that they turn into when they press the developer key
    "note": string      // does nothing, intended to literally just be a comment, even when comments exist

    // permissions
    // anything that is not one of the above 4 are permissions
    // they can be any data type, not just booleans
    "infiniteLevelUp": true, // allows the, to bypass the max level cap and press N to continue levelling beyond it
}
*/

module.exports = [ {
    "key": process.env.TOKEN_1,
    "nameColor": "#ffffff",
    "class": "developer",
    "note": "note here",
    "infiniteLevelUp": true
}, {
    "key": process.env.TOKEN_2,
    "nameColor": "#ffffff",
    "class": "developer",
    "note": "note here",
    "infiniteLevelUp": true
}, {
    "key": process.env.TOKEN_3,
    "nameColor": "#ffffff",
    "class": "developer",
    "note": "note here",
    "infiniteLevelUp": true
}, {
    "key": process.env.TOKEN_4,
    "nameColor": "#ffffff",
    "class": "developer",
    "note": "note here",
    "infiniteLevelUp": true
} ]
