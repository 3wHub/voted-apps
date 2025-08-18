import { Link } from 'react-router-dom';
import Container from '@/lib/pages/components/Container';
import { useAuth } from '@/lib/helpers/useAuth';

export default function Plan() {
  const { isLoggedIn, loading, handleLogin } = useAuth();

  const plans = [
    {
      name: "Free",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Up to 5 active votes per month",
        "Maximum 100 voters per vote",
        "Maximum 5 options per poll",
        "Maximum 3 tags per poll",
      ],
      cta: isLoggedIn ? "Current Plan" : "Get Started",
      highlight: false,
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "/month",
      description: "For power users and organizations",
      features: [
        "Unlimited polls",
        "Unlimited voters",
        "Up to 100 options per poll",
        "Up to 50 tags per poll",
        "Hide/show vote percentage",
        "Private vote with shareable private link",
        "Sensitive content polls",
        "Voting templates",
        "Integration with ICP coin",
        "Premium badge",
      ],
      cta: "Upgrade Now",
      highlight: true,
    },
  ];


  return (
    <Container>
      <header className="text-center mb-12">
        <h1 className="text-sm sm:text-base font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Revolutionizing democratic participation through blockchain-powered voting
        </p>
      </header>

      {/* Pricing Cards Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-xl shadow-md border ${plan.highlight ? 'border-orange-500 ring-2 ring-orange-200 transform md:-translate-y-2' : 'border-gray-100'}`}
            >
              {plan.highlight && (
                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  POPULAR
                </div>
              )}
              <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-2">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-md sm:text-md font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="flex-shrink-0 w-5 h-5 text-orange-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-center">
                {isLoggedIn ? (
                  <button
                    className={`
                      w-full py-2.5 px-4 rounded-md text-sm font-medium
                      flex items-baseline justify-center
                      ${plan.highlight
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }
                      transition-colors duration-200
                    `}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`
                        w-full py-2.5 px-4 rounded-md text-sm font-medium
                        flex items-baseline justify-center
                        ${plan.highlight
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }
                        ${loading ? 'opacity-80 cursor-not-allowed' : ''}
                        transition-colors duration-200
                      `}
                  >
                    {loading ? (
                      <span className="inline-flex items-baseline gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </Container>
  );
}