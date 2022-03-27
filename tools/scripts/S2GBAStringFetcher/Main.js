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

import { S2GBAStringFetcher } from "./S2GBAStringFetcher.js";

/* Language Names Table. */
const LangNames = [ "English", "Dutch", "French", "German", "Italian", "Spanish" ];


function ParseArgs() {
	let ArgStruct = {
		"Filename": "",
		"Outfolder": ""
	};

	const Args = Deno.args;

	if (Args.length > 0x0) {
		let Type = "";

		for (let Idx = 0x0; Idx < Args.length; Idx++) {
			switch(Type) {
				case "-f": // Filename.
					ArgStruct.Filename = Args[Idx];
					Type = "";
					break;

				case "-o": // Output.
					ArgStruct.Outfolder = Args[Idx];
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
	"S2GBAStringFetcher v0.1.0 by SuperSaiyajinStackZ - Copyright © 2022\n" +
	"Purpose: Fetch and Extract the Strings from a The Sims 2 Game Boy Advance ROM.\n" +
	"Arguments: -f <Filepath> -o <OutputFolder>\n" +
	"Detected Arguments:\n" +
	"-f: " + (Args.Filename == "" ? "Not provided" : Args.Filename) + "\n" +
	"-o: " + (Args.Outfolder == "" ? "Not provided" : Args.Outfolder) + "\n" +
	"===================================================================\n\n"
);

if (Args.Filename != "" && Args.Outfolder != "") {
	let Instance = new S2GBAStringFetcher(Args.Filename);

	if (Instance.IsGood()) {
		if (Args.Outfolder[Args.Outfolder.length - 1] != "/") { // Only do this, if the last character is not / inside that argument.
			Deno.mkdirSync(Args.Outfolder, { recursive: true }); // Make the dirs just in case.
			for (let LangIdx = 0x0; LangIdx < Instance.MaxLang(); LangIdx++) Instance.Extract(LangIdx, (Args.Outfolder + "/" + LangNames[LangIdx] + "-Strings.txt"));
		}

	} else {
		console.log("This is not a valid The Sims 2 GBA ROM.");
	}

} else {
	console.log("Please provide proper Arguments.");
}