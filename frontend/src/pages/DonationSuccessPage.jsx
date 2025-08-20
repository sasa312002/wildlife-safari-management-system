import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { donationApi } from '../services/api';

const DonationSuccessPage = () => {
	const [searchParams] = useSearchParams();
	const [verifying, setVerifying] = useState(true);
	const [error, setError] = useState('');
	const [result, setResult] = useState(null);

	const success = searchParams.get('success');
	const sessionId = searchParams.get('session_id');

	useEffect(() => {
		if (success === 'true' && sessionId) {
			verifyPayment();
		} else {
			setVerifying(false);
			setError('Invalid payment session');
		}
	}, [success, sessionId]);

	const verifyPayment = async () => {
		try {
			const response = await donationApi.verifyPayment(sessionId);
			if (response.success) {
				setResult(response);
				setError('');
			} else {
				setError('Payment not completed');
			}
		} catch (err) {
			console.error('Donation verification error:', err);
			setError('Failed to verify payment. Please contact support.');
		} finally {
			setVerifying(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 flex items-center justify-center px-6">
			<div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20 text-center">
				{verifying ? (
					<div className="text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto mb-4"></div>
						<div className="text-white font-abeze text-lg">Verifying your donation...</div>
					</div>
				) : error ? (
					<>
						<div className="text-red-400 font-abeze font-bold text-2xl mb-2">Donation Not Completed</div>
						<p className="text-gray-300 font-abeze mb-6">{error}</p>
						<Link to="/donate" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-abeze">Try Again</Link>
					</>
				) : (
					<>
						<div className="text-green-400 font-abeze font-bold text-2xl mb-2">Thank You for Your Donation! 🎉</div>
						<p className="text-gray-300 font-abeze mb-6">
							Your contribution has been received successfully.
						</p>
						{result && (
							<div className="text-sm text-green-200 font-abeze mb-6">
								Amount: {(result.amount_total / 100).toFixed(2)} {String(result.currency).toUpperCase()}
							</div>
						)}
						<Link to="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-abeze">Back to Home</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default DonationSuccessPage;


