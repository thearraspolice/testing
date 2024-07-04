import { Client } from './shared/liteSockets.js';
import { serverPackages, clientPackages } from './shared/packageSpecs.js';

let client = new Client({
    url: 'ws://localhost:8080/',
    serverPackages,
    clientPackages
});