import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import axios from 'axios';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (sessionId) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/payment-success`, {
          sessionId,
        })
        .then(() => console.log('Premium Activated'))
        .catch((err) => console.log(err));
    }
  }, [sessionId]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
      <p className="mt-4">Your premium access is now active!</p>
    </div>
  );
};

export default PaymentSuccess;
