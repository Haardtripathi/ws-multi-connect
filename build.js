import { mkdir, writeFile, readFile } from "fs/promises";

async function build() {
    console.log("🚀 Building library...");

    await mkdir("dist", { recursive: true });

    const sourceCode = await readFile("src/WebSocketManager.js", "utf-8");

    // ✅ Convert to ESM format
    const esmCode = sourceCode;

    // ✅ Convert to CommonJS format
    const cjsCode = esmCode
        .replace("export { WebSocketManager };", "module.exports = { WebSocketManager };")
        .replace(/import (.*?) from ["'](.+?)["'];/g, "const $1 = require('$2');");

    await Promise.all([
        writeFile("dist/index.mjs", esmCode),
        writeFile("dist/index.cjs", cjsCode),
    ]);

    console.log("✅ Build complete!");
}

build().catch(console.error);
