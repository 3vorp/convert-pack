<div align="center">
	<h1>convert-pack</h1>
	<a href="https://www.npmjs.com/package/convert-pack" target="_blank">
		<img
			alt="npm"
			src="https://img.shields.io/npm/v/convert-pack?color=cb0000&logo=npm&style=flat-square"
		>
	</a>
	<a href="https://github.com/3vorp/convert-pack">
		<img
			alt="GitHub file size in bytes"
			src="https://img.shields.io/github/size/3vorp/convert-pack/index.js?color=43A047&label=Script%20size&logoColor=green&style=flat-square"
		>
	</a>
	<a href="https://github.com/3vorp/convert-pack/blob/main/CHANGELOG.md">
		<img
			alt="Changelog"
			src="https://img.shields.io/badge/Changelog-Read_Here-blue?style=flat-square"
		>
	</a>
	<br>
	<i>Convert a Minecraft resource pack between versions and editions with (relative) ease.</i>
</div>

## CLI Usage

The primary use case for this project is installing the package globally with `sudo npm i -g convert-pack` for the `convert-pack` binary.

The binary uses the syntax:

```sh
convert-pack [--options] <input-dir> <output-dir>
```

The flags `--input-[version|edition]` and `--output-[version|edition]` are used to specify the source and target information required to convert the pack. Abbreviated forms are also available with `--iv`, `--ie`, `--ov`, and `--oe` (note that two hyphens are still used).

Either an edition or version needs to be provided for the input and output, since otherwise there's not enough information to convert the pack. Both can be provided for additional context if needed.

These are all valid uses of the command:

```sh
convert-pack --input-edition java --output-version 1.8.9 ./input ./output
convert-pack --iv 1.12.2 --oe bedrock ./input
convert-pack . ./out --verbose --input-edition bedrock --output-edition java
```

If an edition is not provided, it defaults to Java (since Bedrock doesn't really have versions to choose from). If a version is not provided, it defaults to the latest version for that edition (this is why either a version or edition is needed).

You can see the [CLI help page](./cli_help.txt) or simply run `convert-pack --help` for more information.

## JavaScript Usage

The project has two named exports: `convertPack` and `generateConversionMap`. `convertPack` performs all the I/O operations with file writing and `generateConversionMap` creates the underlying data structure used to convert a resource pack.

`convertPack` takes an object with essentially the same options that the CLI provides and the same underlying assumptions.

```js
const { convertPack } = require("convert-pack");

convertPack({
	inputDir: process.cwd(),
	outputDir: process.cwd() + "./out",
	inputVersion: "1.12.2", // infers java
	outputEdition: "bedrock", // infers bedrock-latest
});
```

`generateConversionMap` only needs the input and output edition to filter relevant paths.

```js
import { generateConversionMap } from "convert-pack";

// bedrock -> java conversion
const conversionMap = await generateConversionMap("bedrock", "java");
```
