'use client'

import { useGetAllKategoriPinjaman } from "../../api/kategoriPinjaman/model"
import { useState } from "react"
import { Prisma } from "@prisma/client"
import axios from 'axios'
import { mutate } from "swr"
import { PinjamanPopuler } from "@/app/laporan/kategoriPinjamanPopuler/page"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { useKategoriPinjamanPopuler } from "@/app/api/laporan/kategoriPinjamanPopuler/model"

const apiPath = '/api/kategoriPinjaman'
const defaultFormData = {
  nama: '',
  kode: ''
}

const LaporanSelect = () => {
  const { data: pinjamanPopuler } = useKategoriPinjamanPopuler()
  return (
    <div className="dropdown">
      <label tabIndex={0} className="w-full sm:w-auto btn">Laporan</label>
      <ul tabIndex={0} className="z-[1] bg-base-100 shadow p-2 rounded-box w-52 dropdown-content menu">
        <li>
          <PDFDownloadLink
            document={<PinjamanPopuler data={pinjamanPopuler} />}
            fileName="kategori-pinjaman-populer.pdf"
          >
            Pinjaman Populer
          </PDFDownloadLink>
        </li>
      </ul>
    </div>
  )
}

export default function Page() {
  const { data, isLoading } = useGetAllKategoriPinjaman()
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

  const handleEdit = (editData: Prisma.KategoriPinjamanCreateInput & { id: number }) => {
    setFormData({
      nama: editData.nama,
      kode: editData.kode
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
            Data Kategori Pinjaman
          </h1>
          <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto">
            <LaporanSelect />
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto btn btn-success"
            >
              Tambah Kategori
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal modal-open">
            <div className="w-11/12 max-w-2xl modal-box">
              <h2 className="mb-4 font-bold text-xl">{isEditing ? 'Edit' : 'Tambah'} Kategori Pinjaman</h2>
              <form onSubmit={handleSubmit} className="gap-4 form-control">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Nama Kategori"
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
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((kategori, index) => (
                  <tr key={kategori.id}>
                    <td>{index + 1}</td>
                    <td>{kategori.nama}</td>
                    <td>{kategori.kode}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(kategori)}
                        className="mr-2 btn btn-sm btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(kategori.id)}
                        disabled={deletingId === kategori.id}
                        className="btn btn-error btn-sm"
                      >
                        {deletingId === kategori.id ? (
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
