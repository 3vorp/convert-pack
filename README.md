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

## What is this project?

`convert-pack` is a simple set of tools that lets you convert a pack from any edition and version to any other edition and version. It's not just a simple Java to Bedrock converter—if you want to go from Bedrock to 1.12.2, or 1.8.9 to the latest version, or vice versa for either, this tool has got you covered.

This tool is optimized for pack developers trying to port their existing projects, and as such won't make any suboptimal decisions that many other converters make for the sake of filling in missing textures; instead **only identical textures will ever be copied**. This leaves you free to do whatever you want with version or edition-exclusive textures without worrying about them being broken or not showing up under a missing texture tool.

The program is also designed to never need updating with new versions, since it pulls all texture-related information from the [Faithful API](https://api.faithfulpack.net/docs) online. As such, it does require an internet connection to work, but has the benefit of being very lightweight since no data is stored on your computer.

## CLI Usage

The primary use case for this project is installing the package globally for the `convert-pack` binary. You may need `sudo` or to run your terminal as administrator to install global packages.

```sh
npm i -g convert-pack
```

The binary uses the syntax:

```sh
convert-pack [--options] <input-dir> <output-dir>
```

If the package hasn't or can't been installed globally, you may need to use `npx`.

```sh
npx convert-pack [--options] <input-dir> <output-dir>
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

You can see the `man` page or run `convert-pack --help` for more information.

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

// bedrock -> java conversion map
const conversionMap = await generateConversionMap("bedrock", "java");
```

## Credits

This project is powered by the Faithful texture database, and would not be possible without their constantly updated, comprehensive texture data and public API (https://faithfulpack.net).

Copyright (C) 2024 Evorp. Licensed under AGPL-3.0.
