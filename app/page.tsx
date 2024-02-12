"use client"

import Image from "next/image";
import { useState } from "react";

type ItemType = "other";

type CostAllocationEnum = "CBM" | "Units" | "Weight";

type Item = {
	name: string,
	type: ItemType,
	quantity: number,
	fobPrice: number,
	volume: number, // in cubic cm
	weight: number, // in kg
	costAllocation: CostAllocationEnum,
	insurancePct: number,
};

const unitCBM = (item: Item): number => {
	return item.volume / 1000000;
}

const calcCBM = (item: Item): number => {
	return item.volume * item.quantity / 1000000;
}

const calcWeightKg = (item: Item): number => {
	return item.weight * item.quantity;
}

const calcCost = (item: Item): number => {
	return item.fobPrice * item.quantity;
}

const pctShipmentValue = (item: Item, totalCost: number): number => {
	return calcCost(item) / totalCost;
}

const pivotFreightCalculation = (costAllocation: CostAllocationEnum, item: Item): number => {
	switch (costAllocation) {
		case "CBM":
			return calcCBM(item);
		case "Units":
			return item.quantity;
		case "Weight":
			return calcWeightKg(item);
	}
}

const pivotForUnitEconomics = (costAllocation: CostAllocationEnum, item: Item): number => {
	switch (costAllocation) {
		case "CBM":
			return unitCBM(item);
		case "Units":
			return 1;
		case "Weight":
			return item.weight;
	}
}

type ItemListingType1 = Item & {
	cbm: number,
	weightKg: number,
	cost: number,
	pivotFreightEconomics: number,
	pivotForUnitEconomics: number,
};

const makeItemListing1 = (item: Item): ItemListingType1 => {
	return {
		...item,
		cbm: calcCBM(item),
		weightKg: calcWeightKg(item),
		cost: calcCost(item),
		pivotFreightEconomics: pivotFreightCalculation(item.costAllocation, item),
		pivotForUnitEconomics: pivotForUnitEconomics(item.costAllocation, item),
	};
}

const freightPerUnit = (costAllocation: CostAllocationEnum, item: Item, totalShipment: number, totalPivotFreightCalculation: number): number => {
	return totalShipment * (pivotForUnitEconomics(costAllocation, item) / totalPivotFreightCalculation);
}

// visible to user
const cifPrice = (item: ItemListingType1, totalShipment: number, totalPivotFreightCalculation: number): number => {
	return item.fobPrice + freightPerUnit(item.costAllocation, item, totalShipment, totalPivotFreightCalculation) + (item.fobPrice * item.insurancePct);
}

type ItemListingType2 = ItemListingType1 & {
	// freightPerUnit: number,
	cifPrice: number,
};

const makeItemListing2 = (item: ItemListingType1, totalShipment: number, totalPivotFreightCalculation: number) => {
	return {
		...item,
		// freightPerUnit: freightPerUnit(item.costAllocation, item, totalShipment, totalPivotFreightCalculation),
		cifPrice: cifPrice(item, totalShipment, totalPivotFreightCalculation),
	};
}

