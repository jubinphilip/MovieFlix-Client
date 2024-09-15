import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import './styles/success.css'

interface SuccessProps {
  id: string;
}

const Success: React.FC<SuccessProps> = ({ id }) => {
  const userProfile = useSelector((state: RootState) => state.user);
  const token = userProfile.token;
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const url = 'http://localhost:9000/user/getticket'; // Change to your actual endpoint
      const response = await axios.post(url, { id: id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(response.data.qrcode)
      setQrCodeUrl(response.data.qrcode.qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code.');
    }
  };

  return (
    <div className="success-overlay">
      <div className="success-modal">
        <h1>Booking Successful</h1>
        <p><strong>Booking ID:</strong> {id}</p>
        <button onClick={handleClick}>Generate QR Code</button>
        {qrCodeUrl && (
          <div>
            <h2>Your QR Code:</h2>
            <img src={qrCodeUrl} alt="QR Code" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
