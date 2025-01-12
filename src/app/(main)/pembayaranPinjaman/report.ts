import ExcelJS from 'exceljs';
import { Prisma } from "@prisma/client";

type PinjamanWithRelations = Prisma.PinjamanGetPayload<{
  include: {
    Anggota: true;
    KategoriPinjaman: true;
    StatusPinjaman: true;
    PembayaranPinjaman: true;
  }
}>;

export const exportPinjamanToExcel = async (data: PinjamanWithRelations[]) => {
  if (!data) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data Pinjaman');

  // Set title
  worksheet.mergeCells('A1:F1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Laporan Data Pinjaman';
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Add date range
  worksheet.mergeCells('A2:F2');
  const dateCell = worksheet.getCell('A2');
  dateCell.value = `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`;
  dateCell.font = { size: 10 };
  dateCell.alignment = { horizontal: 'left', vertical: 'middle' };

  // Set headers
  const headers = ['No', 'Tanggal', 'Jumlah', 'Anggota', 'Kategori', 'Status'];
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Set columns width
  worksheet.columns = [
    { width: 5 },   // No
    { width: 15 },  // Tanggal
    { width: 15 },  // Jumlah
    { width: 30 },  // Anggota
    { width: 20 },  // Kategori
    { width: 15 },  // Status
  ];

  // Add data rows
  data.forEach((pinjaman, index) => {
    const row = worksheet.addRow([
      index + 1,
      new Date(pinjaman.tanggal).toLocaleDateString('id-ID'),
      pinjaman.jumlah,
      pinjaman.Anggota.nama,
      pinjaman.KategoriPinjaman.nama,
      pinjaman.StatusPinjaman.status
    ]);
    row.alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Add borders to all cells
  const lastRow = worksheet.rowCount;
  const lastCol = worksheet.columnCount;
  for (let i = 1; i <= lastRow; i++) {
    for (let j = 1; j <= lastCol; j++) {
      const cell = worksheet.getCell(i, j);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }

  // Add summary section
  const summaryRow = worksheet.addRow(['Total Pinjaman:', data.length, '', '', '', '']);
  summaryRow.getCell(1).font = { bold: true };
  summaryRow.getCell(2).font = { bold: true };

  // Add signature section
  worksheet.addRow([]);
  const signatureRow = worksheet.addRow(['', '', '', '', '', 'Pekanbaru, ' + new Date().toLocaleDateString('id-ID')]);
  signatureRow.getCell(6).alignment = { horizontal: 'center' };

  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);

  const nameRow = worksheet.addRow(['', '', '', '', '', 'Admin Sikotok']);
  nameRow.getCell(6).alignment = { horizontal: 'center' };

  // Generate excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_Data_Pinjaman_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
}
