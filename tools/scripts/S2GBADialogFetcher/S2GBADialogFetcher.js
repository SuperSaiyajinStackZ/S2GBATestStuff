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

import { Instance as DataInstance } from "../../common/S2GBAROMData.js";
import { Instance as StringFetcher } from "../S2GBAStringFetcher/S2GBAStringFetcher.js";

const DataStart = 0x5CF78;


export class S2GBADialogFetcher {
	constructor() { this.Initialize(); }
	Initialize() { this.Good = DataInstance.IsValid(); }

	/* Some useful returns. */
	IsGood() { return this.Good; }
	MaxLang() { return StringFetcher.MaxLang(); }
	MaxDialogs() { return 0x371; } // 881 Dialogs exist.

	/* Some Meta data. */
	Version() { return "v0.2.0"; }
	Contributors() { return "SuperSaiyajinStackZ"; }
	Name() { return "S2GBADialogFetcher"; }
	Purpose() { return "Fetch and Extract the Dialogs from a The Sims 2 Game Boy Advance ROM."; }

	/*
		Fetches a Dialog from the ROM.

		LanguageID: The language ID to fetch. (See S2GBAStringFetcher's LocTable Comments for the Language Indexes).
		DialogID: The Dialog to fetch.
	*/
	Fetch(LanguageID, DialogID) {
		if (!this.IsGood() || LanguageID >= this.MaxLang() || DialogID >= this.MaxDialogs()) return "";

		let RawString = "";
		const StringPtr = DataInstance.ReadData("uint32_t", DataStart + (DialogID * 0x8)) - 0x08000000; // Contains the address where the string IDs are stored.
		const Messages = DataInstance.ReadData("uint32_t", DataStart + (DialogID * 0x8) + 0x4); // The amount of Messages.

		for (let Idx = 0; Idx < Messages; Idx++) {
			RawString += StringFetcher.Fetch(LanguageID, DataInstance.ReadData("uint32_t", StringPtr + (Idx * 0x4))); // IDs are stored in a table, so do * 0x4 per Message.

			if (Idx < Messages - 1) RawString += "\n";
		}

		return RawString;
	}

	/*
		Extracts all 881 Dialogs of a specific Language into a Raw String.

		Language: The Language Index ( 0 - 5 ).
	*/
	Extract(Language) {
		if (Language >= this.MaxLang()) return "";
		let RawString = "";

		for (let Idx = 0x0; Idx < this.MaxDialogs(); Idx++) {
			RawString += "=== Dialog " + Idx.toString(10).padStart(3, "0") + " ===\n";
			RawString += this.Fetch(Language, Idx);

			if (Idx < this.MaxDialogs() - 1) RawString += "\n\n";
		}

		return RawString;
	}
};

export let Instance = new S2GBADialogFetcher();