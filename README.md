convert-pack - Convert a Minecraft resource pack between versions and editions with (relative) ease.

Examples:
	convert-pack --input-edition java --output-version 1.8.9 ./input ./output
	convert-pack --iv 1.12.2 --oe bedrock ./input
	convert-pack . ./out --verbose --input-edition bedrock --output-edition java

Arguments:
	--help | -h: Show this page.
	--verbose | -v: Log every file being converted.
	--input-version | --iv: Set the input version.
	--input-edition | --ie: Set the input edition.
	--output-version | --ov: Set the target version.
	--output-edition | --oe: Set the target edition.

Notes:
	Either an edition or version needs to be provided for the input and output, since otherwise there's not enough information to convert the pack. Both can be provided for additional context if needed.

	If an edition is not provided, it defaults to Java (since Bedrock doesn't really have versions to choose from). If a version is not provided, it defaults to the latest version for that edition (this is why either a version or edition is needed).

This project is licensed under AGPL v3. View the project source at https://github.com/3vorp/convert-pack.
Copyright (C) 2024 Evorp
