import Image from "next/image";

export default function Home() {
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
			</div>
		</main>
	);
}
