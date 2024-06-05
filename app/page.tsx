"use client"

import { CostAllocationEnum, IndustryEnum, ItemInput, ItemListingOutput, ItemType, TransportEnum } from "@/utils/processItems";
import emailjs from 'emailjs-com';
import { useEffect, useState } from "react";

export default function Home() {
	const [items, setItems] = useState<ItemInput[]>([]);
	const [email, setEmail] = useState('');
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

	const resetForm = () => {
		// Reset form logic here if needed
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
		"Food-supplements": { min: 15, max: 15 },
		Vitamins: { min: 15, max: 15 },
		"Sports-supplements": { min: 15, max: 15 },
		"Sex-toys": { min: 10, max: 15 },
		"Electronic-Sex-toys": { min: 10, max: 15 },
		"Electronic-Toys": { min: 10, max: 15 },
		Electronics: { min: 10, max: 15 },
		Clothes: { min: 5, max: 25 },
	};

	const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const sendEmail = () => {
		const table = itemListings.map((item, index) =>
			`Name: ${item.name}, Quantity: ${item.quantity}, FOB Price: $${item.fobPrice.toFixed(2)}, Total Cost: $${(item.fobPrice * item.quantity).toFixed(2)}, Estimated Tax: ${item.estimatedCostWithTax}`
		).join('\n');

		const templateParams = {
			email,
			total_cost: `$${totalCost.toFixed(2)}`,
			tax_range: totalCostWithTaxRange,
			table,
		};

		emailjs.send('service_4e36gr8', 'template_cvwnb7s', templateParams, 'X7PlEZQgKqxgfC7Wa')
			.then(response => {
				console.log('Model delivered!', response);
				alert('Model delivered!');
			}, error => {
				console.error('Error in delivering model: ', error);
				alert('Error in delivering model. Please try again.');
			});
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
				estimatedCostWithTax: `$${Number(minTaxCost.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}-$${Number(maxTaxCost.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
			};
		});

		setTotalCost(total);
		setTotalCostWithTaxRange(`$${Number(totalMinTaxed.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}-$${Number(totalMaxTaxed.toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
		setItemListings(updatedItemListings);
	}, [items]);

	return (
		<main className="w-screen min-h-screen bg-white p-4">
			<h1 className="text-center text-4xl font-bold font-jakarta text-custom-blue p-5">Cubbo Import Tax Calculator</h1>
			<div className="p-5"></div>

			<div className="flex flex-col w-full place-items-center">
				<div className="flex flex-col md:flex-row items-start justify-center space-x-0 md:space-x-6">
					<div className="mb-4 md:mb-0">
						<span className="text-3xl font-jakarta">
							Cost of Goods:
						</span>
						<div className="mt-2 rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex justify-end">
							{"$" + totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
						</div>
					</div>
					<div className="mb-4 md:mb-0">
						<span className="text-3xl font-jakarta">
							Total Tax Range:
						</span>
						<div className="mt-2 rounded-xl border-2 w-[300px] text-2xl p-2 px-4 flex justify-end">
							{totalCostWithTaxRange}
						</div>
					</div>
				</div>
				<div className="p-5"></div>
				<div className="text-center my-4">
				
                        <iframe
                            width="560"
							height="315"
                            src="https://www.youtube.com/embed/VXEZJIZPEpg?si=qRANyxe1sbAq_Tpi"
                            title="Tool Summary"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    
				</div>

				<div className="p-5"></div>
				<div className="flex flex-col w-full overflow-x-auto items-center">
					<div className="flex flex-row min-w-[800px] border-b-2 pb-2 justify-center">
						<div className="px-2 w-[100px] font-bold font-jakarta border-r">Name</div>
						<div className="px-2 w-[100px] font-bold font-jakarta border-r">Quantity</div>
						<div className="px-2 w-[150px] font-bold font-jakarta border-r">FOB Price</div>
						<div className="px-2 w-[200px] font-bold font-jakarta border-r">Industry</div>
						<div className="px-2 w-[200px] font-bold font-jakarta border-r">Total Item Cost</div>
						<div className="px-2 w-[260px] font-bold font-jakarta border-r">Item Tax Range</div>
						<div className="px-2 w-[100px] font-bold font-jakarta">Actions</div>
					</div>

					{itemListings.map((item, index) => (
						<div key={index} className="flex flex-row items-center min-w-[800px] mt-2 border-b justify-center">
							<div className="px-2 w-[100px] text-xl border-r">{item.name}</div>
							<div className="px-2 w-[100px] text-xl border-r">{item.quantity}</div>
							<div className="px-2 w-[150px] text-xl border-r">{"$" + item.fobPrice.toFixed(2)}</div>
							<div className="px-2 w-[200px] text-xl border-r">{item.industry}</div>
							<div className="px-2 w-[200px] text-xl border-r">{"$" + (item.fobPrice * item.quantity).toFixed(2)}</div>
							<div className="px-2 w-[260px] text-xl border-r">{item.estimatedCostWithTax}</div>
							<div className="px-2 w-[100px]">
								<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => removeItem(index)}>
									Remove
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="flex flex-col w-full max-w-xs p-5 mt-5 bg-white bg-opacity-40 rounded-2xl">
					<input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} className="p-2 mb-2 border rounded bg-transparent" />
					<input type="number" placeholder="Quantity" value={itemQuantity} onChange={(e) => setItemQuantity(parseInt(e.target.value))} className="p-2 mb-2 border rounded bg-transparent" />
					<input type="number" placeholder="Unit FOB" value={itemUnitFOB} onChange={(e) => setItemUnitFOB(parseFloat(e.target.value))} className="p-2 mb-2 border rounded bg-transparent" />
					<select value={industry ?? ""} onChange={(e) => setIndustry(e.target.value === "" ? null : e.target.value as IndustryEnum)} className="p-2 mb-2 border rounded bg-transparent">
						<option value="" disabled>Select industry</option>
						{INDUSTRY_OPTIONS.map((industryOption) => (
							<option key={industryOption} value={industryOption}>
								{industryOption}
							</option>
						))}
					</select>
					<button onClick={() => {
						if (!itemName || !itemQuantity || !itemUnitFOB || !industry) {
							alert("Please fill in all required fields.");
							return;
						}
						const newItem = {
							name: itemName,
							quantity: itemQuantity,
							fobPrice: itemUnitFOB,
							industry: industry,
						};
						setItems([...items, newItem]);
						setItemListings([...itemListings, newItem]);
						resetForm();
					}} className="p-2 mt-2 text-white bg-blue-500 rounded">Add</button>
				</div>

				<div className="flex flex-col items-center w-full mt-5">
					<input
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="p-2 mb-2 border rounded"
					/>
					<button
						onClick={sendEmail}
						disabled={!isValidEmail(email)}
						className={`p-2 mt-2 text-white rounded ${!isValidEmail(email) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'}`}
					>
						Send Model for Finalization
					</button>
				</div>
			</div>
			<div className="p-20"></div>
		</main>
	);
}
