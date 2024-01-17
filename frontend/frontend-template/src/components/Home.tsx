import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Home.css';
import backHH from '../assets/backHomee.jpg';
import {
  createDailyRecords,
  dateAndShift,
  fetchActivitiesInMount,
  updateRecordsForComment,
  updateRecordsForConfirmation,
  updateRecordsForStatus,
} from '../features/activity/activityAPIs';

export interface RowData {
  activityId: string;
  comment: string | null;
  completedTime: string;
  confirmTime: string;
  confirmUser: string;
  confirmation: boolean;
  date: string;
  description: string;
  name: string;
  recordId: string;
  shift: string;
  status: string;
  time: string;
  user: string;
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | string>(new Date());
  const [selectedOption, setSelectedOption] = useState<string>('Morning'); // Default value
  const [data, setData] = useState<RowData[]>([]);

  useEffect(() => {
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };
    createDailyRecords(details).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });
  }, [selectedOption, selectedDate]);

  const dropdownOptions = ['Pending', 'Not Applicable', 'Completed'];

  const handleSelectChange = (index: number, value: string) => {
    const updatedData = [...data];
    if (value === 'Completed') {
      updatedData[index].user = localStorage.getItem('user');
    }
    updatedData[index].status = value;
    setData(updatedData);
    handleSaveStatus(index);
  };

  const handleShift = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleConfirmationChange = (index: number) => {
    const updatedData = [...data];

    const shouldConfirm = window.confirm('Are you sure you want to confirm?');

    if (shouldConfirm) {
      updatedData[index].confirmation = !updatedData[index].confirmation;
      if (updatedData[index].confirmation) {
        updatedData[index].confirmUser = localStorage.getItem('user');
      }
    }

    setData(updatedData);
    handleSaveConfirmation(index);
  };

  const handleCommentsChange = (index: number, value: string) => {
    const updatedData = [...data];
    updatedData[index].comment = value;
    setData(updatedData);
  };

  const handleSaveComment = (index: number) => {
    const updatedData = [...data];
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };
    updateRecordsForComment(updatedData[index]).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });
  };

  const handleSaveStatus = (index: number) => {
    const updatedData = [...data];
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };
    updateRecordsForStatus(updatedData[index]).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });
  };

  const handleSaveConfirmation = (index: number) => {
    const updatedData = [...data];
    const details: dateAndShift = {
      date: selectedDate,
      shift: selectedOption,
    };
    updateRecordsForConfirmation(updatedData[index]).then((r) => {
      console.log(r);
      fetchActivitiesInMount(details).then((r) => setData(r));
    });
  };

  const handleDatePickerChange = (date: Date | null) => {
    if (date) {
      const formattedDate = new Date(date);
      setSelectedDate(formattedDate);
    } else {
      setSelectedDate('');
    }
  };

  return (
    <div className="container-Home" style={{ backgroundImage: `url(${backHH})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

      <div className="table-container">
        <div className="topcontrols">
          <div className="Date">
            <div>
              <DatePicker
                className='dateee'
                selected={selectedDate}
                onChange={handleDatePickerChange}
                dateFormat="yyyy-MM-dd"
              />

            </div>
          </div>


          <div className="NewDropdown">
            <select className='select2' onChange={(e) => handleShift(e)}>
              <option value="Morning">Morning</option>
              <option value="Mid">Mid</option>
              <option value="Night">Night</option>
            </select>
          </div>
        </div>


        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th>Date</th>
              <th>User</th>
              <th>Confirm Date</th>
              <th>Confirm User</th>
              <th>Action</th>
              <th>Confirmation</th>
              <th>Comment</th>
              <th>Save Comment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.completedTime}</td>
                <td>{row.user}</td>
                <td>{row.confirmTime}</td>
                <td>{row.confirmUser}</td>
                <td>
                  <select className='select' value={row.status === 'Completed' ? 'Completed' : row.status === 'Not Applicable' ? 'Not Applicable' : 'Pending'} onChange={(e) => handleSelectChange(index, e.target.value)}>
                    {dropdownOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                <button
    className={`buttonT ${row.confirmation ? 'confirmed' : ''}`}
    onClick={() => handleConfirmationChange(index)}
  >
    {row.confirmation ? 'Confirmed' : 'Not Confirmed'}
  </button>
                </td>
                <td>
                  <input
                    className='inputHH'
                    type="text"
                    value={row.comment === null ? '' : row.comment}
                    onChange={(e) => handleCommentsChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSaveComment(index)}>
                    SAVE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
