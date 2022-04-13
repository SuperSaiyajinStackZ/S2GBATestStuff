# S2GBAChecksumRehash

<p align="center">
	<img src="https://github.com/SuperSaiyajinStackZ/S2GBATestStuff/blob/main/resources/s2gbachecksumrehash.png" alt="Box Image"><br>
	<b>Updates the Checksum of a The Sims 2 Game Boy Advance Savefile.</b><br>
</p><hr>

**This is one of the first Tools i started with when i got into deeper The Sims 2 Game Boy Advance things, because i was and i am still interested into Savefile Editing.**

***If you plan to edit the Savefile, then this Script might be useful for you, because editing any data of it will invalidate the Checksum and to know what would happen, see [The Checksum Notes](#checksum-notes).***
<hr>

## Script Credits
- Contributors: [SuperSaiyajinStackZ](https://github.com/SuperSaiyajinStackZ)
- Last Updated: 13.04.2022
- Purpose: Updates the Checksum of a The Sims 2 Game Boy Advance Savefile.
- Type: Savefile Scripts
- Version: v0.2.0
<hr>

## Checksum Location
**This Script fixes invalid Checksums from the Savefile, and the Locations of them are:**
- Settings Header:
	- Checksum Offset: `0xE - 0xF`
	- Calc Range: `0x0 - 0xD` ***and*** `0x10 - 0x17`
- Slot 1:
	- Checksum Offset: `0x1FFE - 0x1FFF`
	- Calc Range: `0x1000 - 0x1FFD`
- Slot 2:
	- Checksum Offset: `0x2FFE - 0x2FFF`
	- Calc Range: `0x2000 - 0x2FFD`
- Slot 3:
	- Checksum Offset: `0x3FFE - 0x3FFF`
	- Calc Range: `0x3000 - 0x3FFD`
- Slot 4:
	- Checksum Offset: `0x4FFE - 0x4FFF`
	- Calc Range: `0x4000 - 0x4FFD`
<hr>

## Checksum Notes
**Here some notes related to the Checksum stuff:**
- ***If the Checksum is invalid on the Settings Header, the Game completely erases the Savedata.***
    - That means, everything would be erased and resetted. There is no way to recover except you have Backups.
- ***If the Checksum is invalid on the Slots, the Game does not display the Slot on the Slot Menu anymore.***
    - The Slot Data however still exist, so you can just use that Script to fix it and let it display again.
<hr>

## Usage
**The main command to run this Script is:**
- `deno run Main.js -f <Filepath> -a <AskForFix y>`

**If you want to avoid the prompt to let it ask you for permission to read / write, then this is the main command:**
- `deno run --allow-read --allow-write Main.js -f <Filepath> -a <AskForFix y>`

**Then here below also the Arguments you'll have to pass:**

**Arguments**
- `-f <Filepath>`: The path to the Savefile. If you use the same way as i do, you can literally do: `-f "../../../binaries/sav.sav"` **(Required)**.
- `-a <AskForFix y>`: Do `-a y` if you want to be asked to fix the Checksum if Invalid, or `-a somethingelse` if you directly want to fix it. It will ask you if you don't provide it **(Optional)**.
<hr>

## Changelog
**v0.1.0**
- Added the Initial Script on 26.03.2022.

**v0.2.0**
- Reworked how the S2GBASAVData stuff works for this Script on 13.04.2022.
<hr>