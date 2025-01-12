import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="top-0 z-50 sticky bg-base-100 shadow-lg px-4 navbar">
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/images/logo222.png"
              alt="Logo Koperasi"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-xl">SIKOTOK</span>
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <div className="flex-none lg:hidden">
        <button className="btn btn-ghost btn-square" onClick={() => setIsOpen(!isOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
               className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Desktop menu */}
      <div className="lg:block flex-none hidden">
        <ul className="px-1 menu menu-horizontal">
          <li><Link href="/anggota">Anggota</Link></li>
          <li><Link href="/kategoriPinjaman">Kategori</Link></li>
          <li><Link href="/kategoriSimpanan">Kategori Simpanan</Link></li>
          <li><Link href="/metodePembayaran">Metode Pembayaran</Link></li>
          <li><Link href="/statusPinjaman">Status Pinjaman</Link></li>
          <li><Link href="/simpanan">Simpanan</Link></li>
          <li><Link href="/pinjaman">Pinjaman</Link></li>
          <li><Link href="/pembayaranPinjaman">Pembayaran Pinjaman</Link></li>
        </ul>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="top-full right-0 left-0 absolute lg:hidden bg-base-100 shadow-lg">
          <ul className="p-2 menu menu-compact">
            <li><Link href="/anggota">Anggota</Link></li>
            <li><Link href="/kategori">Kategori</Link></li>
            <li><Link href="/pinjaman">Pinjaman</Link></li>
            <li><Link href="/kategori-simpanan">Kategori Simpanan</Link></li>
            <li><Link href="/metode-pembayaran">Metode Pembayaran</Link></li>
            <li><Link href="/status-pinjaman">Status Pinjaman</Link></li>
            <li><Link href="/simpanan">Simpanan</Link></li>
            <li><Link href="/pembayaran-pinjaman">Pembayaran Pinjaman</Link></li>
          </ul>
        </div>
      )}
    </nav>
  )
}
