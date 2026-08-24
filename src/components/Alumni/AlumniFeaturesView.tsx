import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Download,
  Award,
  FileCheck,
  GraduationCap,
  FileText,
  Files,
  Laptop,
  CheckCircle2,
  Clock,
  Send,
  Search,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const AlumniFeaturesView: React.FC = () => {
  const { activeTab, currentUser } = useLms();

  // Legalisir Form State
  const [legalisirDocType, setLegalisirDocType] = useState('Ijazah S1');
  const [legalisirCopies, setLegalisirCopies] = useState('5');
  const [deliveryMethod, setDeliveryMethod] = useState('ambil_langsung');
  const [legalisirSuccess, setLegalisirSuccess] = useState(false);

  const handleLegalisirSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLegalisirSuccess(true);
    setTimeout(() => {
      setLegalisirSuccess(false);
    }, 4000);
  };

  // Unduh View
  if (activeTab === 'unduh') {
    const downloadables = [
      {
        id: '1',
        title: 'Surat Keterangan Lulus (SKL) Digital',
        code: 'UNM/SKL/2026/0892',
        size: '1.2 MB',
        date: '15 Januari 2026',
        type: 'PDF',
      },
      {
        id: '2',
        title: 'Salinan Transkrip Nilai Akademik Resmi',
        code: 'UNM/TRA/11240243/2026',
        size: '2.4 MB',
        date: '20 Januari 2026',
        type: 'PDF',
      },
      {
        id: '3',
        title: 'Surat Keterangan Bebas Perpustakaan & Laboratorium',
        code: 'UNM/LIB/2026/0411',
        size: '850 KB',
        date: '10 Januari 2026',
        type: 'PDF',
      },
      {
        id: '4',
        title: 'Formulir Pendaftaran Ikatan Alumni UNM (IKA-UNM)',
        code: 'IKA-UNM/FORM/2026',
        size: '540 KB',
        date: '01 Februari 2026',
        type: 'DOCX',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-orange-500" />
              Pusat Unduh Berkas & Dokumen Alumni
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unduh dokumen akademik resmi ber-QR Code validasi dari Universitas Nusa Mandiri
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloadables.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">{doc.code}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                  {doc.type}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Ukuran: {doc.size}</span>
                <button
                  onClick={() => alert(`Mengunduh ${doc.title}...`)}
                  className="px-3 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // E-Sertifikat View
  if (activeTab === 'e-sertifikat') {
    const certs = [
      {
        id: 'c1',
        title: 'SKPI (Surat Keterangan Pendamping Ijazah)',
        issuer: 'Biro Akademik UNM',
        nomor: 'SKPI/UNM/2026/11240243',
        status: 'Terverifikasi',
      },
      {
        id: 'c2',
        title: 'Sertifikasi Kompetensi BNSP: Web Programmer',
        issuer: 'LSP Informatika UNM',
        nomor: 'BNSP/LSP-UNM/2025/9981',
        status: 'Terverifikasi',
      },
      {
        id: 'c3',
        title: 'Sertifikat TOEFL Institutional (Score: 540)',
        issuer: 'Language Center UNM',
        nomor: 'TOEFL/LC-UNM/2025/1124',
        status: 'Terverifikasi',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              E-Sertifikat & Portofolio SKPI
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daftar sertifikasi kompetensi dan rekognisi akademik terintegrasi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-3"
            >
              <div className="w-9 h-9 rounded bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{cert.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{cert.issuer}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1">{cert.nomor}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {cert.status}
                </span>
                <button
                  onClick={() => alert(`Membuka sertifikat ${cert.title}`)}
                  className="text-xs font-bold text-orange-500 hover:underline"
                >
                  Lihat Sertifikat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Legalisir View
  if (activeTab === 'legalisir') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-orange-500" />
              Layanan Legalisir Ijazah & Transkrip Online
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengajuan tanda tangan dan cap legalisir basah atau digital dari Rektorat UNM
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Pengajuan */}
          <div className="bg-white dark:bg-[#0f172a] rounded-md border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Formulir Permohonan Legalisir
            </h3>

            {legalisirSuccess ? (
              <div className="p-4 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
                ✓ Permohonan legalisir berhasil dikirim! Kode Tracking:{' '}
                <strong>LEG-UNM-2026-092</strong>. Petugas BAAK akan memverifikasi dalam 1-2 hari kerja.
              </div>
            ) : (
              <form onSubmit={handleLegalisirSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Dokumen yang Dilegalisir</label>
                  <select
                    value={legalisirDocType}
                    onChange={(e) => setLegalisirDocType(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  >
                    <option value="Ijazah S1">Ijazah S1 Asli</option>
                    <option value="Transkrip Nilai">Transkrip Nilai Akademik</option>
                    <option value="Ijazah + Transkrip (Paket Lengkap)">Ijazah + Transkrip (Paket Lengkap)</option>
                    <option value="Sertifikat Akreditasi">Sertifikat Akreditasi Program Studi</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Jumlah Rangkap Lembar</label>
                  <select
                    value={legalisirCopies}
                    onChange={(e) => setLegalisirCopies(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  >
                    <option value="5">5 Lembar</option>
                    <option value="10">10 Lembar</option>
                    <option value="15">15 Lembar</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Metode Pengambilan</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  >
                    <option value="ambil_langsung">Ambil Langsung di Kampus UNM Margonda/Jatiwaringin</option>
                    <option value="kurir">Kirim via JNE / SiCepat ke Alamat Rumah</option>
                    <option value="digital">Legalisir Digital (TTE Kominfo / QR Code)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Ajukan Legalisir Sekarang
                </button>
              </form>
            )}
          </div>

          {/* Status Tracking */}
          <div className="bg-white dark:bg-[#0f172a] rounded-md border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Riwayat Permohonan Terakhir
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">LEG-UNM-2026-0814</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Selesai & Diambil
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">Ijazah & Transkrip (5 Lembar)</p>
                <p className="text-[11px] text-slate-400">Tanggal Pengajuan: 12 Februari 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Buku Wisuda View
  if (activeTab === 'buku-wisuda') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-500" />
              Buku Wisuda & Dokumentasi Kelulusan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arsip e-Book Buku Wisuda Universitas Nusa Mandiri
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Buku Wisuda UNM Periode XXXIV (Tahun 2026)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daftar seluruh wisudawan Fakultas Teknologi Informasi dan Fakultas Ekonomi & Bisnis.
            </p>
            <button
              onClick={() => alert('Mengunduh e-Book Wisuda Periode XXXIV...')}
              className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Unduh e-Book (PDF - 45 MB)
            </button>
          </div>

          <div className="p-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Buku Wisuda UNM Periode XXXIII (Tahun 2025)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dokumentasi sidang senat terbuka wisuda periode sebelumnya.
            </p>
            <button
              onClick={() => alert('Mengunduh e-Book Wisuda Periode XXXIII...')}
              className="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Unduh e-Book (PDF - 38 MB)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SK Akreditasi View
  if (activeTab === 'sk-akreditasi') {
    const skList = [
      {
        title: 'SK Akreditasi Institusi Universitas Nusa Mandiri',
        skNo: 'SK BAN-PT No. 412/SK/BAN-PT/Ak-PPJ/PT/VI/2024',
        rating: 'Akreditasi B (Baik Sekali)',
      },
      {
        title: 'SK Akreditasi Program Studi S1 Informatika',
        skNo: 'SK LAM-INFOKOM No. 082/SK/LAM-INFOKOM/Ak/S/VIII/2024',
        rating: 'Akreditasi Unggul',
      },
      {
        title: 'SK Akreditasi Program Studi S1 Sistem Informasi',
        skNo: 'SK LAM-INFOKOM No. 095/SK/LAM-INFOKOM/Ak/S/IX/2024',
        rating: 'Akreditasi Unggul',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Surat Keputusan (SK) Akreditasi Institusi & Prodi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dokumen resmi legalitas BAN-PT & LAM-INFOKOM untuk keperluan lamaran kerja / CPNS / BUMN
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {skList.map((sk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{sk.title}</h3>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  {sk.skNo}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {sk.rating}
                </span>
              </div>

              <button
                onClick={() => alert(`Mengunduh berkas ${sk.title}...`)}
                className="px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition self-start sm:self-center shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Unduh SK
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // SK Penyatuan View
  if (activeTab === 'sk-penyatuan') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Files className="w-5 h-5 text-orange-500" />
              Surat Keputusan (SK) Penyatuan & Perubahan Bentuk
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dokumen perubahan bentuk STMIK Nusa Mandiri menjadi Universitas Nusa Mandiri
            </p>
          </div>
        </div>

        <div className="p-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            SK Mendikbudristek No. 82/E/O/2021
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Keputusan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi tentang Izin Penggabungan
            Sekolah Tinggi Manajemen Informatika dan Komputer Nusa Mandiri di Jakarta dan Akademi
            Komunikasi Bina Sarana Informatika di Jakarta Menjadi Universitas Nusa Mandiri di Jakarta.
          </p>
          <div className="pt-2">
            <button
              onClick={() => alert('Mengunduh SK Penyatuan Kemendikbudristek...')}
              className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Salinan SK Penyatuan Resmi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
