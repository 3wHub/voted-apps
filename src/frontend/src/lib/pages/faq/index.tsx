import { useState } from 'react';
import Container from '@/lib/pages/components/Container';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Apa itu voteD?",
      answer:
        "voteD adalah aplikasi pemungutan suara berbasis blockchain yang sepenuhnya on-chain. Tujuannya adalah menciptakan sistem voting yang transparan, aman, dan tidak dapat dimanipulasi."
    },
    {
      question: "Bagaimana cara kerja voteD?",
      answer:
        "Setiap suara yang diberikan akan tercatat langsung di blockchain. Dengan begitu, hasil voting dapat diverifikasi publik secara terbuka dan tidak bisa diubah."
    },
    {
      question: "Apakah voteD gratis?",
      answer:
        "voteD menyediakan paket gratis dengan batasan tertentu (misalnya 5 vote per bulan dan maksimal 100 voters). Untuk fitur premium seperti private vote, unlimited pool, atau integrasi coin, pengguna bisa upgrade ke paket premium."
    },
    {
      question: "Apa perbedaan akun free dan premium?",
      answer:
        "Akun free memiliki keterbatasan jumlah vote dan voters. Akun premium memiliki fitur tambahan seperti private voting, unlimited pool & voters, template voting, hingga integrasi ke ICP coin."
    },
    {
      question: "Bagaimana menjaga keamanan data saya?",
      answer:
        "Semua data suara dicatat di blockchain sehingga tidak bisa diubah atau dihapus. Identitas pemilih juga dilindungi dengan sistem enkripsi."
    },
    {
      question: "Apakah saya bisa membuat vote privat?",
      answer:
        "Ya, dengan akun premium kamu bisa membuat vote privat dan membagikan link hanya kepada peserta yang kamu pilih."
    },
    {
      question: "Apakah voteD bisa digunakan untuk petisi publik?",
      answer:
        "Tentu! voteD juga bisa dipakai untuk voting publik, polling komunitas, maupun petisi digital yang transparan dan dapat diverifikasi."
    }
  ];

  return (
    <Container>
      <header className="text-center mb-12">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base">
          Temukan jawaban atas pertanyaan umum seputar penggunaan dan fitur voteD
        </p>
      </header>

      <section className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 font-medium text-base focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
              <span className="ml-2">
                {openIndex === index ? (
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 text-base">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </section>
    </Container>
  );

}
