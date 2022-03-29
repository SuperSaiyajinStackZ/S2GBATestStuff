# S2GBAItemInfoFetcher

<p align="center">
	<img src="https://github.com/SuperSaiyajinStackZ/S2GBATestStuff/blob/main/resources/s2gbaiteminfofetcher.png" alt="Box Image"><br>
	<b>Fetch and Extract Item Info Data from a The Sims 2 Game Boy Advance ROM.</b><br>
</p><hr>

**This is the second Tool i did related to the ROM.**
- It extracts Item Information from all the Items of each Language from the ROM to `.txt` files in the following format:
```
=== 000 ===
Item Name:      Name
Item Name ID:   Hexadecimal ID
Item Buy Price: Decimal Price
Unknown[0]:     First Unknown Hexadecimal Value
Unknown[1]:     Second Unknown Hexadecimal Value
Unknown[2]:     Third Unknown Hexadecimal Value

=== 226 ===
Item Name:      Name
Item Name ID:   Hexadecimal ID
Item Buy Price: Decimal Price
Unknown[0]:     First Unknown Hexadecimal Value
Unknown[1]:     Second Unknown Hexadecimal Value
Unknown[2]:     Third Unknown Hexadecimal Value
```

**It creates the following files:**
- Dutch-Item-Info.txt
- English-Item-Info.txt
- French-Item-Info.txt
- German-Item-Info.txt
- Italian-Item-Info.txt
- Spanish-Item-Info.txt


***This Script relies on `S2GBAStringFetcher.js`, so make sure it is also in it's proper Location when using this Script.***
<hr>

## Script Credits
- Contributors: [SuperSaiyajinStackZ](https://github.com/SuperSaiyajinStackZ)
- Last Updated: 27.03.2022
- Purpose: Fetch and Extract Item Info Data from a The Sims 2 Game Boy Advance ROM.
- Type: ROM Scripts
- Version: v0.1.0
<hr>

## Usage
**The main command to run this Script is:**
- `deno run Main.js -f <Filepath> -o <OutputFolder>`

**If you want to avoid the prompt to let it ask you for permission to read / write, then this is the main command:**
- `deno run --allow-read --allow-write Main.js -f <Filepath> -o <OutputFolder>`

**Then here below also the Arguments you'll have to pass:**

**Arguments**
- `-f <Filepath>`: The path to the ROM. If you use the same way as i do, you can literally do: `-f "../../../binaries/rom.gba"` **(Required)**.
- `-o <OutputFolder>`: The folder to where to extract the Item Info Data to. You can just use `-o "Item"` to extract it into the current Directory inside `Item/` **(Required)**.
<hr>

## Changelog
**v0.1.0**
- Added the Initial Script on 27.03.2022.
<hr>