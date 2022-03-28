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

import { Instance as DataInstance } from "../../common/S2GBASAVData.js";


export class S2GBAChecksumRehash {
	constructor() { this.Initialize(); }
	Initialize() { this.Good = DataInstance.IsValid(); }

	/* Some useful returns. */
	IsGood() { return this.Good; }

	/* Some Meta data. */
	Version() { return "v0.1.0"; }
	Contributors() { return "SuperSaiyajinStackZ"; }
	Name() { return "S2GBAChecksumRehash"; }
	Purpose() { return "Updates the Checksum of a The Sims 2 Game Boy Advance Savefile."; }

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

						Checksum = (Checksum + DataInstance.ReadData("uint16_t", Idx * 2)) % 0x10000;
					}
					break;

				case 0x1:
				case 0x2:
				case 0x3:
				case 0x4: // Slots.
					if (this.SlotExist(Type)) {
						for (let Idx = (Type * 0x1000) / 2; Idx < ((Type * 0x1000) + 0xFFE) / 2; Idx++) Checksum = (Checksum + DataInstance.ReadData("uint16_t", Idx * 2)) % 0x10000;
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
					return DataInstance.ReadData("uint16_t", 0xE) == this.Calc(Type);

				case 0x1:
				case 0x2:
				case 0x3:
				case 0x4: // Slots.
					if (this.SlotExist(Type)) return DataInstance.ReadData("uint16_t", (Type * 0x1000) + 0xFFE) == this.Calc(Type);
			}
		}

		return false;
	}

	/*
		Returns, if a Slot exists in the Savefile.

		Slot: The Slot to check ( 1 - 4 ).
	*/
	SlotExist(Slot) {
		if (this.IsGood() && Slot >= 0x1 && Slot <= 0x4) return DataInstance.ReadData("uint8_t", (Slot * 0x1000) + 0xD) != 0x0;
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
					DataInstance.WriteData("uint16_t", 0xE, this.Calc(Type));
					break;

				case 0x1:
				case 0x2:
				case 0x3:
				case 0x4: // Slots.
					DataInstance.WriteData("uint16_t", (Type * 0x1000) + 0xFFE, this.Calc(Type));
					break;
			}
		}
	}

	/*
		A wrapper for S2SAVData.WriteBack().

		Path: The path to where to write the file.
	*/
	WriteBack(Path) { DataInstance.WriteBack(Path, false); }
};

export let Instance = new S2GBAChecksumRehash();