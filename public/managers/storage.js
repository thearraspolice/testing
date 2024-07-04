const { EventTargetSUB } = require("../classes/eventsSUB.js");

let local = window.localStorage,
storage = new Proxy({ local, events: new EventTargetSUB() }, {
    get (_, prop) {
        return local.getItem(prop);
    },
    set (_, prop, value) {
        let abort;

        events.emit('change', {
            setting: prop,
            newValue: value,
            oldValue: local.getItem(prop),
            preventDefault: () => abort = true
        });

        if (!abort) {
            local.setItem(prop, value);
        }
    }
});

// get rid of the public reference to localStorage, it's ours now.
delete window.localStorage;

export { storage };