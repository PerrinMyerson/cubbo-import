"use client"

import { CostAllocationEnum, IndustryEnum, ItemInput, ItemListingOutput, ItemType, TransportEnum, makeFullItemListings } from "@/utils/processItems";
import { useEffect, useState } from "react";

export default function Home() {
	const [items, setItems] = useState<ItemInput[]>([]);
	const [itemName, setItemName] = useState<string>("");
	const [itemType, setItemType] = useState<ItemType>("other");
	const [itemQuantity, setItemQuantity] = useState<number>();
	const [itemUnitFOB, setItemUnitFOB] = useState<number>();
	const [itemVolume, setItemVolume] = useState<number>();
	const [itemWeight, setItemWeight] = useState<number>();
	const [costAllocation, setCostAllocation] = useState<CostAllocationEnum>("CBM");
	const [industry, setIndustry] = useState<IndustryEnum>("Clothes");
	const [insurancePct, setInsurancePct] = useState<number>(0.7);

	const [totalFreight, setTotalFreight] = useState<number>(0);
	const [totalCustoms, setTotalCustoms] = useState<number>(0);
	const [transportType, setTransportType] = useState<TransportEnum>("unknown");

	// calculated values
	const totalShipmentValue = totalCustoms + totalFreight;
	const [itemListings, setItemListings] = useState<ItemListingOutput[]>([]);
	const [totalPivotFreightCalculation, setTotalPivotFreightCalculation] = useState<number>(0);
	const [totalCost, setTotalCost] = useState<number>(0);

	const resetForm = () => {
		// setItemName("");
		// setItemType("other");
		// setItemQuantity(0);
		// setItemUnitFOB(0);
		// setItemVolume(0);
		// setItemWeight(0);
		// setCostAllocation("CBM");
		// setInsurancePct(0.7);
	}

	useEffect(() => {
		const {
			items: itemListingsOutput, 
			totalPivotSum: totalPivotFreightCalculationOutput
		} = makeFullItemListings(items, totalShipmentValue);
		setItemListings(itemListingsOutput);
		console.log(itemListingsOutput);
		console.log(totalPivotFreightCalculationOutput);
		setTotalPivotFreightCalculation(totalPivotFreightCalculationOutput);
		setTotalCost(itemListingsOutput.reduce((acc, item) => acc + item.cifPrice, 0));
	}, [items, totalShipmentValue]);

	return (
		<main className="w-screen min-h-screen bg-white">
			<div className="p-5"></div>
			<div className="flex flex-col w-full place-items-center">
				<span className="text-3xl">
					Total Cost:
				</span>
				<div className="p-2"></div>
				<div className="rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex flex-row-reverse">
					{"$" + totalCost.toFixed(2)}
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
				{/* list all titles */}
				<div className="flex flex-row">
					<div className="flex flex-col px-2 border-r-2">
						<span className="w-[100px]">Name:</span>
					</div>
					<div className="flex flex-col px-2 border-r-2">
						<span className="w-[100px]">Quantity:</span>
					</div>
					<div className="flex flex-col px-2 border-r-2">
						<span className="w-[100px]">FOB Price:</span>
					</div>
					<div className="flex flex-col px-2 border-r-2">
						<span className="w-[100px]">Volume:</span>
					</div>
					<div className="flex flex-col px-2 border-r-2">
						<span className="w-[100px]">Weight:</span>
					</div>
					<div className="flex flex-col px-2 border-r-2">
						<span className="w-[100px]">Cost Allocation:</span>
					</div>
					<div className="flex flex-col px-2 border-r-2">
						<span className="w-[100px]">Insurance %:</span>
					</div>
				</div>

				{/* list all items */}
				{
					itemListings.map((item, index) => (
						<div key={index} className="flex flex-row">
							<div className="flex flex-row">
								<div className="flex flex-col px-2 border-r-2">
									{/* <span>Name:</span> */}
									{/* <div className="rounded-xl border-2 w-[100px] text-2xl p-2 px-4 flex flex-row-reverse"> */}
									<div className="w-[100px] text-xl flex flex-row-reverse">
										{item.name}
									</div>
								</div>
								<div className="flex flex-col px-2 border-r-2">
									{/* <span>Quantity:</span> */}
									{/* <div className="rounded-xl border-2 w-[100px] text-2xl p-2 px-4 flex flex-row-reverse"> */}
									<div className="w-[100px] text-xl flex flex-row-reverse">
										{item.quantity}
									</div>
								</div>
								<div className="flex flex-col px-2 border-r-2">
									{/* <span>FOB Price:</span> */}
									{/* <div className="rounded-xl border-2 w-[100px] text-2xl p-2 px-4 flex flex-row-reverse"> */}
									<div className="w-[100px] text-xl flex flex-row-reverse">
										{"$" + item.fobPrice.toFixed(2)}
									</div>
								</div>
								<div className="flex flex-col px-2 border-r-2">
									{/* <span>Volume:</span> */}
									{/* <div className="rounded-xl border-2 w-[100px] text-2xl p-2 px-4 flex flex-row-reverse"> */}
									<div className="w-[100px] text-xl flex flex-row-reverse">
										{item.volume}
									</div>
								</div>
								<div className="flex flex-col px-2 border-r-2">
									{/* <span>Weight:</span> */}
									{/* <div className="rounded-xl border-2 w-[100px] text-2xl p-2 px-4 flex flex-row-reverse"> */}
									<div className="w-[100px] text-xl flex flex-row-reverse">
										{item.weight}
									</div>
								</div>
								<div className="flex flex-col px-2 border-r-2">
									{/* <span>Cost Allocation:</span> */}
									{/* <div className="rounded-xl border-2 w-[100px] text-2xl p-2 px-4 flex flex-row-reverse"> */}
									<div className="w-[100px] text-xl flex flex-row-reverse">
										{item.costAllocation}
									</div>
								</div>
								<div className="flex flex-col px-2 border-r-2">
									{/* <span>Insurance %:</span> */}
									{/* <div className="rounded-xl border-2 w-[100px] text-2xl p-2 px-4 flex flex-row-reverse"> */}
									<div className="w-[100px] text-xl flex flex-row-reverse">
										{item.insurancePct}
									</div>
								</div>
							</div>
						</div>
					))
				}
				<div className="flex flex-col w-60 p-5">
					<div className="flex flex-col">
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
				</div>
			</div>
			<div className="p-20"></div>
		</main>
	);
}
