#!/usr/bin/env node

const { existsSync, readFileSync } = require("fs");
const convertPack = require("./convertPack");
module.exports = convertPack;

const args = require("minimist")(process.argv.slice(2), {
	alias: {
		"input-version": ["iv"],
		"output-version": ["ov"],
		"input-edition": ["ie"],
		"output-edition": ["oe"],
		verbose: ["v"],
		help: ["h"],
	},
	boolean: ["verbose"],
});

if (args.help) {
	const helpPage = readFileSync("./README.md", { encoding: "utf8" });
	console.log(helpPage);
	process.exit(0);
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
	console.error("Input folder doesn't exist!");
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