export default function Home() {
	const [items, setItems] = useState<Item[]>([]);
	const [itemName, setItemName] = useState<string>("");
	const [itemType, setItemType] = useState<ItemType>("other");
	const [itemQuantity, setItemQuantity] = useState<number>();
	const [itemUnitFOB, setItemUnitFOB] = useState<number>();
	const [itemVolume, setItemVolume] = useState<number>();
	const [itemWeight, setItemWeight] = useState<number>();
	const [costAllocation, setCostAllocation] = useState<CostAllocationEnum>("CBM");
	const [insurancePct, setInsurancePct] = useState<number>(0.7);

	const resetForm = () => {
		setItemName("");
		setItemType("other");
		setItemQuantity(0);
		setItemUnitFOB(0);
		setItemVolume(0);
		setItemWeight(0);
		setCostAllocation("CBM");
		setInsurancePct(0.7);
	}

	const [totalFreight, setTotalFreight] = useState<number>(0);
	const [totalCustoms, setTotalCustoms] = useState<number>(0);
	
	const itemListings1 = items.map(makeItemListing1);
	
	const totalShipmentValue = totalFreight + totalCustoms;
	const totalPivotFreightCalculation = itemListings1.reduce((acc, item) => acc + item.pivotFreightEconomics, 0);

	const itemListings2 = itemListings1.map(item => makeItemListing2(item, totalShipmentValue, totalPivotFreightCalculation));

	return (
		<main className="w-screen h-screen bg-white">
			<div className="p-5"></div>
			<div className="flex flex-col w-full place-items-center">
				<span className="text-3xl">
					Total Cost:
				</span>
				<div className="p-2"></div>
				<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
					{"$" + (100.1111).toFixed(2)}
				</div>
				<div className="p-5"></div>
				<div className="flex flex-row">
					<div className="flex flex-col">
						<div className="flex flex-row">
							<span>Freight:</span>
							<input type="number" value={totalFreight} onChange={(e) => setTotalFreight(parseInt(e.target.value))} />
						</div>
						<div className="flex flex-row">
							<span>Customs:</span>
							<input type="number" value={totalCustoms} onChange={(e) => setTotalCustoms(parseInt(e.target.value))} />
						</div>
					</div>
					<div className="p-5"></div>
					<div className="flex flex-col">
						<div className="flex flex-row">
							<span>Total Shipment Value:</span>
							<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
								{"$" + totalShipmentValue.toFixed(2)}
							</div>
						</div>
						<div className="flex flex-row">
							<span>Total Pivot Freight Calculation:</span>
							<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
								{"$" + totalPivotFreightCalculation.toFixed(2)}
							</div>
						</div>
					</div>
				</div>
				<div className="p-5"></div>
				{/* list all items */}
				{
					itemListings2.map((item, index) => (
						<div key={index} className="flex flex-row">
							<div className="flex flex-col">
								<div className="flex flex-row">
									<span>Name:</span>
									<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
										{item.name}
									</div>
								</div>
								<div className="flex flex-row">
									<span>Quantity:</span>
									<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
										{item.quantity}
									</div>
								</div>
								<div className="flex flex-row">
									<span>FOB Price:</span>
									<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
										{"$" + item.fobPrice.toFixed(2)}
									</div>
								</div>
								<div className="flex flex-row">
									<span>Volume:</span>
									<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
										{item.volume}
									</div>
								</div>
								<div className="flex flex-row">
									<span>Weight:</span>
									<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
										{item.weight}
									</div>
								</div>
								<div className="flex flex-row">
									<span>Cost Allocation:</span>
									<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
										{item.costAllocation}
									</div>
								</div>
								<div className="flex flex-row">
									<span>Insurance %:</span>
									<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
										{item.insurancePct}
									</div>
								</div>
							</div>
							<div className="p-5"></div>
						</div>
					))
				}
				<form className="flex flex-col w-full p-5">
					<div className="flex flex-row">
						<input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
						<select value={itemType} onChange={(e) => setItemType(e.target.value as ItemType)}>
							<option value="other">Other</option>
						</select>
						<input type="number" placeholder="Quantity" value={itemQuantity} onChange={(e) => setItemQuantity(parseInt(e.target.value))} />
						<input type="number" placeholder="Unit FOB" value={itemUnitFOB} onChange={(e) => setItemUnitFOB(parseFloat(e.target.value))} />
						<input type="number" placeholder="Volume" value={itemVolume} onChange={(e) => setItemVolume(parseFloat(e.target.value))} />
						<input type="number" placeholder="Weight" value={itemWeight} onChange={(e) => setItemWeight(parseFloat(e.target.value))} />
						<input type="number" placeholder="Insurance %" value={insurancePct} onChange={(e) => setInsurancePct(parseFloat(e.target.value))} />
						<select value={costAllocation} onChange={(e) => setCostAllocation(e.target.value as CostAllocationEnum)}>
							<option value="CBM">CBM</option>
							<option value="Units">Units</option>
							<option value="Weight">Weight</option>
						</select>
						<button onClick={() => {
							if (!itemName || !itemQuantity || !itemUnitFOB || !itemVolume || !itemWeight) {
								return;
							}
							setItems([...items, {
								name: itemName,
								type: itemType,
								quantity: itemQuantity,
								fobPrice: itemUnitFOB,
								volume: itemVolume,
								weight: itemWeight,
								costAllocation: costAllocation,
								insurancePct: insurancePct,
							}]);
							resetForm();
						}}>Add</button>
					</div>
				</form>
			</div>
		</main>
	);
}
