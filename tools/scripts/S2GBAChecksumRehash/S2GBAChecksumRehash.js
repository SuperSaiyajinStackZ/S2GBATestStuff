/*
*   This file is part of S2GBATestStuff
*   Copyright © 2022 SuperSaiyajinStackZ
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
*       * Requiring preservation of specified reasonable legal notices or
*         author attributions in that material or in the Appropriate Legal
*         Notices displayed by works containing it.
*       * Prohibiting misrepresentation of the origin of that material,
*         or requiring that modified versions of such material be marked in
*         reasonable ways as different from the original version.
*/

import { S2GBASAVData } from "../../common/S2GBASAVData.js";


export class S2GBAChecksumRehash {
	/*
		The constructor of this Script-Class.

		Path: The path to the Savefile.
		Load: If loading the data (Set to false, if you have multiple Scripts and only load it 1 time).
	*/
	constructor(Path, Load = true) {
		this.Data = new S2GBASAVData(Path, Load);
		this.Good = this.Data.IsValid();
	}

	/* Some useful returns. */
	IsGood() { return this.Good; }

	/*
		Calculates the checksum of a Type.

		Type: The type to calculate...
			- 0: Settings Header
			- 1-4: Slots
	*/
	Calc(Type) {
		let Checksum = 0x0;

		if (this.IsGood() && Type >= 0x0 && Type <= 0x4) {
			switch(Type) {
				case 0x0: // Settings.
					for (let Idx = 0x0; Idx < 0x18 / 2; Idx++) {
						if (Idx == 0xE / 2) continue;

						Checksum = (Checksum + this.Data.ReadData("uint16_t", Idx * 2)) % 0x10000;
					}
					break;

				case 0x1:
				case 0x2:
				case 0x3:
				case 0x4: // Slots.
					if (this.SlotExist(Type)) {
						for (let Idx = (Type * 0x1000) / 2; Idx < ((Type * 0x1000) + 0xFFE) / 2; Idx++) Checksum = (Checksum + this.Data.ReadData("uint16_t", Idx * 2)) % 0x10000;
					}
					break;
			}
		}

		return (0x10000 - Checksum) % 0x10000
	}

	/*
		Returns, if the Checksum of a Type is already valid.

		Type: The type to check...
			- 0: Settings Header
			- 1-4: Slots
	*/
	Valid(Type) {
		if (this.IsGood() && Type >= 0x0 && Type <= 0x4) {
			switch(Type) {
				case 0x0: // Settings.
					return this.Data.ReadData("uint16_t", 0xE) == this.Calc(Type);

				case 0x1:
				case 0x2:
				case 0x3:
				case 0x4: // Slots.
					if (this.SlotExist(Type)) return this.Data.ReadData("uint16_t", (Type * 0x1000) + 0xFFE) == this.Calc(Type);
			}
		}

		return false;
	}

	/*
		Returns, if a Slot exists in the Savefile.

		Slot: The Slot to check ( 1 - 4 ).
	*/
	SlotExist(Slot) {
		if (this.IsGood() && Slot >= 0x1 && Slot <= 0x4) return this.Data.ReadData("uint8_t", (Slot * 0x1000) + 0xD) != 0x0;
		return false;
	}

	/*
		Fix the Checksum of a Type.

		Type: The type to fix...
			- 0: Settings Header
			- 1-4: Slots
	*/
	FixChecksum(Type) {
		if (this.IsGood() && Type >= 0x0 && Type <= 0x4) {
			switch(Type) {
				case 0x0: // Settings.
					this.Data.WriteData("uint16_t", 0xE, this.Calc(Type));
					break;

				case 0x1:
				case 0x2:
				case 0x3:
				case 0x4: // Slots.
					this.Data.WriteData("uint16_t", (Type * 0x1000) + 0xFFE, this.Calc(Type));
					break;
			}
		}
	}

	/*
		A wrapper for S2SAVData.WriteBack().

		Path: The path to where to write the file.
	*/
	WriteBack(Path) { this.Data.WriteBack(Path, false); }
};


/* Argument Parser for this Script. */
function ParseArgs() {
	let ArgStruct = {
		"Filename": "",
		"AskForFix": true
	};

	const Args = Deno.args;

	if (Args.length > 0x0) {
		let Type = "";

		for (let Idx = 0x0; Idx < Args.length; Idx++) {
			switch(Type) {
				case "-a": // Ask for a Fix.
					ArgStruct.AskForFix = (Args[Idx] == "y");
					Type = "";
					break;

				case "-f": // Filename.
					ArgStruct.Filename = Args[Idx];
					Type = "";
					break;

				default: // Fetch Type.
					Type = Args[Idx];
					break;
			}
		}
	}

	return ArgStruct;
}

const Args = ParseArgs();
console.log(
	"=====================================================================\n" +
	"S2GBAChecksumRehash v0.1.0 by SuperSaiyajinStackZ - Copyright © 2022\n" +
	"Purpose: Updates the Checksum of a The Sims 2 Game Boy Advance Savefile.\n" +
	"Arguments: -f <Filepath> -a <AskForFix y>\n" +
	"Detected Arguments:\n" +
	"-f: " + (Args.Filename == "" ? "Not provided" : Args.Filename) + "\n" +
	"-a: " + (Args.AskForFix ? "Yes" : "No") + "\n" +
	"=====================================================================\n\n"
);

/* Main function. */
if (Args.Filename != "") {
	let Instance = new S2GBAChecksumRehash(Args.Filename);

	if (Instance.IsGood()) {
		let ChangesMade = false; // We only want to write a patched savefile back, if a checksum got updated.

		for (let Type = 0x0; Type < 0x5; Type++) {
			switch(Type) {
				case 0x0: { // Settings.
					const Valid = Instance.Valid(Type);

					if (Valid) console.log("The Settings Checksum is valid!");
					else {
						/* Handle the ask for a fix. */
						let Res = "y";
						if (Args.AskForFix) Res = prompt("The Settings Checksum is invalid! Would you like to fix it? Enter y for yes: ");
						else                      console.log("The Settings Checksum is invalid! Fixing now...");

						if (Res != "y") console.log("The Settings Header Checksum did not get fixed!");
						else {
							Instance.FixChecksum(Type);
							console.log("Fixed the Settings Header Checksum!");
							ChangesMade = true;
						}
					}

					break;
				}

				case 0x1:
				case 0x2:
				case 0x3:
				case 0x4: { // Slots.
					if (!Instance.SlotExist(Type)) console.log("Slot " + Type.toString() + " does not exist.");
					else {
						const Valid = Instance.Valid(Type);

						if (Valid) console.log("The Slot " + Type.toString() + "'s Checksum is valid!");
						else {
							/* Handle the ask for a fix. */
							let Res = "y";
							if (Args.AskForFix) Res = prompt("The Slot " + Type.toString() + "'s Checksum is invalid! Would you like to fix it? Enter y for yes: ");
							else                      console.log("The Slot " + Type.toString() + "'s Checksum is invalid! Fixing now...");

							if (Res != "y") console.log("The Slot Checksum did not get fixed!");
							else {
								Instance.FixChecksum(Type);
								console.log("Fixed the Slot Checksum!");
								ChangesMade = true;
							}
						}
					}

					break;
				}
			}
		}

		if (ChangesMade) Instance.WriteBack(Args.Filename);
		
	} else {
		console.log("This is not a valid The Sims 2 GBA Savefile.");
	}

} else {
	console.log("Please provide proper Arguments.");
}