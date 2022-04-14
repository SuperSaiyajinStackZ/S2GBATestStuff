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

/*
	Format is like:
	XX XX XX XX XX XX XX XX
	XX XX XX XX XX XX XX XX
	XX XX XX XX XX XX XX XX

	8 Episodes per Season, but only 5 are at max visible.
	0x18 is a Season Terminator and 0x0 - 0x17 are valid IDs.
*/
const EPIDStart = 0x1FB630C;

/* Default ID List, in case you want restore to original. */
const DefaultIDs = [
	0x01, 0x03, 0x07, 0x18, 0x00, 0x00, 0x00, 0x00,
	0x06, 0x0A, 0x08, 0x0F, 0x18, 0x00, 0x00, 0x00,
	0x0D, 0x05, 0x16, 0x15, 0x18, 0x00, 0x00, 0x00
];


export class S2GBAEpisodeListEditor {
	constructor() { this.Initialize(); }
	Initialize() { this.Good = DataInstance.IsValid(); }

	/* Some useful returns. */
	IsGood() { return this.Good; }
	MaxIDs() { return 0x18; }
	MaxIndex() { return 0x18; }

	/* Some Meta data. */
	Version() { return "v0.1.0"; }
	Contributors() { return "SuperSaiyajinStackZ"; }
	Name() { return "S2GBAEpisodeListEditor"; }
	Purpose() { return "Edit the displayed Episodes in the Episode Menu List."; }

	GetID(Index) {
		if (this.IsGood() && Index >= 0x0 && Index < this.MaxIndex()) return DataInstance.ReadData("uint8_t", EPIDStart + Index);
		return 0x18;
	}

	SetID(Index, EP) {
		if (this.IsGood() && Index >= 0x0 && Index < this.MaxIndex() && EP >= 0x0 && EP <= this.MaxIDs()) DataInstance.WriteData("uint8_t", EPIDStart + Index, EP);
	}

	Reset() {
		if (this.IsGood()) {
			for (let Idx = 0x0; Idx < this.MaxIndex(); Idx++) DataInstance.WriteData("uint8_t", EPIDStart + Idx, DefaultIDs[Idx]);
		}
	}

	/*
		Utility function, which sets the Season Terminator on the 6th Index (0x18), because only 5 are actually visible and usable.
	*/
	SetToFit() {
		if (this.IsGood()) {
			for (let Season = 0x0; Season < 0x3; Season++) {
				let Terminated = false;

				for (let Idx = 0x0; Idx < 0x6 && !Terminated; Idx++) {
					/* 0x5 => Directly set to 0x18, because not visible anymore. */
					if (Idx == 0x5) {
						DataInstance.WriteData("uint8_t", EPIDStart + (Season * 0x8) + Idx, 0x18);
						Terminated = true;

						/* Check for ID Ranges. */
					} else {
						const ID = this.GetID((Season * 0x8) + Idx);

						if (ID == this.MaxIDs()) Terminated = true; // 0x18 => Already terminated.
						else if (ID > this.MaxIDs()) {
							DataInstance.WriteData("uint8_t", EPIDStart + (Season * 0x8) + Idx, 0x18);
							Terminated = true;
						}
					}
				}
			}
		}
	}
};

export let Instance = new S2GBAEpisodeListEditor();