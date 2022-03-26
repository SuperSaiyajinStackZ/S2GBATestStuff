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

const TID = [ 0x42, 0x34, 0x36, 0x45 ]; // B46E.
let Buffer = undefined, View = undefined, ChangesMade = false, Size = 0x0, Valid = false; // Some variables for this class. We only need 1 Instance of them.


export class S2GBAROMData {
	/*
		The constructor of this class.

		Path: The path to the ROM.
		ShouldLoad: If the data should be loaded at constructor (true) or not (false). True by default.
	*/
	constructor(Path, ShouldLoad = true) {
		if (ShouldLoad) this.Load(Path);
	}

	/*
		Load a ROM.

		Path: The path to the ROM.
	*/
	Load(Path) {
		this.ResetData();
		const Info = Deno.statSync(Path);

		/* Ensure ROM Size is correct. */
		if (Info.size == 0x1FC4AD5 || Info.size == 0x2000000) {
			Size = Info.size;
			Buffer = Deno.readFileSync(Path);
			View = new DataView(Buffer.buffer);

			/* Check the GBA ROM Magic Byte. */
			const MagicByte = this.ReadData("uint8_t", 0xB2);
			if (MagicByte == 0x96) {
				/* Check the ROM Gamecode / Title ID. */
				for (let Idx = 0x0; Idx < 0x4; Idx++) {
					const ID = this.ReadData("uint8_t", 0xAC + Idx);

					if (ID != TID[Idx]) {
						this.ResetData(); // Wrong, so reset.
						return;
					}
				}

				Valid = true;
			}
		}
	}

	/* Reset all the data. */
	ResetData() {
		ChangesMade = false, Valid = false; // False / True things.
		Size = 0x0; // Sizes.
		View = undefined, Buffer = undefined; // Buffer stuff.
	}

	/* Some useful returns. */
	IsValid() { return Valid; }
	MadeChanges() { return ChangesMade; }

	/*
		Reading data of a specified type.

		Type: The type to read.
		Offs: The offset from where to read.
	*/
	ReadData(Type, Offs) {
		if (View == undefined) return 0x0;

		switch(Type) {
			case "u8":
			case "uint8_t":
				if (Offs < Size) return View.getUint8(Offs);
				break;
	
			case "u16":
			case "uint16_t":
				if (Offs < Size - 0x1) return View.getUint16(Offs, true);
				break;
	
			case "u32":
			case "uint32_t":
				if (Offs < Size - 0x3) return View.getUint32(Offs, true);
				break;
		}
	
		return 0x0;
	}

	/*
		Reads a bit of a specific offset at a specific Bit Index.

		Offs: The offset from where to read.
		BitIndex: The Bit Index ( 0 - 7 ).
	*/
	ReadBit(Offs, BitIndex) {
		if (BitIndex > 0x7 || BitIndex < 0x0) return false;

		return (this.ReadData("uint8_t", Offs) >> BitIndex & 0x1) != 0x0;
	}

	/*
		Reads lower / upper Bits of a specific offset.

		Offs: The offset from where to read.
		First: If the first 4 bits ( true, 0 - 3 ) or the last 4 bits ( false, 4 - 7 ).
	*/
	ReadBits(Offs, First) {
		if (First) return (this.ReadData("uint8_t", Offs) & 0xF); // Bit 0 - 3.
		else       return (this.ReadData("uint8_t", Offs) >> 0x4); // Bit 4 - 7.
	}

	/*
		Writing data of a specified type.

		Type: The type to write.
		Offs: The offset where to write.
		Data: The data to write.
	*/
	WriteData(Type, Offs, Data) {
		if (View == undefined) return;

		switch(Type) {
			case "u8":
			case "uint8_t":
				if (Offs < Size) {
					View.setUint8(Offs, Data);
					ChangesMade = true;
				}
				break;
	
			case "u16":
			case "uint16_t":
				if (Offs < Size - 0x1) {
					View.setUint16(Offs, Data, true);
					ChangesMade = true;
				}
				break;
	
			case "u32":
			case "uint32_t":
				if (Offs < Size - 0x3) {
					View.setUint32(Offs, Data, true);
					ChangesMade = true;
				}
				break;
		}
	}

	/*
		Write a bit.

		Offs: The offset where to write to.
		BitIndex: The Bit Index to write to ( 0 - 7 ).
		IsSet: If the Bit is set.
	*/
	WriteBit(Offs, BitIndex, IsSet) {
		if (Buffer == undefined || Offs >= Size || BitIndex > 0x7 || BitIndex < 0x0) return;
	
		Buffer[Offs] &= ~(0x1 << BitIndex);
		Buffer[Offs] |= (IsSet ? 0x1 : 0x0) << BitIndex;
		ChangesMade = true;
	}

	/*
		Write upper / lower bits.

		Offs: The offset where to write to.
		First: If the first 4 bits ( true, 0 - 3 ) or the last 4 bits ( false, 4 - 7 ).
		Data: The data to write ( 0 - F ).
	*/
	WriteBits(Offs, First, Data) {
		if (Data > 0xF) return;
	
		if (First) this.WriteData("uint8_t", Offs, (this.ReadData("uint8_t", Offs) & 0xF0) | (Data & 0xF)); // Bit 0 - 3.
		else       this.WriteData("uint8_t", Offs, (this.ReadData("uint8_t", Offs) & 0x0F) | (Data << 0x4)); // Bit 4 - 7.
	}

	/*
		Writing the active Buffer back to a file.

		Path: The path where to write the file to.
		Unload: If unloading the whole data or not (false by default).
	*/
	WriteBack(Path, Unload = false) {
		if (View == undefined) return;

		Deno.writeFileSync(Path, Buffer);
		if (Unload) this.ResetData();
	}
};