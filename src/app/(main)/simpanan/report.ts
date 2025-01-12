import ExcelJS from 'exceljs';
import { Prisma } from "@prisma/client";

type SimpananWithRelations = Prisma.SimpananGetPayload<{
  include: {
    Anggota: true;
    KategoriSimpanan: true;
  }
}>;

export const exportSimpananToExcel = async (data: SimpananWithRelations[]) => {
  if (!data) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data Simpanan');

  // Set title
  worksheet.mergeCells('A1:E1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Laporan Data Simpanan';
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Add date range
  worksheet.mergeCells('A2:E2');
  const dateCell = worksheet.getCell('A2');
  dateCell.value = `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`;
  dateCell.font = { size: 10 };
  dateCell.alignment = { horizontal: 'left', vertical: 'middle' };

  // Set headers
  const headers = ['No', 'Tanggal', 'Jumlah', 'Anggota', 'Kategori'];
  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

  // Set columns width
  worksheet.columns = [
    { width: 5 },   // No
    { width: 15 },  // Tanggal
    { width: 20 },  // Jumlah
    { width: 30 },  // Anggota
    { width: 25 },  // Kategori
  ];

  // Add data rows
  data.forEach((simpanan, index) => {
    const row = worksheet.addRow([
      index + 1,
      new Date(simpanan.tanggal).toLocaleDateString('id-ID'),
      simpanan.jumlah,
      simpanan.Anggota.nama,
      simpanan.KategoriSimpanan.nama
    ]);
    row.alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
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
  const totalSimpanan = data.reduce((sum, item) => sum + item.jumlah, 0);
  const summaryRow = worksheet.addRow(['Total Simpanan:', '', totalSimpanan, '', '']);
  summaryRow.getCell(1).font = { bold: true };
  summaryRow.getCell(3).font = { bold: true };
  summaryRow.getCell(3).alignment = { horizontal: 'right' };

  // Add signature section
  worksheet.addRow([]);
  const signatureRow = worksheet.addRow(['', '', '', '', 'Pekanbaru, ' + new Date().toLocaleDateString('id-ID')]);
  signatureRow.getCell(5).alignment = { horizontal: 'center' };

  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);

  const nameRow = worksheet.addRow(['', '', '', '', 'Admin Sikotok']);
  nameRow.getCell(5).alignment = { horizontal: 'center' };

  // Generate excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_Data_Simpanan_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
}
