import { useState } from 'react';
import LoadingSpinner from '../components/my-components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router';
import PurchaseModal from './Modal/PurchaseModal';

const Pricing = () => {
  let [isOpen, setIsOpen] = useState(false);

  const { id } = useParams();

  const {
    data: pricing = {},
    isLoading,
    // refetch,
  } = useQuery({
    queryKey: ['pricing', id],
    queryFn: async () => {
      const result = await axios(
        `${import.meta.env.VITE_API_URL}/pricing/${id}`
      );
      return result.data;
    },
  });
  console.log(pricing);

  const { _id, name, image, price, category, description, quantity, seller } =
    pricing;

  const closeModal = () => {
    setIsOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;

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
            $<span>500</span> (One-time)
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer  mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg"
          >
            Upgrade to Premium ⭐
          </button>

          <PurchaseModal
            pricing={pricing}
            closeModal={closeModal}
            isOpen={isOpen}
          />
        </div>
      </div>
    </div>
  );
};
export default Pricing;
