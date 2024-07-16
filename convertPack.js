const { copyFile, mkdir } = require("fs/promises");
// why is there no async exists function
const { existsSync } = require("fs");

if (!Object.groupBy || typeof Object.groupBy !== "function")
	return console.error(`You need a newer version of Node.js to run this program! (>=21.0)`);

async function getLatestVersion(edition) {
	const versions = await fetch(`https://api.faithfulpack.net/v2/settings/versions`).then((res) =>
		res.json(),
	);
	return versions[edition][0];
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

	// group again by edition
	return (
		Object.values(grouped)
			.map((paths) => Object.groupBy(paths, ({ edition }) => edition))
			// check that all editions needed are present
			.filter((obj) => obj[inputEdition]?.length && obj[outputEdition]?.length)
	);
}

module.exports = async function convertPack(
	DEBUG,
	{ inputDir, outputDir, inputEdition, outputEdition, inputVersion, outputVersion } = {},
) {
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
		conversionMap.map((paths) => {
			// get first match for version
			const inputPath = paths[inputEdition].find((path) =>
				path.versions.includes(inputVersion),
			);
			if (!inputPath) return Promise.resolve();
			const imageToCopy = `${inputDir}/${inputPath.name}`;
			// check that image exists before writing it
			if (!existsSync(imageToCopy)) {
				if (DEBUG) console.log(`Can't find ${imageToCopy}, skipping...`);
				return Promise.resolve();
			}
			return Promise.all(
				paths[outputEdition]
					// get all matching paths for version
					.filter((path) => path.versions.includes(outputVersion))
					.map(({ name: outputPath }) => {
						// create parent directory if it doesn't exist yet
						const dir = `${outputDir}/${outputPath.slice(
							0,
							outputPath.lastIndexOf("/"),
						)}`;
						const prom = existsSync(dir)
							? Promise.resolve()
							: mkdir(dir, { recursive: true });
						return prom
							.then(() => copyFile(imageToCopy, `${outputDir}/${outputPath}`))
							.then(() => {
								if (DEBUG) console.log(`Copied ${inputPath.name} to ${outputPath}`);
							});
					}),
			);
		}),
	);
	console.log(`Finished copying files to ${outputDir}!`);
};
