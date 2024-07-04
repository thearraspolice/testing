function updateCheckbox(checkbox) {
    checkbox.innerText = checkbox.checked ? '✔' : '';
}
document.querySelectorAll('checkbox').forEach(checkbox => {
    checkbox.checked = true;
    updateCheckbox(checkbox);
    checkbox.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        updateCheckbox(checkbox);
    });
});

//literally not needed, but looks cleaner
let getNode = id => document.getElementById(id),
    makeNode = (cssClass, tag = 'div') => {
        let temp = document.createElement(tag);
        temp.classList.add(cssClass);
        return temp;
    },

    //game window
    iframe = getNode('client'),

    container = getNode('container'),
    managerPopup = getNode('managerPopup'),

    //server list
    browser = getNode('browser'),

    //list options
    filters = getNode('filters'),
    sorts = getNode('sorts'),
    favorites = getNode('favorites'),

    filterPopup = getNode('filterPopup'),
    sortPopup = getNode('sortPopup'),
    favoritePopup = getNode('favoritePopup'),

    //info about current selected server
    version = getNode('version'),
    name = getNode('name'),
    description = getNode('description'),
    tags = getNode('tags'),

    //join selected server
    join = getNode('join'),
    list = getNode('list'),

    //list of server ips
    servers = [],

    selectedServer = 0,
    selectedPopup = null,

    getSelected = () => servers.find(server => server.index == selectedServer);

//client wants its src to be renamed
window.onmessage = ({ data: url }) => {
    console.log('changing iframe src:', url);
    iframe.src = url;
};

window.onresize = () => {
    iframe.width = window.innerWidth;
    iframe.height = window.innerHeight;
};

let optionLists = {
    sortType: 'index',
    sortOrder: 'ascending'
};
document.querySelectorAll('options').forEach(options => {
    Array.from(options.children).forEach(option => {
        option.addEventListener('click', () => {
            getNode(optionLists[options.id]).classList.remove('selectedOption');
            option.classList.add('selectedOption');
            optionLists[options.id] = option.id;
            sort();
        });
    });
});

getNode('tagsInclude').onupdate = filter;
getNode('tagsExclude').onupdate = filter;
getNode('hasApp').onupdate = filter;
getNode('hasBrowser').onupdate = filter;
getNode('fullServers').onupdate = filter;
getNode('maxPing').onupdate = filter;
getNode('minPlayers').onupdate = filter;

function switchPopup(element) {
    filterPopup.style.display = 'none';
    sortPopup.style.display = 'none';
    favoritePopup.style.display = 'none';
    if (selectedPopup == element) {
        selectedPopup = null;
        managerPopup.hidden = true;
    } else {
        managerPopup.hidden = false;
        element.style.display = 'flex';
        selectedPopup = element;
    }
}

filters.onclick = () => switchPopup(filterPopup, 1);
sorts.onclick = () => switchPopup(sortPopup, 2);
favorites.onclick = () => switchPopup(favoritePopup, 3);

function getValueOfId(id) {
    let element = getNode(id);
    return 'checkbox' === element.tagName.toLowerCase() ? !!element.checked : element.value;
}

function filter() {
    let tagsInclude = getValueOfId('tagsInclude').split(/, ?/),
        tagsExclude = getValueOfId('tagsExclude').split(/, ?/),
        hasApp = getValueOfId('hasApp'),
        hasBrowser = getValueOfId('hasBrowser'),
        fullServers = getValueOfId('fullServers'),
        maxPing = parseInt(getValueOfId('maxPing')),
        minPlayers = parseInt(getValueOfId('minPlayers'));

    for (let server of servers) {
        server.mainContainer.hidden = !(

            (!hasApp || server.hasApp) &&
            (!hasBrowser || server.hasBrowser) &&

            (!maxPing || server.ping <= maxPing) &&
            (!minPlayers || server.players >= minPlayers) &&
            (!fullServers || server.maxPlayers >= server.players) &&

            (!tagsInclude || tagsInclude.every(tag => server.tags.includes(tag))) &&
            (!tagsInclude || tagsExclude.every(tag => !server.tags.includes(tag)))
        );
    }
}

