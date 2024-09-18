import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { IoIosCloseCircle } from "react-icons/io";
import './styles/success.css'

interface SuccessProps {
  id: string;
  show:boolean
}
//This component is rendered on successfull completion of ticket booking
const Success: React.FC<SuccessProps> = ({ id,show }) => {
  const userProfile = useSelector((state: RootState) => state.user);
  const token = userProfile.token;
  const[status,setStatus]=useState(show)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const[text,setText]=useState('Send Details To Whatsapp')

  const handleClick = async () => {
    try {
      const url = 'http://localhost:9000/user/getticket'; // Change to your actual endpoint
      const response = await axios.post(url, { id: id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }

      });
      console.log(response.data.qrcode)
      if(response.status===200)
      {
        //setting the url of qrcode for displaying it
        setQrCodeUrl(response.data.qrcode.qrCodeUrl);
        setText("Success✔️")
      }
      else
      {
        setText(response.data.message)
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code.');
    }
  };
function handleClose()
{
  setStatus(false)
}
  return (
    <div className="success-overlay">
      {status && <div className="success-modal">
        <IoIosCloseCircle onClick={handleClose}/>
        <h1>Booking Successful</h1>
       {/*  <p><strong>Booking ID:</strong> {id}</p> */}
        {/* showing the qr code url on screen on a button click and on successfull qr code generation the text is changed */}
        <button onClick={handleClick}>{text}</button>
        {qrCodeUrl && (
          <div>
            <h2>Your QR Code:</h2>
            <img src={qrCodeUrl} alt="QR Code" /><br/>
            <button><a href="/user/userhome">Book Again</a></button>
          </div>
        )}
      </div>}
    </div>
  );
};

export default Success;
