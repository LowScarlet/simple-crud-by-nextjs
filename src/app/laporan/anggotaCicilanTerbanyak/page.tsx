'use client'

import { AnggotaCicilanTerbanyak, useAnggotaCicilanTerbanyak } from "@/app/api/laporan/anggotaCicilanTerbanyak/model"
import { PDFDownloadLink, Document, Page as PDFPage, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 30, paddingTop: 20 },
  title: { fontSize: 20, marginBottom: 15, textAlign: 'center' },
  date: { fontSize: 12, textAlign: 'left', marginBottom: 15 },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: "row" },
  tableCol: { width: "45%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: "auto", marginTop: 5, marginBottom: 5, fontSize: 10 },
  signatureContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    textAlign: 'center'
  },
  signatureText: {
    fontSize: 10,
    marginBottom: 40,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
  }
});

const PDFDocument = ({ data }: { data: AnggotaCicilanTerbanyak[] }) => (
  <Document>
    <PDFPage size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>Laporan Anggota Cicilan Terbanyak</Text>
      <Text style={styles.date}>{new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={
            {
              ...styles.tableCol,
              width: "10%"
            }
          }>
            <Text style={styles.tableCell}>No</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Nama Anggota</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Jumlah Cicilan</Text>
          </View>
        </View>
        {data?.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={
              {
                ...styles.tableCol,
                width: "10%"
              }
            }>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.nama}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item._count.PembayaranPinjaman}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.signatureContainer}>
        <Text style={styles.signatureText}>Pekanbaru, {new Date().toLocaleDateString('id-ID')}</Text>
        <Text style={styles.signatureText}>Ketua Koperasi</Text>
        <Text style={styles.signatureName}>Tegar Maulana Fahreza</Text>
      </View>
    </PDFPage>
  </Document>
);

export default function Page() {
  const { data, isLoading } = useAnggotaCicilanTerbanyak()

  if (isLoading || !data) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Anggota Cicilan Terbanyak</h1>
        <PDFDownloadLink
          document={<PDFDocument data={data} />}
          fileName="anggota-cicilan-terbanyak.pdf"
        >
          Test Download
        </PDFDownloadLink>
      </div>
    </div>
  )
}
