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

const Encoding = [
	"©", "œ", "¡", "¿", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë",
	"Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "Ø", "Ù", "Ú", "Ü", "ß", "à",
	"á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ñ",
	"ò", "ó", "ô", "õ", "ö", "ø", "ù", "ú", "û", "ü", "º", "ª", "…", "™", "", "®", ""
];


export class S2GBABytesToString {
	constructor() { }

	/* Some Meta data. */
	Version() { return "v0.1.0"; }
	Contributors() { return "SuperSaiyajinStackZ"; }
	Name() { return "S2GBABytesToString"; }
	Purpose() { return "Convert Bytes into a The Sims 2 Game Boy Advance String."; }

	/*
		Convert a Byte Array into a String.

		Bytes: The Bytes to convert.
	*/
	Convert(Bytes) {
		if (Bytes.length <= 0x0) return "";
		let Str = "";

		for (let Idx = 0x0; Idx < Bytes.length; Idx++) {
			const Byte = Bytes[Idx];
	
			if ((Byte >= 0x0 && Byte <= 0x9) || (Byte >= 0xB && Byte <= 0x1F) || (Byte >= 0xBC)) break;
			else if (Byte >= 0x7B && Byte <= 0xBB) Str += Encoding[Byte - 0x7B];
			else                                   Str += String.fromCharCode(Byte);
		}
	
		return Str;
	}

	/*
		Converts a String with Byte values into a Byte Array.

		Str: The String to convert into a Byte Array. Supports Hexadecimal and Decimal values up to 255.
	*/
	StringToByteArray(Str) {
		if (Str.length <= 0x0) return [ ];

		let BArray = [ ];
		let Idx = 0;
		let TempStr = "";
	
		do {
			do {
				if (Str[Idx] == "," || Str[Idx] == " ") break;
	
				TempStr += Str[Idx];
				Idx++;
			} while(Idx < Str.length);
	
			if (TempStr != "") {
				/* Now parse to byte. */
				const Num = parseInt(TempStr);

				if (!isNaN(Num)) {
					if (Num >= 0x0 && Num <= 0xFF) BArray.push(Num);
				}
	
				TempStr = "";
			}

			Idx++;
		} while(Idx < Str.length);
	
		return BArray;
	}
};

export let Instance = new S2GBABytesToString();