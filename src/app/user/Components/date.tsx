import React, { useState } from 'react';

function DateComponent() {
    const [date, setDate] = useState<string | undefined>(undefined);

    const handleDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setDate(e.target.value);
    };

    const handleClick: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
      
        console.log("Selected Date:", date);
    };

    return (
        <div>
            <form onSubmit={handleClick}>
                <h2>Choose a Date</h2>
                <label htmlFor='movie-date'>Choose a date:</label>
                <input
                    type="date"
                    id='movie-date'
                    name='movie-date'
                    value={date || ''}
                    onChange={handleDateChange}
                />
                <button type='submit'>Check</button>
            </form>
        </div>
    );
}

export default DateComponent;
