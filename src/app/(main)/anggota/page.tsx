'use client'

import { AnggotaWithRelations, useGetAllAnggota } from "../../api/anggota/model"
import { useState } from "react"
import axios from 'axios'
import { mutate } from "swr"

const apiPath = '/api/anggota'
const defaultFormData = {
  nama: '',
  telepon: '',
  alamat: '',
  tanggalLahir: '',
  jenisKelamin: '',
  tanggalDaftar: ''
}

export default function Page() {
  const { data, isLoading } = useGetAllAnggota()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(defaultFormData)
  const [editId, setEditId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const url = editId
        ? `${apiPath}/${editId}`
        : apiPath

      const method = editId ? 'patch' : 'post'

      const formattedData = {
        ...formData,
        tanggalLahir: new Date(formData.tanggalLahir).toISOString(),
        tanggalDaftar: editId ? new Date(formData.tanggalDaftar).toISOString() : undefined
      }

      await axios({
        method,
        url,
        data: formattedData
      })

      setFormData(defaultFormData)
      setIsEditing(false)
      setEditId(null)
      setIsModalOpen(false)
      mutate((key: string) => key.startsWith('/api/'));
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (editData: AnggotaWithRelations) => {
    setFormData({
      nama: editData.nama,
      telepon: editData.telepon,
      alamat: editData.alamat,
      tanggalLahir: new Date(editData.tanggalLahir).toISOString().split('T')[0],
      jenisKelamin: editData.jenisKelamin,
      tanggalDaftar: editData.tanggalDaftar ? new Date(editData.tanggalDaftar).toISOString().split('T')[0] : ''
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

  const handleExportToExcel = async () => {
    if (data) {
      //
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus?')) {
      setDeletingId(id);
      try {
        await axios.delete(`${apiPath}/${id}`);
        mutate((key: string) => key.startsWith('/api/'));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-lg loading-spinner"></div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen">
      <div className="p-2 md:p-4">
        <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
          <h1 className="font-bold text-xl md:text-2xl">
            Data Anggota
          </h1>
          <div className="flex sm:flex-row flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportToExcel}
              className="w-full sm:w-auto btn btn-primary"
            >
              Laporan Excel
            </button>
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto btn btn-success"
            >
              Tambah Anggota
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="w-11/12 max-w-2xl modal-box">
              <h2 className="mb-4 font-bold text-xl">{isEditing ? 'Edit' : 'Tambah'} Anggota</h2>
              <form onSubmit={handleSubmit} className="gap-4 form-control">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="input-bordered w-full input"
                  />
                </div>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Telepon"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="input-bordered w-full input"
                  />
                </div>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Alamat"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="input-bordered w-full input"
                  />
                </div>
                <div>
                  <input
                    required
                    type="date"
                    placeholder="Tanggal Lahir"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="input-bordered w-full input"
                  />
                </div>
                <div>
                  <select
                    required
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                    className="w-full select-bordered select"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
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
                  <th>Nama</th>
                  <th>Telepon</th>
                  <th>Alamat</th>
                  <th>Tanggal Lahir</th>
                  <th>Jenis Kelamin</th>
                  <th>Tanggal Daftar</th>
                  <th>Total Pinjaman</th>
                  <th>Total Simpanan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((anggota, index) => (
                  <tr key={anggota.id}>
                    <td>{index + 1}</td>
                    <td>{anggota.nama}</td>
                    <td>{anggota.telepon}</td>
                    <td>{anggota.alamat}</td>
                    <td>{new Date(anggota.tanggalLahir).toLocaleDateString()}</td>
                    <td>{anggota.jenisKelamin}</td>
                    <td>{new Date(anggota.tanggalDaftar).toLocaleDateString()}</td>
                    <td className="font-bold">{anggota.Simpanan.reduce((sum, item) => sum + item.jumlah, 0)}</td>
                    <td className="font-bold">{anggota.Pinjaman.reduce((sum, item) => sum + item.jumlah, 0)}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(anggota)}
                        className="mr-2 btn btn-sm btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(anggota.id)}
                        disabled={deletingId === anggota.id}
                        className="btn btn-error btn-sm"
                      >
                        {deletingId === anggota.id ? (
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
