# Open Source Arras (APS++)

**Open Source Arras is beta software.** This build is **not** representative of the final product. Expect bugs and missing features.

## Setup Guide (Localhost)

This guide covers setting up your server on your own hardware and only supports PCs running up-to-date versions of Windows/macOS/Linux.

You'll first need to install [Node.js](https://nodejs.org). It doesn't matter if you pick the LTS or Latest version, they'll both work fine.

Once `Node.js` is installed, run the command `npm i ws`. This will install the WebSocket library that Open Source Arras uses.

After installing `ws`, [download the source code of the latest release of Open Source Arras](https://github.com/Taureon/aps-plus-plus/releases). Extract it once it's downloaded and open either `run.bat` (if you're on Windows) or `run.sh` (if you're not). If there aren't any errors, your server will start up. Go to `localhost:26301` in your favourite web browser (keep the terminal window open, closing it will shut down the server) to play.

[If you need a more detailed guide, click here for a step by step list.](https://github.com/Taureon/aps-plus-plus/wiki/Frequently-Asked-Questions#how-do-i-set-up-my-server)

If you want to stay up to date, fork this template, download a git client, and sync the fork whenever there's a major update.

## Setup Guide (Webhost)

Don't have a supported device or don't want to mess around with localhost? Get a webhost to do the dirty work for you.

This guide will specifically go through setting up your server on [Glitch](https://glitch.com). These steps should be similar you use Replit or another webhost.

Click the "New project" button at the top-right of the dashboard, and select "Import from GitHub". When prompted for the URL of the repository, type in `https://github.com/Taureon/aps-plus-plus.git`.

Navigate to `server/config.js` and replace `localhost:26301` with `your-project.glitch.me` (replace `your-project` with the actual name of your project, it should be above settings).

If you're experiencing issues when trying to launch the project, go to `package.json` and replace `"node": "18.x"` with `"node": "16.x"`.

After doing that, your server should be ready!

## Useful Tools
- [Create a custom shape](https://arras.io/ext/custom-shape)
- [Create a custom tank](https://dogeiscut.github.io/Arras-Tank-Builder/)  (This tool is somewhat outdated, please make sure to convert the generated tank code!)
  - [WIP update to this tool](https://github.com/DogeisCut/Arras.io-Entity-Designer-v2)
- [Create a custom theme](https://codepen.io/road-to-100k/full/GRpvMzb)
- [Random Tank Generator](https://perchance.org/chomp-arras-gen)

## Other Links
- [Our Discord server](https://discord.gg/kvCAZfUCjy)

*p.s. if something goes terribly wrong its not our fault*
