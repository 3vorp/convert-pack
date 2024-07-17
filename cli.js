#!/usr/bin/env node

const { existsSync, readFileSync } = require("fs");
const { resolve } = require("path");
const { convertPack } = require(".");

const args = require("minimist")(process.argv.slice(2), {
	alias: {
		"input-version": ["iv"],
		"output-version": ["ov"],
		"input-edition": ["ie"],
		"output-edition": ["oe"],
		verbose: ["v"],
		help: ["h"],
	},
	boolean: ["verbose", "help"],
});

if (args.help) {
	const manPage = readFileSync(resolve(__dirname, "./convert-pack.1"), { encoding: "utf8" });
	// very quick solution to support man pages and a help menu with the same file
	const helpPage = manPage.replace(/\n\.br\n/g, "\n");
	console.log(helpPage);
	process.exit();
}

if (!Object.groupBy || typeof Object.groupBy !== "function") {
	console.error(`You need a newer version of Node.js to run this program! (>=21.0)`);
	process.exit(1);
}

const options = {
	inputDir: args._?.[0],
	outputDir: args._?.[1],
	inputEdition: args.ie,
	outputEdition: args.oe,
	inputVersion: args.iv,
	outputVersion: args.ov,
	verbose: args.verbose,
};

// validation stuff
if (!args._?.[0] || !existsSync(args._?.[0])) {
	console.error(`Input folder doesn't exist! (received "${args._?.[0]}")`);
	process.exit(1);
}

if (!args._?.[1]) {
	console.error("No output directory specified!");
	process.exit(1);
}

if (!options.inputEdition && !options.inputVersion) {
	console.error(
		"Not enough input information provided! (edition or version required at minimum)",
	);
	process.exit(1);
}

if (!options.outputEdition && !options.outputVersion) {
	console.error(
		"Not enough output information provided! (edition or version required at minimum)",
	);
	process.exit(1);
}

convertPack(options);
