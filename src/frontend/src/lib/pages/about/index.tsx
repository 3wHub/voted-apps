import { Link } from 'react-router-dom';
import Container from '@/lib/pages/components/Container';

export default function About() {
  return (
    <Container>
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Voted</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Revolutionizing democratic participation through blockchain-powered voting
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-600 mb-6">
            To eliminate voting fraud and build trust in democratic processes through decentralized blockchain technology.
          </p>
          <ul className="space-y-3">
            {[
              'Create tamper-proof blockchain voting systems',
              'Enhance participation through universal accessibility',
              'Guarantee vote integrity and authenticity',
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <svg className="flex-shrink-0 w-5 h-5 text-orange-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The Solution */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">The Solution</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Addressing the trust crisis and limited access in conventional voting systems with:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Security', desc: 'Immutable blockchain records' },
              { title: 'Transparency', desc: 'Publicly verifiable results' },
              { title: 'Accessibility', desc: 'Global participation' },
              { title: 'Integrity', desc: 'Cryptographically secured' },
            ].map((feature, index) => (
              <div key={index} className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-700 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Voting Revolution</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Be part of the movement transforming democratic participation through decentralized technology.
        </p>
        <Link
          to="/votes-create"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          Create Your First Vote
          <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </section>
    </Container>
  );
}
