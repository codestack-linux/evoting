"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadRekap() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();

      const doc = new jsPDF();
      const date = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // --- HEADER LAPORAN ---
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN HASIL E-VOTING OSIS", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.text("SMK NEGERI WONOASRI", 105, 28, { align: "center" });

      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      // --- INFORMASI RINGKAS ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Tanggal Cetak: ${date}`, 20, 45);
      doc.text(`Total Daftar Pemilih (DPT): ${data.totalTokens}`, 20, 52);
      doc.text(`Total Suara Masuk: ${data.totalVotes}`, 20, 59);
      doc.text(`Tingkat Partisipasi: ${data.participation}%`, 20, 66);

      // --- TABEL PEROLEHAN SUARA ---
      autoTable(doc, {
        startY: 75,
        head: [["No", "Nama Kandidat", "Perolehan Suara", "Persentase"]],
        body: data.chartData.map((item: any, index: number) => [
          index + 1,
          item.name,
          `${item.suara} Suara`,
          `${((item.suara / (data.totalVotes || 1)) * 100).toFixed(1)}%`,
        ]),
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
        },
        theme: "striped",
      });

      // --- TANDA TANGAN ---
      const finalY = (doc as any).lastAutoTable.finalY + 30;
      doc.text("Mengetahui,", 150, finalY, { align: "center" });
      doc.text("Ketua Panitia,", 150, finalY + 7, { align: "center" });
      doc.text("( ____________________ )", 150, finalY + 30, {
        align: "center",
      });

      // Download File
      doc.save(`Rekap_Voting_OSIS_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Gagal mendownload PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
    >
      {isDownloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <FileDown className="w-5 h-5 text-blue-600" />
      )}
      {isDownloading ? "Menyusun PDF..." : "Download Rekap PDF"}
    </button>
  );
}
