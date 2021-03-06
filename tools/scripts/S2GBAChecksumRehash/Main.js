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

import { DenoHelper } from "../../common/DenoHelper.js";
import { Instance as DataInstance } from "../../common/S2GBASAVData.js";
import { Instance as Script } from "./S2GBAChecksumRehash.js"


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
	"===================================================================\n" +
	"Script Name: " + Script.Name() + "\n" +
	"Version: " + Script.Version() + "\n" +
	"Contributors: " + Script.Contributors() + "\n" +
	"Purpose: " + Script.Purpose() + "\n\n" +
	"Arguments: -f <Filepath> -a <AskForFix y>\n" +
	"Detected Arguments:\n" +
	"-f: " + (Args.Filename == "" ? "Not provided" : Args.Filename) + "\n" +
	"-a: " + (Args.AskForFix ? "True" : "False") + "\n" +
	"===================================================================\n\n"
);

if (Args.Filename != "") {
	DataInstance.Load(DenoHelper.FileToU8Array(Args.Filename));
	Script.Initialize();

	if (Script.IsGood()) {
		let ChangesMade = false; // We only want to write a patched savefile back, if a checksum got updated.

		for (let Type = 0x0; Type < 0x5; Type++) {
			switch(Type) {
				case 0x0: { // Settings.
					const Valid = Script.Valid(Type);

					if (Valid) console.log("The Settings Checksum is valid!");
					else {
						/* Handle the ask for a fix. */
						let Res = "y";
						if (Args.AskForFix) Res = prompt("The Settings Checksum is invalid! Would you like to fix it? Enter y for yes: ");
						else                      console.log("The Settings Checksum is invalid! Fixing now...");

						if (Res != "y") console.log("The Settings Header Checksum did not get fixed!");
						else {
							Script.FixChecksum(Type);
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
					if (!Script.SlotExist(Type)) console.log("Slot " + Type.toString() + " does not exist.");
					else {
						const Valid = Script.Valid(Type);

						if (Valid) console.log("The Slot " + Type.toString() + "'s Checksum is valid!");
						else {
							/* Handle the ask for a fix. */
							let Res = "y";
							if (Args.AskForFix) Res = prompt("The Slot " + Type.toString() + "'s Checksum is invalid! Would you like to fix it? Enter y for yes: ");
							else                      console.log("The Slot " + Type.toString() + "'s Checksum is invalid! Fixing now...");

							if (Res != "y") console.log("The Slot Checksum did not get fixed!");
							else {
								Script.FixChecksum(Type);
								console.log("Fixed the Slot Checksum!");
								ChangesMade = true;
							}
						}
					}

					break;
				}
			}
		}

		if (ChangesMade) DenoHelper.WriteBinaryToFile(DataInstance.GetUint8Array(), Args.Filename);
		
	} else {
		console.log("This is not a valid The Sims 2 GBA Savefile.");
	}

} else {
	console.log("Please provide proper Arguments.");
}