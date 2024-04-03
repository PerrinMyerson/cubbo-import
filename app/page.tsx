"use client"

import { CostAllocationEnum, IndustryEnum, ItemInput, ItemType, TransportEnum } from "@/utils/processItems";
import { useEffect, useState } from "react";

export default function Home() {
	const [items, setItems] = useState<ItemInput[]>([]);
	const [itemName, setItemName] = useState<string>("");
	const [itemQuantity, setItemQuantity] = useState<number>();
	const [itemUnitFOB, setItemUnitFOB] = useState<number>();
	const [industry, setIndustry] = useState<IndustryEnum | null>(null);


	// calculated values

	const [itemListings, setItemListings] = useState<ItemListingOutput[]>([]);
	const [totalPivotFreightCalculation, setTotalPivotFreightCalculation] = useState<number>(0);
	const [totalCost, setTotalCost] = useState<number>(0);
	const [totalCostWithTaxRange, setTotalCostWithTaxRange] = useState<string>("");

	const [hsCode, setHsCode] = useState<string>("");
	const backgroundImageUrl = '/background.jpg';

	const resetForm = () => {
		// setItemName("");
		// setItemType("other");
		// setItemQuantity(0);
		// setItemUnitFOB(0);
		// setItemVolume(0);
		// setItemWeight(0);
		// setCostAllocation("CBM");
		// setInsurancePct(0.7);
		// setIndustry("Clothes");
		// setHsCode("");
	}

	const INDUSTRY_OPTIONS: IndustryEnum[] = [
		"Cosmetics",
		"Dermocosmetic",
		"MechanicalToys",
		"Perfumes",
		"Sunglasses",
		"Young-Children-Toys",
		"Food-supplements",
		"Vitamins",
		"Sports-supplements",
		"Sex-toys",
		"Electronic-Sex-toys",
		"Electronic-Toys",
		"Electronics",
		"Clothes",
	];

	const taxRates = {
		Cosmetics: { min: 10, max: 15 },
		Dermocosmetic: { min: 10, max: 15 },
		MechanicalToys: { min: 10, max: 15 },
		Perfumes: { min: 10, max: 15 },
		Sunglasses: { min: 10, max: 10 },
		"Young-Children-Toys": { min: 10, max: 15 },
		"Food-supplements": { min: 15, max: 15 }, // Simplified for demonstration
		Vitamins: { min: 15, max: 15 }, // Assuming a default rate for simplification
		"Sports-supplements": { min: 15, max: 15 }, // Simplified for demonstration
		"Sex-toys": { min: 10, max: 15 },
		"Electronic-Sex-toys": { min: 10, max: 15 },
		"Electronic-Toys": { min: 10, max: 15 },
		Electronics: { min: 10, max: 15 },
		Clothes: { min: 5, max: 25 },
	};

	const removeItem = (indexToRemove: number) => {
		const newItems = items.filter((_, index) => index !== indexToRemove);
		setItems(newItems);
	};

	useEffect(() => {
		let total = 0;
		let totalMinTaxed = 0;
		let totalMaxTaxed = 0;

		const updatedItemListings = items.map(item => {
			const totalItemCost = item.quantity * item.fobPrice;
			total += totalItemCost;

			const { min, max } = taxRates[item.industry] || { min: 0, max: 0 };
			const minTaxCost = totalItemCost * (min / 100);
			const maxTaxCost = totalItemCost * (max / 100);
			totalMinTaxed += minTaxCost;
			totalMaxTaxed += maxTaxCost;

			return {
				...item,
				totalItemCost,
				estimatedCostWithTax: `$${(minTaxCost).toFixed(2)}-$${(maxTaxCost).toFixed(2)}`,
			};
		});

		setTotalCost(total);
		setTotalCostWithTaxRange(`$${totalMinTaxed.toFixed(2)}-$${totalMaxTaxed.toFixed(2)}`);
		setItemListings(updatedItemListings);
	}, [items]);

	return (
		<main className="w-screen min-h-screen bg-white">

			<h1 className="text-center text-4xl font-bold font-jakarta text-custom-blue p-5">Cubbo Import Tax Calculator</h1>
			<div className="p-5"></div>
			<div className="flex flex-col w-full place-items-center">
				<div className="flex items-start justify-center space-x-6">
					{/* Total Cost Box */}
					<div>
						<span className="text-3xl font-jakarta">
							Cost of Goods:
						</span>
						<div className="mt-2 rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex justify-end">
							{"$" + totalCost.toFixed(2)}
						</div>
					</div>

					{/* Total Cost with Tax Range Box */}
					<div>
						<span className="text-3xl font-jakarta">
							Total Tax Range:
						</span>
						<div className="mt-2 rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex justify-end">
							{totalCostWithTaxRange}
						</div>
					</div>
				</div>
				<div className="p-5"></div>


				<div className="p-5"></div>
				<div className="flex flex-row mt-5 border-b-2 pb-2">
					<div className="px-2 w-[100px] font-bold font-jakarta border-r">Name</div>
					<div className="px-2 w-[100px] font-bold font-jakarta border-r">Quantity</div>
					<div className="px-2 w-[100px] font-bold font-jakarta border-r">FOB Price</div>
					<div className="px-2 w-[200px] font-bold font-jakarta border-r">Industry</div>
					<div className="px-2 w-[100px] font-bold font-jakarta border-r">HS Code</div>
					<div className="px-2 w-[200px] font-bold font-jakarta border-r">Total Item Cost</div>
					<div className="px-2 w-[300px] font-bold font-jakarta border-r">Item Tax Range</div>
					<div className="px-2 w-[100px] font-bold font-jakarta">Actions</div> {/* Actions like Remove button */}
				</div>

				{/* Items List */}
				{itemListings.map((item, index) => (
					<div key={index} className="flex flex-row items-center mt-2 border-b">
						<div className="px-2 w-[100px] text-xl border-r">{item.name}</div>
						<div className="px-2 w-[100px] text-xl border-r">{item.quantity}</div>
						<div className="px-2 w-[100px] text-xl border-r">{"$" + item.fobPrice.toFixed(2)}</div>
						<div className="px-2 w-[200px] text-xl border-r">{item.industry}</div>
						<div className="px-2 w-[100px] text-xl border-r">{item.hsCode || 'N/A'}</div>
						<div className="px-2 w-[200px] text-xl border-r">{"$" + (item.fobPrice * item.quantity).toFixed(2)}</div>
						<div className="px-2 w-[300px] text-xl border-r">{item.estimatedCostWithTax}</div>
						<div className="px-2 w-[100px]">
							<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => removeItem(index)}>
								Remove
							</button>
						</div>
					</div>
				))}


				<div className="flex flex-col w-60 p-5" style={{ backgroundColor: 'rgba(255, 255, 255, .4)', borderRadius: '20px' }}>
					<div className="flex flex-col" >
						<input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }} />

						<input type="number" placeholder="Quantity" value={itemQuantity} onChange={(e) => setItemQuantity(parseInt(e.target.value))} style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }} />
						<input type="number" placeholder="Unit FOB" value={itemUnitFOB} onChange={(e) => setItemUnitFOB(parseFloat(e.target.value))} style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }} />


						<select
							value={industry ?? ""}
							onChange={(e) => setIndustry(e.target.value === "" ? null : e.target.value as IndustryEnum)}
							style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
						>
							<option value="" disabled>Select industry</option>
							{INDUSTRY_OPTIONS.map((industryOption) => (
								<option key={industryOption} value={industryOption}>
									{industryOption}
								</option>
							))}
						</select>
						<input type="text" placeholder="HS Code (optional)" value={hsCode} onChange={(e) => setHsCode(e.target.value)} style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }} />
						<button onClick={() => {
							if (!itemName || !itemQuantity || !itemUnitFOB || !industry) { // Ensuring all required fields are filled
								alert("Please fill in all required fields.");
								return;
							}
							const newItem = {
								name: itemName,
								quantity: itemQuantity,
								fobPrice: itemUnitFOB,
								industry: industry,
								hsCode: hsCode,
							};
							setItems([...items, newItem]);
							setItemListings([...itemListings, newItem]); // Assuming itemListings is the correct state to update for display
							resetForm();
						}}>Add</button>
					</div>
				</div>
			</div>
			<div className="p-20"></div>
		</main>
	);
}
