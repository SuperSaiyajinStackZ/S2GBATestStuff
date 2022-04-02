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


export class S2GBAStringToBytes {
	constructor() { }

	/* Some Meta data. */
	Version() { return "v0.1.0"; }
	Contributors() { return "SuperSaiyajinStackZ"; }
	Name() { return "S2GBAStringToBytes"; }
	Purpose() { return "Convert a String into a The Sims 2 Game Boy Advance Byte Array."; }

	/*
		Converts a String into a byte array.

		Str: The String to convert.
	*/
	Convert(Str) {
		let StringBytes = [ ];
	
		let Found = false;
		let EncodingLen = 0, EncodingMatchCount = 0;
	
		for (let StrIdx = 0; StrIdx < Str.length; StrIdx++) {
			const Byte = Str.charCodeAt(StrIdx);
	
			if ((Byte >= 0x0 && Byte <= 0x9) || (Byte >= 0xB && Byte <= 0x1F) || (Byte >= 0xBC)) break;
			else {
				Found = false;
	
				for (let ASCIIIdx = 0x20; ASCIIIdx < 0x7A; ASCIIIdx++) {
					if (ASCIIIdx == Byte) {
						Found = true;
						StringBytes.push(ASCIIIdx);
						break;
					}
				}
			}
	
			if (!Found) {
				for (let EncodingIdx = 0x0; EncodingIdx < Encoding.length; EncodingIdx++) {
					EncodingLen = Encoding[EncodingIdx].length; // Get the length of the encoding character.
					EncodingMatchCount = 0;
	
					if (EncodingLen == 0) continue; // There are also characters that have a size of 0, so skip those to not cause an infinity loop.
	
					for (let EncodingLenIdx = 0; EncodingLenIdx < EncodingLen; EncodingLenIdx++) {
						if ((Str.length - 1) < StrIdx + EncodingLenIdx) break;
						if (Str[StrIdx + EncodingLenIdx] == Encoding[EncodingIdx][EncodingLenIdx]) EncodingMatchCount++;
						else break;
					}
	
					if (EncodingMatchCount == EncodingLen) {
						Found = true;
						StringBytes.push(EncodingIdx + 0x7B);
						StrIdx += EncodingLen - 1;
						break;
					}
				}
	
				if (!Found) break;
			}
		}
	
		return StringBytes;
	}
};

export let Instance = new S2GBAStringToBytes();