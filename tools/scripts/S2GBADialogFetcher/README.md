# S2GBADialogFetcher

<p align="center">
	<img src="https://github.com/SuperSaiyajinStackZ/S2GBATestStuff/blob/main/resources/s2gbadialogfetcher.png" alt="Box Image"><br>
	<b>Fetch and Extract the Dialogs from a The Sims 2 Game Boy Advance ROM.</b><br>
</p><hr>

- It extracts all the `881` Dialogs of each language to `.txt` files in the following format:
```
=== Dialog 000 ===
Message 1
Message 2

=== Dialog 880 ===
Message 1
Message 2
```

**It creates the following files:**
- Dutch-Dialogs.txt
- English-Dialogs.txt
- French-Dialogs.txt
- German-Dialogs.txt
- Italian-Dialogs.txt
- Spanish-Dialogs.txt
<hr>

## Script Credits
- Contributors: [SuperSaiyajinStackZ](https://github.com/SuperSaiyajinStackZ)
- Last Updated: 13.04.2022
- Purpose: Fetch and Extract the Dialogs from a The Sims 2 Game Boy Advance ROM.
- Type: ROM Scripts
- Version: v0.2.0
<hr>

## Usage
**The main command to run this Script is:**
- `deno run Main.js -f <Filepath> -o <OutputFolder>`

**If you want to avoid the prompt to let it ask you for permission to read / write, then this is the main command:**
- `deno run --allow-read --allow-write Main.js -f <Filepath> -o <OutputFolder>`

**Then here below also the Arguments you'll have to pass:**

**Arguments**
- `-f <Filepath>`: The path to the ROM. If you use the same way as i do, you can literally do: `-f "../../../binaries/rom.gba"` **(Required)**.
- `-o <OutputFolder>`: The folder to where to extract the Dialogs to. You can just use `-o "Dialogs"` to extract them into the current Directory inside `Dialogs/` **(Required)**.
<hr>

## Changelog
**v0.1.0**
- Added the Initial Script on 04.04.2022.

**v0.2.0**
- Reworked how the S2GBAROMData stuff works for this Script on 13.04.2022.
<hr>

## Planned
- Fetch who is speaking a dialog.
<hr>