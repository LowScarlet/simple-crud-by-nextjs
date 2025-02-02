'use client'

import { useGetAllPinjaman } from "../../api/pinjaman/model"
import { useGetAllAnggota } from "../../api/anggota/model"
import { useGetAllKategoriPinjaman } from "../../api/kategoriPinjaman/model"
import { useGetAllStatusPinjaman } from "../../api/statusPinjaman/model" // Add this import
import { useState } from "react"
import { Prisma } from "@prisma/client"
import axios from 'axios'
import { mutate } from "swr"
import { exportPinjamanToExcel } from './report'

const apiPath = '/api/pinjaman'
const defaultFormData = {
  jumlah: null as number | null,
  anggotaId: 0,
  kategoriPinjamanId: 0,
  statusPinjamanId: 0
}

type PinjamanWithRelations = Prisma.PinjamanGetPayload<{
  include: {
    Anggota: true;
    KategoriPinjaman: true;
    StatusPinjaman: true;
    PembayaranPinjaman: true;
  }
}>;

export default function Page() {
  const { data, isLoading } = useGetAllPinjaman()
  const { data: anggotaData } = useGetAllAnggota()
  const { data: kategoriData } = useGetAllKategoriPinjaman()
  const { data: statusData } = useGetAllStatusPinjaman() // Add this hook
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(defaultFormData)
  const [editId, setEditId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const url = editId
        ? `${apiPath}/${editId}`
        : apiPath

      const method = editId ? 'patch' : 'post'

      await axios({
        method,
        url,
        data: formData
      })

      setFormData(defaultFormData)
      setIsEditing(false)
      setEditId(null)
      setIsModalOpen(false)
      mutate((key: string) => key.startsWith('/api/'))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (editData: PinjamanWithRelations) => {
    setFormData({
      jumlah: editData.jumlah,
      anggotaId: editData.anggotaId,
      kategoriPinjamanId: editData.kategoriPinjamanId,
      statusPinjamanId: editData.statusPinjamanId,
    })
    setEditId(editData.id)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setFormData(defaultFormData)
    setIsEditing(false)
    setEditId(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus?')) {
      setDeletingId(id)
      try {
        await axios.delete(`${apiPath}/${id}`)
        mutate((key: string) => key.startsWith('/api/'))
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleExport = () => {
    if (data) {
      exportPinjamanToExcel(data);
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="loading loading-lg loading-spinner"></div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="p-2 md:p-4">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
          <h1 className="font-bold text-xl md:text-2xl">
            Data Pinjaman
          </h1>
          <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={handleExport}
              className="w-full sm:w-auto btn btn-info"
            >
              Export Excel
            </button>
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto btn btn-success"
            >
              Tambah Pinjaman
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal modal-open">
            <div className="w-11/12 max-w-2xl modal-box">
              <h2 className="mb-4 font-bold text-xl">{isEditing ? 'Edit' : 'Tambah'} Pinjaman</h2>
              <form onSubmit={handleSubmit} className="gap-4 form-control">
                <div>
                  <input
                    required
                    type="number"
                    placeholder="Jumlah"
                    value={formData.jumlah === null ? '' : formData.jumlah}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      jumlah: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="input-bordered w-full input"
                  />
                </div>
                <div>
                  <select
                    required
                    value={formData.anggotaId}
                    onChange={(e) => setFormData({ ...formData, anggotaId: parseInt(e.target.value) })}
                    className="w-full select-bordered select"
                  >
                    <option value="">Pilih Anggota</option>
                    {anggotaData?.map(anggota => (
                      <option key={anggota.id} value={anggota.id}>
                        {anggota.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    required
                    value={formData.kategoriPinjamanId}
                    onChange={(e) => setFormData({ ...formData, kategoriPinjamanId: parseInt(e.target.value) })}
                    className="w-full select-bordered select"
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriData?.map(kategori => (
                      <option key={kategori.id} value={kategori.id}>
                        {kategori.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    required
                    value={formData.statusPinjamanId}
                    onChange={(e) => setFormData({ ...formData, statusPinjamanId: parseInt(e.target.value) })}
                    className="w-full select-bordered select"
                  >
                    <option value="">Pilih Status</option>
                    {statusData?.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn"
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      isEditing ? 'Update' : 'Simpan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="-mx-4 md:mx-0 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="md:table-normal table table-compact">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                  <th>Sisa Pinjaman</th>
                  <th>Anggota</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((pinjaman, index) => (
                  <tr key={pinjaman.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(pinjaman.tanggal).toLocaleDateString()}</td>
                    <td>{pinjaman.jumlah}</td>
                    <td className="font-bold">{pinjaman.jumlah-pinjaman.PembayaranPinjaman.reduce((total, item) => total + item.jumlah, 0)}</td>
                    <td>{pinjaman.Anggota.nama}</td>
                    <td>{pinjaman.KategoriPinjaman.nama}</td>
                    <td>{pinjaman.StatusPinjaman.status}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(pinjaman)}
                        className="mr-2 btn btn-sm btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pinjaman.id)}
                        disabled={deletingId === pinjaman.id}
                        className="btn btn-error btn-sm"
                      >
                        {deletingId === pinjaman.id ? (
                          <span className="loading loading-sm loading-spinner"></span>
                        ) : (
                          'Hapus'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
