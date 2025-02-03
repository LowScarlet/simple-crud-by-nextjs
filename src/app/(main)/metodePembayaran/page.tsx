'use client'

import { useGetAllMetodePembayaran } from "../../api/metodePembayaran/model"
import { useState } from "react"
import { Prisma } from "@prisma/client"
import axios from 'axios'
import { mutate } from "swr"
import { useMetodePembayaranPopuler } from "@/app/api/laporan/metodePembayaranPopuler/model"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { PembayaranPopuler } from "@/app/laporan/metodePembayaranPopuler/page"

const apiPath = '/api/metodePembayaran'
const defaultFormData = {
  nama: '',
  kode: '',
  biaya: 0
}

const LaporanSelect = () => {
  const { data: metodePembayaranPopuler } = useMetodePembayaranPopuler()
  return (
    <div className="dropdown">
      <label tabIndex={0} className="w-full sm:w-auto btn">Laporan</label>
      <ul tabIndex={0} className="z-[1] bg-base-100 shadow p-2 rounded-box w-52 dropdown-content menu">
        <li>
          <PDFDownloadLink
            document={<PembayaranPopuler data={metodePembayaranPopuler} />}
            fileName="metode-pembayaran-populer.pdf"
          >
            Metode Pembayaran Populer
          </PDFDownloadLink>
        </li>
      </ul>
    </div>
  )
}

export default function Page() {
  const { data, isLoading } = useGetAllMetodePembayaran()
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

  const handleEdit = (editData: Prisma.MetodePembayaranCreateInput & { id: number }) => {
    setFormData({
      nama: editData.nama,
      kode: editData.kode,
      biaya: editData.biaya
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
            Data Metode Pembayaran
          </h1>
          <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto">
            <LaporanSelect />
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto btn btn-success"
            >
              Tambah Metode
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal modal-open">
            <div className="w-11/12 max-w-2xl modal-box">
              <h2 className="mb-4 font-bold text-xl">{isEditing ? 'Edit' : 'Tambah'} Metode Pembayaran</h2>
              <form onSubmit={handleSubmit} className="gap-4 form-control">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Nama Metode"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="input-bordered w-full input"
                  />
                </div>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Kode"
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    className="input-bordered w-full input"
                  />
                </div>
                <div>
                  <input
                    required
                    type="number"
                    placeholder="Biaya"
                    value={formData.biaya}
                    onChange={(e) => setFormData({ ...formData, biaya: parseInt(e.target.value) })}
                    className="input-bordered w-full input"
                  />
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
                  <th>Nama</th>
                  <th>Kode</th>
                  <th>Biaya</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((metode, index) => (
                  <tr key={metode.id}>
                    <td>{index + 1}</td>
                    <td>{metode.nama}</td>
                    <td>{metode.kode}</td>
                    <td>{metode.biaya.toLocaleString('id-ID')}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(metode)}
                        className="mr-2 btn btn-sm btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(metode.id)}
                        disabled={deletingId === metode.id}
                        className="btn btn-error btn-sm"
                      >
                        {deletingId === metode.id ? (
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
