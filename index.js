#!/usr/bin/env node

const legoID = process.argv[2];
const numScreenshots = process.argv[3] || 5;

const puppeteer = require("puppeteer");

const timeout = ms => new Promise(res => setTimeout(res, ms));

async function run() {
	const browser = await puppeteer.launch({
		// headless: false, // for debugging
		// slowMo: 250, // slow down by 250ms (to make debugging easier)
		args: ["--allow-file-access-from-files", "--disable-web-security"]
	});
	const page = await browser.newPage();
	await page.goto(`file://${process.cwd()}/three.html`, { waitUntil: "networkidle0" });
	page.addScriptTag({content: `RUN(${legoID});`});
	// Need to do wait to ensure that the model is rendered but this isn't a very good way of doing it
	// Ideally I'd be able to watch for an event like above
	await timeout(500);
	for(let i = 0; i < numScreenshots; i++){
		page.addScriptTag({content: "randomize();"});
		await page.screenshot({
			path: `screenshots/lego_${legoID}_${(i+1)}.png`
		});
	}

	browser.close();
}

run();