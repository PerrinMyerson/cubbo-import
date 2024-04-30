export type ItemType = "other";
export type CostAllocationEnum = "CBM" | "Units" | "Weight";
export type IndustryEnum = 
	"Cosmetics"
	| "Dermocosmetic"
	| "MechanicalToys"
	| "Perfumes"
	| "Sunglasses"
	| "Young-Children-Toys"
	| "Food-supplements"
	| "Vitamins"
	| "Sports-supplements"
	| "Sex-toys"
	| "Electronic-Sex-toys"
	| "Electronic-Toys"
	| "Electronics"
	| "Clothes";

export type TransportEnum = "unknown";

export type ItemInput = {
	name: string,
	quantity: number,
	fobPrice: number,
	industry: IndustryEnum, // Make industry mandatory
	
};

export interface ItemListingOutput {
    name: string;
    quantity: number;
    fobPrice: number;
    industry: string;
    totalItemCost?: number;
    estimatedCostWithTax?: string;
}
/*
const unitCBM = (item: ItemInput): number => {
	return item.volume / 1000000;
}

const calcCBM = (item: ItemInput): number => {
	return item.volume * item.quantity / 1000000;
}

const calcWeightKg = (item: ItemInput): number => {
	return item.weight * item.quantity;
}

const calcCost = (item: ItemInput): number => {
	return item.fobPrice * item.quantity;
}

const pctShipmentValue = (item: ItemInput, totalCost: number): number => {
	return calcCost(item) / totalCost;
}

const pivotFreightCalculation = (costAllocation: CostAllocationEnum, item: ItemInput): number => {
	switch (costAllocation) {
		case "CBM":
			return calcCBM(item);
		case "Units":
			return item.quantity;
		case "Weight":
			return calcWeightKg(item);
	}
}

const pivotForUnitEconomics = (costAllocation: CostAllocationEnum, item: ItemInput): number => {
	switch (costAllocation) {
		case "CBM":
			return unitCBM(item);
		case "Units":
			return 1;
		case "Weight":
			return item.weight;
	}
}

type ItemListingType1 = ItemInput & {
	cbm: number,
	weightKg: number,
	cost: number,
	pivotFreightEconomics: number,
	pivotForUnitEconomics: number,
};

const makeItemListing1 = (item: ItemInput): ItemListingType1 => {
	return {
		...item,
		cbm: calcCBM(item),
		weightKg: calcWeightKg(item),
		cost: calcCost(item),
		pivotFreightEconomics: pivotFreightCalculation(item.costAllocation, item),
		pivotForUnitEconomics: pivotForUnitEconomics(item.costAllocation, item),
	};
}

const freightPerUnit = (costAllocation: CostAllocationEnum, item: ItemInput, totalShipment: number, totalPivotFreightCalculation: number): number => {
	return totalShipment * (pivotForUnitEconomics(costAllocation, item) / totalPivotFreightCalculation);
}

// visible to user
const cifPrice = (item: ItemListingType1, totalShipment: number, totalPivotFreightCalculation: number): number => {
	return item.fobPrice + freightPerUnit(item.costAllocation, item, totalShipment, totalPivotFreightCalculation) + (item.fobPrice * item.insurancePct);
}

const makeItemListing2 = (item: ItemListingType1, totalShipment: number, totalPivotFreightCalculation: number) => {
	return {
		...item,
		// freightPerUnit: freightPerUnit(item.costAllocation, item, totalShipment, totalPivotFreightCalculation),
		cifPrice: cifPrice(item, totalShipment, totalPivotFreightCalculation),
	};
}

export type ItemListingOutput = ItemListingType1 & {
	// freightPerUnit: number,
	cifPrice: number,
};

export const makeFullItemListings = (items: ItemInput[], totalShipment: number) => {
	const itemListings1 = items.map(makeItemListing1);
	console.log(itemListings1);
	const totalPivotFreightCalculation = itemListings1.reduce((acc, item) => acc + item.pivotFreightEconomics, 0);
	console.log(totalPivotFreightCalculation);
	return ({
		items: itemListings1.map(item => makeItemListing2(item, totalShipment, totalPivotFreightCalculation)),
		totalPivotSum: totalPivotFreightCalculation,
	});
}
*/