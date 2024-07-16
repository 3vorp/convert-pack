const { existsSync } = require("fs");
const { sep } = require("path");
const convertPack = require("./convertPack");
module.exports = convertPack;

const args = require("minimist")(process.argv.slice(2), {
	alias: {
		"input-version": ["iv"],
		"output-version": ["ov", "v"],
		"input-edition": ["ie"],
		"output-edition": ["e", "oe"],
		debug: ["verbose"],
	},
	boolean: ["debug"],
});

const handlePath = (path) => (path.startsWith("/") ? path : process.cwd() + sep + path);

const DEFAULT_INPUT_PATH = "";
const DEFAULT_OUTPUT_PATH = `out`;

const options = {
	inputDir: handlePath(args._?.[0] || DEFAULT_INPUT_PATH),
	outputDir: handlePath(args._?.[1] || DEFAULT_OUTPUT_PATH),
	inputEdition: args.ie,
	outputEdition: args.oe,
	inputVersion: args.iv,
	outputVersion: args.ov,
};

// validation stuff
if (!options.inputDir || !existsSync(options.inputDir))
	return console.error("Input folder doesn't exist!");

if (!options.outputDir) return console.error("No output directory specified!");

if (!options.inputEdition && !options.inputVersion)
	return console.error(
		"Not enough input information provided! (edition or version required at minimum)",
	);

if (!options.outputEdition && !options.outputVersion)
	return console.error(
		"Not enough output information provided! (edition or version required at minimum)",
	);

convertPack(args.debug, options);
