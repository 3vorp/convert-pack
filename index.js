const { copyFile, mkdir } = require("node:fs/promises");
// why is there no async exists function
const { existsSync } = require("node:fs");
const { join } = require("node:path");

async function getLatestVersion(edition) {
	const versions = await fetch(
		`https://api.faithfulpack.net/v2/versions/edition/${edition}`,
	).then((res) => res.json());
	return versions[0];
}

async function generateConversionMap(inputEdition, outputEdition) {
	const paths = await fetch("https://api.faithfulpack.net/v2/paths/raw")
		.then((res) => res.json())
		.then((res) => Object.values(res));
	const uses = await fetch("https://api.faithfulpack.net/v2/uses/raw").then((res) => res.json());

	// add the edition to paths by taking parent use
	const editionPaths = paths.map(({ name, use, versions }) => ({
		name,
		versions,
		texture: parseInt(use),
		// object lookup is much faster than find
		edition: uses[use].edition,
	}));

	// group paths by texture ID
	const grouped = Object.groupBy(editionPaths, ({ texture }) => texture);

	// group again by edition and only keep relevant paths
	return Object.values(grouped)
		.map((paths) => Object.groupBy(paths, ({ edition }) => edition))
		.filter((obj) => obj[inputEdition]?.length && obj[outputEdition]?.length);
}

async function convertPack({
	verbose,
	inputDir,
	outputDir,
	inputEdition,
	outputEdition,
	inputVersion,
	outputVersion,
} = {}) {
	// if there's a version and no edition it's probably java
	if (!inputEdition && inputVersion) inputEdition = "java";
	if (!outputEdition && outputVersion) outputEdition = "java";

	// if there's no version assume latest
	if (inputEdition && (!inputVersion || inputVersion === "latest"))
		inputVersion = await getLatestVersion(inputEdition);

	if (outputEdition && !(outputVersion || outputVersion === "latest"))
		outputVersion = await getLatestVersion(outputEdition);

	console.log("Creating conversion map...");

	const conversionMap = await generateConversionMap(inputEdition, outputEdition);
	console.log("Starting conversion process...");

	await Promise.all(
		conversionMap.flatMap((paths) => {
			// get first match for version
			const inputPath = paths[inputEdition].find((path) =>
				path.versions.includes(inputVersion),
			);
			if (!inputPath) return Promise.resolve();
			const imageToCopy = join(inputDir, inputPath.name);
			// check that image exists before writing it
			if (!existsSync(imageToCopy)) {
				if (verbose) console.log(`Can't find ${imageToCopy}, skipping...`);
				return Promise.resolve();
			}

			// get all matching paths for version and copy them to the correct location
			return paths[outputEdition]
				.filter((path) => path.versions.includes(outputVersion))
				.map(async ({ name: outputPath }) => {
					// faithful paths always use forward slashes, don't use path.sep
					const dir = join(outputDir, outputPath.slice(0, outputPath.lastIndexOf("/")));

					// create parent directory if it doesn't exist yet
					if (!existsSync(dir)) await mkdir(dir, { recursive: true });
					await copyFile(imageToCopy, join(outputDir, outputPath));
					if (verbose) console.log(`Copied ${inputPath.name} to ${outputPath}`);
				});
		}),
	);
	console.log(`Finished copying files to ${outputDir}!`);
}

module.exports = {
	generateConversionMap,
	convertPack,
};