function sort() {
    let sortType = optionLists.sortType, // 'index' / 'players' / 'ping'
        sortAscending = optionLists.sortOrder == 'ascending';
    servers.sort((a, b) => (a[sortType] - b[sortType]) * (sortAscending ? -1 : 1));

    // TrollgeScript
    let temp = makeNode('');
    for (let { element: { mainContainer } } of servers) {
        temp.append(mainContainer);
        browser.append(mainContainer);
    }
}

// function favorites() {}

join.onclick = () => {
    for (let { motdSocket } of servers) {
        if (motdSocket.readyState === motdSocket.OPEN) {
            motdSocket.close();
        }
    }
    let { secure, ip } = getSelected();
    console.log('setting iframe src\nip:', ip, '\nsecure:', secure);
    iframe.src = `${secure ? 'https' : 'http'}://${ip}/app`;
    iframe.style.display = 'block';
    container.style.display = 'none';
};

list.onclick = () => {
    for (let { motdSocket } of servers) {
        if (motdSocket.readyState === motdSocket.OPEN) {
            motdSocket.close();
        }
    }
    let { secure, ip } = getSelected();
    console.log('redirecting to browser\nip:', ip, '\nsecure:', secure);
    location.href = `${secure ? 'https' : 'http'}://${ip}/browser`;
};

class DOMServerListItem {
    constructor (hasApp, hasBrowser, secure, ip, motdDefault, index) {
        this.ip = ip;
        this.secure = secure;
        this.index = index;
        this.tags = [];
        this.debug = [];
        this.hasApp = hasApp;
        this.hasBrowser = hasBrowser;
        this.ping = 0;
        this.players = 0;
        this.maxPlayers = 0;

        //DOM stuff
        this.mainContainer = makeNode('mainContainer');
        this.textContainer = makeNode('textContainer');
        this.statsContainer = makeNode('statsContainer');
        this.rightSideContainer = makeNode('rightSideContainer');
        this.debugLog = makeNode('debugLog');
        this.debugButton = makeNode('debugButton');
        this.icon = makeNode('icon', 'img');
        this.name = makeNode('name');
        this.description = makeNode('description');
        this._ping = makeNode('ping');
        this._players = makeNode('players');
        this.version = makeNode('version');
        this.debugLog.innerHTML = this.ip + '<br><br>Loading...';
        this.icon.src = `${this.secure ? 'https' : 'http'}://${ip}/iconBrowser.png`;
        this.icon.onerror = () => this.error("Server Icon didn't load successfully");
        this.textContainer.append(this.name, this.description);
        this.statsContainer.append(this.version, this._players, this._ping);
        this.rightSideContainer.append(this.debugButton, this.statsContainer);
        this.mainContainer.append(this.debugLog, this.icon, this.textContainer, this.rightSideContainer);
        this.mainContainer.addEventListener('click', () => this.select());
        browser.append(this.mainContainer);
        if (motdDefault) {
            motdDefault.ping = '??';
            motdDefault.players = '??';
            motdDefault.maxPlayers = '??';
            this.setMOTD(motdDefault);
            this.debug.push('Using default motd');
        } else {
            this.setDebugMode(true);
        }
    }
    select () {
        getSelected().element.mainContainer.classList.remove('selected');
        this.mainContainer.classList.add('selected');
        selectedServer = this.index;

        tags.innerText = this.tags.join(', ');
        name.innerHTML = this.name.innerHTML;
        version.innerHTML = this.version.innerHTML;
        description.innerHTML = this.description.innerHTML;
        join.style.visibility = this.hasApp ? 'visible' : 'hidden';
        list.style.visibility = this.hasBrowser ? 'visible' : 'hidden';
    }
    setDebugMode(enable) {
        this.debugLog.hidden = !enable;
        this.mainContainer.hidden = enable;
    }
    setMOTD (motd) {
        this.setDebugMode(false);
        this.name.innerHTML = toColored(motd.name);
        this.description.innerHTML = toColored(motd.description);
        this._ping.innerText = motd.ping + 'ms Ping';
        this.version.innerText = motd.version;
        this._players.innerText = motd.players + '/' + motd.maxPlayers + ' Players';
        this.tags = motd.tags.map(tag => tag.toLowerCase().replace(/[^a-z0-9]/g, ''));
        this.ping = motd.ping;
        this.players = motd.players;
        this.maxPlayers = motd.maxPlayers;
        if (motd.icon) this.icon.src = motd.icon;
    }
    log (msg) {
        this.debug.push(msg);
        this.debugLog.innerHTML = this.ip + '<br><br>' + this.debug.join('<br>');
    }
    socketClosed () {
        if (this.debug.length || this.debugLog.hidden) return;
        this.log('This server has MOTD disabled.');
    }
    error (msg) {
        this.log('Error: ' + msg);
    }
}

