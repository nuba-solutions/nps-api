import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
	return (
		<main className="min-h-screen w-full overflow-hidden relative bg-slate-100 grid grid-cols-1 grid-rows-2">
			<div className='flex flex-col lg:flex-row lg:items-center justify-between row-start-1 row-end-2 max-h-[150px] pt-10 lg:pt-0 px-10 lg:px-20'>
				<div>
					<h1 className='text-xl font-semibold text-secondary-400'>Welcome to Nvoicex API</h1>
					<p className='text-sm text-slate-400'>A Payment Software by Nuba Solutions.</p>
				</div>
				<Link href={"https://nubasolutions.com"} target='_blank'
					className='btn btn-primary shadow-lg mr-auto lg:mr-0'
				>
					Visit Nuba Webpage
				</Link>
			</div>
			<Image
				src="/nvoicex.svg"
				alt="Nvoicex Logo"
				width={200}
				height={200}
				priority
				className='row-start-2 row-end-3 mx-auto w-6/12 lg:w-4/12 2xl:w-3/12 select-none'
			/>
			<Image
				src="/icon.svg"
				alt="Nvoicex Icon"
				width={900}
				height={137}
				priority
				className='absolute -bottom-40 -right-28 z-0'
			/>
			<div className='flex flex-col absolute bottom-10 left-10'>
				<div className='flex items-center gap-2'>
					<pre className='text-slate-400'>API Version:</pre>
					<pre className='text-secondary-400'>{process.env.NEXT_PUBLIC_NPS_API_VERSION}</pre>
				</div>
				<div className='flex items-center gap-2'>
					<pre className='text-slate-400'>Status:</pre>
					<div className='flex items-center gap-2'>
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
						</span>
						<pre className='text-secondary-400'>Running</pre>
					</div>
				</div>
			</div>
		</main>
	)
}
