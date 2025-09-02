#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const version = process.env.VERSION;
if (!version) {
    console.error("Missing VERSION env var");
    process.exit(1);
}

const configPath = path.join(__dirname, "..", "src-tauri", "tauri.conf.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

config.version = version;

fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
console.log(`Updated tauri.conf.json version to ${version}`);