fetch(`${location.protocol}//${location.host}/servers.json`).then(x => x.json()).then(fetchedServers => {
    browser.innerHTML = '';
    for (let { hasApp, hasBrowser, secure, ip, motdDefault } of fetchedServers) {
        hasApp = !!hasApp;
        hasBrowser = !!hasBrowser;
        let element = new DOMServerListItem(hasApp, hasBrowser, secure, ip, motdDefault, servers.length),
            motdSocket = new WebSocket(`${secure ? 'wss' : 'ws'}://${ip}/motd`),

            listEntry = { hasApp, hasBrowser, secure, ip, motdSocket, element, motdDefault, index: servers.length };

        motdSocket.pings = [];
        motdSocket.onmessage = ({ data: str }) => {
            try {
                let data = str.split(' ');
                if (data.length < 3) throw 0;

                let reqSent = parseInt(data[0], 16),
                    askAgainInMS = parseInt(data[1]),
                    motd = JSON.parse(data.slice(2).join(' '));
                if (isNaN(reqSent)) throw 1;
                if (isNaN(askAgainInMS)) throw 2;

                motd.ping = (Date.now() - reqSent) >> 1;
                if (motd.ping < 0) throw 3;

                element.setMOTD(motd);
                setTimeout(() => motdSocket.readyState === motdSocket.OPEN && motdSocket.send(Date.now().toString(16)), askAgainInMS);
            } catch (err) {
                switch (err) {
                    case 0: return element.error('received motdSocket message made no sense');
                    case 1: return element.error('received motdSocket message had an invalid reqSent in it');
                    case 2: return element.error('received motdSocket message had an invalid askAgainInMS in it');
                    case 3: return element.error('received motdSocket message was sent from the future?');
                    default: return element.error('received motdSocket message had invalid JSON in it');
                }
            }
        };
        motdSocket.onopen = () => motdSocket.send(Date.now().toString(16));
        motdSocket.onclose = () => element.socketClosed();
        motdSocket.onerror = () => element.error('motdSocket initiation failed');

        servers.push(listEntry);
    }

    getSelected().motdSocket.addEventListener('message', () => getSelected().element.select(), { once: true });
});

//most of this is drawText from the game client but modified
function toColored(rawText) {
    let textArrayRaw = rawText.split('§'),
        textArray = [];
    if (!(textArrayRaw.length & 1)) {
        textArrayRaw.unshift('');
    }
    while (textArrayRaw.length) {
        let first = textArrayRaw.shift();
        if (!textArrayRaw.length) {
            textArray.push(first);
        } else if (textArrayRaw[1]) {
            textArray.push(first, textArrayRaw.shift());
        } else {
            textArrayRaw.shift();
            textArray.push(first + '§' + textArrayRaw.shift(), textArrayRaw.shift());
        }
    }

    let color = 'reset',
        final = '';
    while (textArray.length) {
        let str = textArray.shift();

        // odd index = this is a color to set the fill style to
        if (textArray.length & 1) {
            color = str;

        //completely horrid
        } else {
            let textSegment = document.createElement('span')
            textSegment.innerText = str;
            if (color && color != 'reset') {
                textSegment.style.color = color;
            }
            final += textSegment.outerHTML;
        }
    }

    return final;
}