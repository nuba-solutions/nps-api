import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const NotFoundPage = () => {
    return (
        <main className='min-h-screen w-full m-auto grid place-items-center place-content-center'>
            <Link href={'/'} className='h-full flex items-center'>
                <Image
                    src="/nvoicex.svg"
                    alt="Nvoicex Logo"
                    width={280}
                    height={100}
                    priority
                    className='select-none'
                />
            </Link>
            <div className='text-center mt-28'>
                <h1 className='text-[15rem] mb-24 font-bold text-primary-500'>404</h1>
                <p className='text-5xl font-semibold text-slate-500'>NOT FOUND</p>
            </div>
        </main>
    )
}

export default NotFoundPage