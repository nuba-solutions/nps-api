import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
	return (
		<main className="min-h-screen w-full overflow-hidden relative bg-slate-100 grid grid-cols-1 grid-rows-2">
			<div className='flex flex-col lg:flex-row lg:items-center justify-between row-start-1 row-end-2 max-h-[150px] pt-10 lg:pt-0 px-10 lg:px-20'>
				<div>
					<h1 className='text-xl font-semibold text-indigo-950'>Welcome to Nvoicex</h1>
					<p className='text-sm text-slate-400'>A Nuba Solutions Payments Product</p>
				</div>
				<Link href={"https://nubasolutions.com"} target='_blank'
					className='text-sm bg-blue-800 text-white py-4 px-8 rounded-lg shadow-lg mr-auto lg:mr-0'
				>
					Visit Nuba Webpage
				</Link>
			</div>
			<Image
				src="/nvoicex.svg"
				alt="Nvoicex Logo"
				width={490}
				height={400}
				priority
				className='row-start-2 row-end-3 mx-auto w-6/12 lg:w-auto'
			/>
			<Image
				src="/icon.svg"
				alt="Nvoicex Icon"
				width={700}
				height={137}
				priority
				className='absolute -bottom-40 -left-11 z-0'
			/>
		</main>
	)
}
