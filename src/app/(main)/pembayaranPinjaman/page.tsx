'use client'

import { useGetAllPembayaranPinjaman } from "../../api/pembayaranPinjaman/model"
import { useGetAllPinjaman } from "../../api/pinjaman/model"
import { useGetAllAnggota } from "../../api/anggota/model"
import { useGetAllMetodePembayaran } from "../../api/metodePembayaran/model"
import { useState } from "react"
import { Prisma } from "@prisma/client"
import axios from 'axios'
import { mutate } from "swr"

const apiPath = '/api/pembayaranPinjaman'
const defaultFormData = {
  jumlah: null as number | null,
  metodePembayaranId: 0,
  pinjamanId: 0,
  anggotaId: 0
}

type PembayaranPinjamanWithRelations = Prisma.PembayaranPinjamanGetPayload<{
  include: {
    MetodePembayaran: true;
    Pinjaman: true;
    Anggota: true;
  }
}>;

export default function Page() {
  const { data, isLoading } = useGetAllPembayaranPinjaman()
  const { data: pinjamanData } = useGetAllPinjaman()
  const { data: anggotaData } = useGetAllAnggota()
  const { data: metodePembayaranData } = useGetAllMetodePembayaran()
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

  const handleEdit = (editData: PembayaranPinjamanWithRelations) => {
    setFormData({
      jumlah: editData.jumlah,
      metodePembayaranId: editData.metodePembayaranId,
      pinjamanId: editData.pinjamanId,
      anggotaId: editData.anggotaId,
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
            Data Pembayaran Pinjaman
          </h1>
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto btn btn-success"
          >
            Tambah Pembayaran
          </button>
        </div>

        {isModalOpen && (
          <div className="modal modal-open">
            <div className="w-11/12 max-w-2xl modal-box">
              <h2 className="mb-4 font-bold text-xl">{isEditing ? 'Edit' : 'Tambah'} Pembayaran</h2>
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
                    value={formData.metodePembayaranId}
                    onChange={(e) => setFormData({ ...formData, metodePembayaranId: parseInt(e.target.value) })}
                    className="w-full select-bordered select"
                  >
                    <option value="">Pilih Metode Pembayaran</option>
                    {metodePembayaranData?.map(metode => (
                      <option key={metode.id} value={metode.id}>
                        {metode.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    required
                    value={formData.pinjamanId}
                    onChange={(e) => setFormData({ ...formData, pinjamanId: parseInt(e.target.value) })}
                    className="w-full select-bordered select"
                  >
                    <option value="">Pilih Pinjaman</option>
                    {pinjamanData?.map(pinjaman => (
                      <option key={pinjaman.id} value={pinjaman.id}>
                        ID: {pinjaman.id} - {pinjaman.Anggota.nama}
                      </option>
                    ))}
                  </select>
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
                  <th>Jumlah Bayar</th>
                  <th>Metode Pembayaran</th>
                  <th>Anggota</th>
                  <th>ID Pinjaman</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((pembayaran, index) => (
                  <tr key={pembayaran.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(pembayaran.tanggal).toLocaleDateString()}</td>
                    <td>{pembayaran.jumlah}</td>
                    <td className="font-bold">{pembayaran.jumlah+pembayaran.MetodePembayaran.biaya}</td>
                    <td>{pembayaran.MetodePembayaran.nama}</td>
                    <td>{pembayaran.Anggota.nama}</td>
                    <td>{pembayaran.pinjamanId}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(pembayaran)}
                        className="mr-2 btn btn-sm btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pembayaran.id)}
                        disabled={deletingId === pembayaran.id}
                        className="btn btn-error btn-sm"
                      >
                        {deletingId === pembayaran.id ? (
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
