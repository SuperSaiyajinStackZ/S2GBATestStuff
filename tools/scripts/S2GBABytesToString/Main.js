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

import { Instance as Script } from "./S2GBABytesToString.js";


function ParseArgs() {
	let ArgStruct = {
		"Bytes": ""
	};

	const Args = Deno.args;

	if (Args.length > 0x0) {
		let Type = "";

		for (let Idx = 0x0; Idx < Args.length; Idx++) {
			switch(Type) {
				case "-b": // The Bytes to return as string.
					ArgStruct.Bytes = Args[Idx];
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
	"Arguments: -b <Bytes>\n" +
	"Detected Arguments:\n" +
	"-b: " + (Args.Bytes == "" ? "Not provided" : Args.Bytes) + "\n" +
	"===================================================================\n\n"
);

if (Args.Bytes != "") {
	const ByteArray = Script.StringToByteArray(Args.Bytes);
	const String = Script.Convert(ByteArray);

	let BString = "The bytes you want to convert:\n";
	for (let Idx = 0; Idx < ByteArray.length; Idx++) {
		if (Idx < ByteArray.length - 1) BString += "0x" + ByteArray[Idx].toString(16).toUpperCase() + ", ";
		else                            BString += "0x" + ByteArray[Idx].toString(16).toUpperCase();
	}

	console.log(BString + "\nThe result String:\n" + String);

} else {
	console.log("Please provide proper Arguments.");
}