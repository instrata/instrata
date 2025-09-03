#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const version = process.env.VERSION;
const repo = process.env.REPO;
if (!version || !repo) {
    console.error("Missing VERSION or REPO env vars");
    process.exit(1);
}

const baseUrl = `https://github.com/${repo}/releases/download/v${version}`;
const artefactsDir = path.join(__dirname, "..", "release-artifacts");

function readSignature(...parts) {
    const sigPath = path.join(artefactsDir, ...parts);
    try {
        return fs.readFileSync(sigPath, "utf-8").trim();
    } catch {
        console.warn(`Signature not found for ${sigPath}.`);
        return "";
    }
}

const updater = {
    version,
    pub_date: new Date().toISOString(),
    platforms: {
        "windows-x86_64": {
            signature: readSignature(`instrata-windows-latest`, `nsis`, `instrata_${version}_x64-setup.exe.sig`),
            url: `${baseUrl}/instrata_${version}_x64-setup.exe`
        },
        "linux-x86_64": {
            signature: readSignature(`instrata-ubuntu-latest`, `appimage`, `instrata_${version}_amd64.AppImage.sig`),
            url: `${baseUrl}/instrata_${version}_amd64.AppImage`
        },
        "darwin-aarch64": {
            signature: readSignature(`instrata-macos-latest`, `macos`, `instrata.app.tar.gz.sig`),
            url: `${baseUrl}/instrata.app.tar.gz`
        },
        // "darwin-x86_64": {
        //     signature: readSignature(`instrata-macos-latest`, `macos`, `instrata_${version}_x86_64.app.tar.gz.sig`),
        //     url: `${baseUrl}/instrata_${version}_x86_64.app.tar.gz`
        // },
    },
};

const outPath = path.join(__dirname, "..", "release-artifacts", "updater.json");
fs.writeFileSync(outPath, JSON.stringify(updater, null, 2) + "\n");
console.log(`Generated updater.json for version ${version}`);
