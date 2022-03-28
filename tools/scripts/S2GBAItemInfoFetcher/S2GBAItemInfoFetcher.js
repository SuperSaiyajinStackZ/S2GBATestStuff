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


/*
	Formats an ID into a 3 digit padding number string.

	ID: The ID to format.
*/
function FormatID(ID) {
	let Num = ID.toString();

	/* Padding to 3 digits. */
	if (ID < 10)        Num = "00" + ID.toString();
	else if (ID < 100)  Num =  "0" + ID.toString();
	else                Num =         ID.toString();

	return Num;
}


export class S2GBAItemInfoFetcher {
	constructor() { this.Initialize(); }
	Initialize() { this.Good = DataInstance.IsValid(); }

	/* Some useful returns. */
	IsGood() { return this.Good; }
	MaxIDs() { return 0xE3; } // Looks like this + everything above is not an actual Item, however 0xE6 is an empty Item ID.

	/* Some Meta data. */
	Version() { return "v0.1.0"; }
	Contributors() { return "SuperSaiyajinStackZ"; }
	Name() { return "S2GBAItemInfoFetcher"; }
	Purpose() { return "Fetch and Extract Item Info Data from a The Sims 2 Game Boy Advance ROM."; }

	/*
		Fetches Info about an Item of a specific ID and a Language.

		LanguageID: The Language to fetch the name from (See S2GBAStringFetcher's LocTable Comments for the Language Indexes).
		ItemID: The Item ID to fetch ( 0x0 - 0xE3 ).
	*/
	Fetch(LanguageID, ItemID) {
		let ItemStruct = {
			ItemNameID: 0x0,
			ItemName: "",
			BuyPrice: 0x0,
			Unknown: [ 0x0, 0x0, 0x0 ] // 3 Unknown Values right now.
		};

		if (this.IsGood() && (ItemID >= 0x0 && ItemID < this.MaxIDs()) && (LanguageID >= 0x0 && LanguageID < StringFetcher.MaxLang())) {
			const Offs = 0x72820 + (ItemID * 0x14);

			ItemStruct.ItemNameID = DataInstance.ReadData("uint32_t", Offs);
			ItemStruct.ItemName = StringFetcher.Fetch(LanguageID, ItemStruct.ItemNameID);
			ItemStruct.BuyPrice = DataInstance.ReadData("uint32_t", Offs + 0x4);
			for (let Idx = 0x0; Idx < 0x3; Idx++) ItemStruct.Unknown[Idx] = DataInstance.ReadData("uint32_t", Offs + 0x8 + (Idx * 0x4));
		}

		return ItemStruct;
	}

	/*
		Extracts all Item Data of a specific Language into a Text file.

		LanguageID: The Language Index (See S2GBAStringFetcher's LocTable Comments for the Language Indexes).
		Path: The path to where to store the file.
	*/
	Extract(LanguageID, Path) {
		let RawString = "";

		for (let Idx = 0x0; Idx < this.MaxIDs(); Idx++) {
			const ItemData = this.Fetch(LanguageID, Idx);

			RawString += "=== " + FormatID(Idx) + " ===\n";
			RawString += "Item Name:      " + ItemData.ItemName + "\n";
			RawString += "Item Name ID:   0x" + ItemData.ItemNameID.toString(16).toUpperCase() + "\n";
			RawString += "Item Buy Price: " + ItemData.BuyPrice.toString() + "\n";

			/* Unknown Values. */
			for (let UnkIdx = 0x0; UnkIdx < 0x3; UnkIdx++) {
				RawString += "Unknown[" + UnkIdx.toString() + "]:     0x" + ItemData.Unknown[UnkIdx].toString(16).toUpperCase();
				if (UnkIdx < 0x2) RawString += "\n";
			}

			if (Idx < this.MaxIDs() - 1) RawString += "\n\n";
		}

		Deno.writeTextFileSync(Path, RawString);
	}
};

export let Instance = new S2GBAItemInfoFetcher();