export default function Home() {
  return (
    <div className="p-4">
      <h1 className="mb-4 font-bold text-2xl">Data Master</h1>
      <ol className="pl-8 list-decimal">
        <li>
          <a href="/anggota" className="text-blue-600 hover:underline">Anggota</a>
        </li>
        <li>
          <a href="/kategori-pinjaman" className="text-blue-600 hover:underline">Kategori Pinjaman</a>
        </li>
        <li>
          <a href="/kategori-simpanan" className="text-blue-600 hover:underline">Kategori Simpanan</a>
        </li>
        <li>
          <a href="/metode-pembayaran" className="text-blue-600 hover:underline">Metode Pembayaran</a>
        </li>
        <li>
          <a href="/status-pinjaman" className="text-blue-600 hover:underline">Status Pinjaman</a>
        </li>
        <li>
          <a href="/simpanan" className="text-blue-600 hover:underline">Simpanan</a>
        </li>
        <li>
          <a href="/pinjaman" className="text-blue-600 hover:underline">Pinjaman</a>
        </li>
        <li>
          <a href="/pembayaran-pinjaman" className="text-blue-600 hover:underline">Pembayaran Pinjaman</a>
        </li>
      </ol>
    </div>
  );
}
