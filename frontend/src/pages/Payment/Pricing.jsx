import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PurchaseModal from '../Modal/PurchaseModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Pricing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // -------- Fetch lessons using useQuery --------
  const { data: lessonData = [], isLoading } = useQuery({
    queryKey: ['premium-lessons'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/lessons');
      return data;
    },
  });

  const closeModal = () => {
    setIsOpen(false);
  };

  // -------- Stripe Checkout Handler --------
  // const handleCheckout = async () => {
  //   try {
  //     const res = await axiosSecure.post('/create-checkout-session', {
  //       price: 1500, // $1500 দাম
  //       userEmail: user?.email,
  //     });

  //     window.location.replace(res.data.url);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Upgrade to Premium
      </h1>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-6 border rounded-xl p-6 bg-white shadow">
        <div>
          <h2 className="text-2xl font-bold mb-4">Free Plan</h2>
          <ul className="space-y-2 text-gray-700">
            <li>❌ Access to premium lessons</li>
            <li>❌ Lifetime access</li>
            <li>❌ Priority listing</li>
            <li>❌ Ad-free experience</li>
            <li>✔ Basic lessons</li>
            <li>✔ Save lessons</li>
            <li>✔ Basic profile</li>
          </ul>
        </div>

        <div className="border-l pl-6">
          <h2 className="text-2xl font-bold mb-4">Premium Plan ⭐</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✔ All premium lessons unlocked</li>
            <li>✔ Lifetime access</li>
            <li>✔ Create premium lessons</li>
            <li>✔ Priority listing</li>
            <li>✔ Ad-free experience</li>
            <li>✔ VIP Support</li>
          </ul>

          <p className="text-3xl font-bold mt-6">
            $<span>1500</span> (One-time)
          </p>

          {/* Stripe checkout button */}
          <button
            onClick={() => {
              setIsOpen(true);
              // handleCheckout();
            }}
            className="cursor-pointer mt-4 px-6 py-3 bg-primary text-white rounded-lg font-semibold text-lg"
          >
            Upgrade to Premium ⭐
          </button>

          {/* Modal Rendering */}
          {lessonData.map((lesson) => (
            <PurchaseModal
              lesson={lesson}
              closeModal={closeModal}
              isOpen={isOpen}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
