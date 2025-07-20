interface PollOption {
    id: string;
    label: string;
    votes: number;
    selected?: boolean;
}

interface Poll {
    id: number;
    question: string;
    options: PollOption[];
}

export default function Vote() {
    const data: Poll[] = [
        {
            id: 1,
            question: "Siapa presiden Indonesia terbaik sepanjang sejarah peradaban manusia modern?",
            options: [
                { id: "soekarno", label: "Soekarno", votes: 45 },
                { id: "soeharto", label: "Soeharto", votes: 120 },
                { id: "habibie", label: "B.J. Habibie", votes: 30 },
                { id: "gusdur", label: "Abdurrahman Wahid", votes: 85 }
            ]
        },
        {
            id: 2,
            question: "Framework frontend mana yang paling Anda kuasai?",
            options: [
                { id: "vue", label: "Vue JS", votes: 3 },
                { id: "react", label: "React", votes: 100 },
                { id: "angular", label: "Angular", votes: 10 },
                { id: "laravel", label: "Laravel", votes: 20 }
            ]
        },
    ];

    const handleVoteSubmit = (pollId: number, selectedOptionId: string) => {
        console.log(`Voted for option ${selectedOptionId} in poll ${pollId}`);
        // Not Implemented
    };

    const handleOptionChange = (pollId: number, optionId: string) => {
        console.log(`Selected option ${optionId} in poll ${pollId}`);
        // Not Implemented
    };

    return (
        <div className="flex justify-center">
            <div className="grid-cols-1">
                {data.map((poll) => (
                    <div key={poll.id} className="block max-w-lg p-6 py-5 mb-5 border border-gray-400 rounded-lg shadow-sm hover:bg-gray-50">
                        <h5 className="mb-5 text-2xl font-light tracking-tight text-gray-900">
                            {poll.question}
                        </h5>

                        <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                            {poll.options.map((option) => (
                                <li key={option.id} className="w-full border-b border-gray-200 rounded-t-lg last:border-b-0">
                                    <div className="flex items-center ps-3">
                                        <input
                                            id={`${poll.id}-${option.id}`}
                                            type="radio" 
                                            name={`poll-${poll.id}`}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                            onChange={() => handleOptionChange(poll.id, option.id)}
                                        />
                                        <label
                                            htmlFor={`${poll.id}-${option.id}`}
                                            className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col mt-4">
                            <div className="flex flex-wrap gap-2">
                                {poll.options.map((option) => (
                                    <span
                                        key={`badge-${option.id}`}
                                        className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm border-gray-500"
                                    >
                                        {option.votes} {option.label}
                                    </span>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="mt-5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2"
                                onClick={() => {
                                    handleVoteSubmit(poll.id, poll.options[0].id);
                                }}
                            >
                                Submit Vote
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}