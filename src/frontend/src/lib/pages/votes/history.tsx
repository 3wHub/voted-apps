import Container from '@/lib/pages/components/Container';
import VotingHistory from '@/lib/layout/components/VotingHistory';

export default function History() {
    return (
        <Container>
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold mb-2">Voting History</h1>
                <p className="text-gray-600 text-lg">View all polls created by users</p>
            </div>

            <VotingHistory />
        </Container>
    );
}
