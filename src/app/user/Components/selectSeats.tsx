import React, { useState } from 'react';
import styles from './styles/select-seats.module.css';
import { useRouter } from 'next/navigation';

function SelectSeats() {
    const [seats, setSeats] = useState(0);
    const [vehicle, setVehicle] = useState('/assets/bike.png');
    const router = useRouter();

    const handleSeatSelect = (seat:number) => {
        setSeats(seat);
        if (seat <= 2) {
            setVehicle('/assets/bike.png');
        } else if (seat <= 4) {
            setVehicle('/assets/auto.png');
        } else if (seat <= 6) {
            setVehicle('/assets/car.png');
        } else if (seat <= 8) {
            setVehicle('/assets/suv.png');
        } else {
            setVehicle('/assets/bus.png');
        }
    };

    function handleClick() {
        sessionStorage.setItem('seatcount', seats.toString());
        router.push('/user/theatrelayout');
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <h3>Select Number of Seats</h3>
                <img src={vehicle} alt="vehicle" className={styles.vehicleImage} />
                <div className={styles.buttonGroup}>
                    {Array.from({ length: 10 }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handleSeatSelect(index + 1)}
                            className={`${styles.button} ${seats === index + 1 ? styles.selected : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button onClick={handleClick} className={styles.bookButton}>Book Now</button>
            </div>
        </div>
    );
}

export default SelectSeats;