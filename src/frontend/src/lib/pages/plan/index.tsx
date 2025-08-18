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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="flex-shrink-0 w-5 h-5 text-orange-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isLoggedIn ? (
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium ${plan.highlight ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {plan.cta}
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${plan.highlight ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {loading ? "Loading..." : plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

    </Container>
  );
}