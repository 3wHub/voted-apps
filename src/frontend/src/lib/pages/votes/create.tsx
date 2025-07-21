import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '@/lib/pages/components/FormInput';
import DateTimePicker from '@/lib/pages/components/DateTimePicker';
import Container from '@/lib/pages/components/Container';
import { createPoll } from '@/lib/api/api';

export default function CreateVote() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    });
    const [startTime, setStartTime] = useState('00:00');
    const [endTime, setEndTime] = useState('23:59');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateOption = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        setOptions(options.filter((_, i) => i !== index));
    };

    const addTag = () => {
        const trimmed = newTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setNewTag('');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const pollOptions = options
                .filter(opt => opt.trim())
                .map((opt, index) => ({
                    id: `opt_${index}_${Date.now()}`,
                    label: opt.trim(),
                    votes: 0
                }));

            if (pollOptions.length < 2) {
                throw new Error("At least two options are required");
            }

            const result = await createPoll(
                title.trim(),
                pollOptions,
                tags.filter(t => t.trim()),
                'u6s2n-gx777-77774-qaaba-cai',
            );

            if (!result || !result.id) {
                throw new Error("Poll creation failed");
            }

            navigate(`/votes/history`);
        } catch (err) {
            console.error('Error creating poll:', err);
            setError('Failed to create poll. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <h1 className="text-2xl font-bold mb-6">Create New Voting</h1>
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <FormInput
                    label="Voting Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="mt-1 text-sm block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-1 border"
                    />
                </div>

                {/* Voting Options */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Voting Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 text-sm py-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-1 border"
                                required
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setOptions([...options, ''])}
                        className="mt-2 text-sm text-orange-600 hover:text-orange-800"
                    >
                        + Add Option
                    </button>
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => setTags(tags.filter(t => t !== tag))}
                                    className="ml-1.5 inline-flex text-orange-400 hover:text-orange-600"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            id="tags"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="flex-1 text-sm py-2 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-1 border"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DateTimePicker
                        label="Start Date"
                        date={startDate}
                        onDateChange={(date) => {
                            if (date) setStartDate(date);
                        }}
                        time={startTime}
                        onTimeChange={(e) => setStartTime(e.target.value)}
                    />
                    <DateTimePicker
                        label="End Date"
                        date={endDate}
                        onDateChange={(date) => {
                            if (date) setEndDate(date);
                        }}
                        time={endTime}
                        onTimeChange={(e) => setEndTime(e.target.value)}
                        minDate={startDate}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                    <Link to="/" className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${isSubmitting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Voting'}
                    </button>
                </div>
            </form>
        </Container>
    );
}