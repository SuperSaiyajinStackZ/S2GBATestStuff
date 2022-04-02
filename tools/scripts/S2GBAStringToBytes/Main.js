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

import { Instance as Script } from "./S2GBAStringToBytes.js";


function ParseArgs() {
	let ArgStruct = {
		"String": ""
	};

	const Args = Deno.args;

	if (Args.length > 0x0) {
		let Type = "";

		for (let Idx = 0x0; Idx < Args.length; Idx++) {
			switch(Type) {
				case "-s": // The String to return as bytes.
					ArgStruct.String = Args[Idx];
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
	"Arguments: -s <String>\n" +
	"Detected Arguments:\n" +
	"-s: " + (Args.String == "" ? "Not provided" : Args.String) + "\n" +
	"===================================================================\n\n"
);

if (Args.String != "") {
	const Arr = Script.Convert(Args.String);

	if (Arr.length > 1) {
		let Str = "The bytes of your String: " + Args.String + "\n\nstatic constexpr uint8_t StringBytes[0x" + Arr.length.toString(16).toUpperCase() + "] = {\n    ";
		for (let Idx = 0; Idx < Arr.length; Idx++) {
			if (Idx < Arr.length - 1) Str += "0x" + Arr[Idx].toString(16).toUpperCase() + ", ";
			else                      Str += "0x" + Arr[Idx].toString(16).toUpperCase();
		}

		Str += "\n};";
		console.log(Str);

	} else {
		console.log("The byte of your String: " + Args.String + "\n\nstatic constexpr uint8_t StringByte = 0x" + Arr[0x0].toString(16).toUpperCase() + ";");
	}

} else {
	console.log("Please provide proper Arguments.");
}