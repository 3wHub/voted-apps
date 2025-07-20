interface Poll {
    id: number;
    question: string;
    tags: string[];
    totalVotes: number;
}

export default function Home() {
    const data: Poll[] = [
        {
            id: 1,
            question: "Siapa presiden Indonesia terbaik sepanjang sejarah peradaban manusia modern?",
            tags: ["Politik", "Sejarah", "Kepemimpinan"],
            totalVotes: 245
        },
        {
            id: 2,
            question: "Aplikasi mobile banking apa yang paling aman menurut Anda?",
            tags: ["Teknologi", "Keuangan", "Keamanan"],
            totalVotes: 189
        },
        {
            id: 3,
            question: "Destinasi wisata mana yang paling ingin Anda kunjungi di Indonesia?",
            tags: ["Travel", "Budaya", "Alam"],
            totalVotes: 312
        },
        {
            id: 4,
            question: "Makanan tradisional Indonesia mana yang paling Anda sukai?",
            tags: ["Kuliner", "Budaya"],
            totalVotes: 421
        },
        {
            id: 5,
            question: "Platform e-commerce mana yang paling sering Anda gunakan?",
            tags: ["Teknologi", "Belanja"],
            totalVotes: 376
        }
    ];

    return (
        <div className="flex justify-center">
            <div className="grid-cols-1">
                {data.map((poll) => (
                    <div key={poll.id} className="block max-w-lg p-6 py-5 mb-5 border border-gray-400 rounded-lg shadow-sm hover:bg-gray-50">
                        <h5 className="mb-5 text-2xl font-light tracking-tight text-gray-900">
                            {poll.question}
                        </h5>

                        <div>
                            {poll.tags.map((category, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-full text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-dark-900 focus:z-10 focus:ring-4 focus:ring-gray-100"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-500">
                                {poll.totalVotes} votes
                            </span>
                            <button
                                type="button"
                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3"
                            >
                                Vote
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
;