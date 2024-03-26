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
import DialogBox from "./DialogBox";
import AlertBox from "./AlertBox";

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
  const [selectedDate, setSelectedDate] = useState<Date | any>(new Date());
  const [selectedOption, setSelectedOption] = useState<string>('Morning-Weekday-Normal'); // Default value
  const [data, setData] = useState<RowData[]>([]);
  const [dialogFunction, setDialogFunction] = useState<string>('');
  const [dialogValue, setDialogValue] = useState<string>('');
  const [dialogIndex, setDialogIndex] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [messageForDialogBox, setMessageForDialogBox] = useState<string>("");
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [messageForAlertBox, setMessageForAlertBox] = useState<string>("");
  const [activityNameForDialogAndAlertBox, setActivityNameForDialogAndAlertBox] = useState<string>("");

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
    const activity = updatedData[index];
    if (value === 'Completed' || value === 'Not Applicable') {
      setOpenDialog(true);
      setActivityNameForDialogAndAlertBox(activity.name);
      setMessageForDialogBox(`Are you sure you want to set the action as ${value} for `);
      setDialogFunction('HandleState');
      setDialogValue(value);
      setDialogIndex(index);
    }
  };

  const handleShift = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleConfirmationChange = (index: number) => {
    const updatedData = [...data];
    const activity = updatedData[index];

    if (activity.status !== 'Completed' && activity.status !== 'Not Applicable') {
      setOpenAlert(true);
      setMessageForAlertBox('Please complete your activity first.')
      return;
    }

    if (activity.user === localStorage.getItem('user')) {
      setOpenAlert(true);
      setMessageForAlertBox(`You have updated the Action as ${activity.status}. Therefore, you cannot Confirm Activity: `);
      setActivityNameForDialogAndAlertBox(activity.name);
      return;
    }

    setOpenDialog(true);
    setMessageForDialogBox('Are you sure you want to confirm?');
    setDialogFunction('HandleConfirmation');
    setDialogValue('');
    setDialogIndex(index);
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

  const handleDialogConfirm = () => {
    if(dialogFunction === 'HandleState') {
      const updatedData = [...data];
      updatedData[dialogIndex].user = localStorage.getItem('user');
      updatedData[dialogIndex].status = dialogValue;
      setData(updatedData);
      handleSaveStatus(dialogIndex);
    }
    else{
      const updatedData = [...data];
      const activity = updatedData[dialogIndex];
      activity.confirmation = !activity.confirmation;
      if (activity.confirmation) {
        activity.confirmUser = localStorage.getItem('user');
      }
      setOpenDialog(false);
      setData(updatedData);
      handleSaveConfirmation(dialogIndex);
    }
    setOpenDialog(false);
    setMessageForDialogBox('');
    setDialogFunction('');
    setDialogValue('');
    setDialogIndex(0);
    setActivityNameForDialogAndAlertBox("");
  }

  const handleDialogCancel = () => {
    setOpenDialog(false);
    setMessageForDialogBox('');
    setDialogFunction('');
    setDialogValue('');
    setDialogIndex(0);
  }

  const backToHome = () => {
    setOpenAlert(false);
    setActivityNameForDialogAndAlertBox("");
  }

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
            <select className='select3' onChange={(e) => handleShift(e)}>
              <option value="Morning-Weekday-Normal">Morning-Weekday-Normal</option>
              <option value="Morning-Weekday-Holiday">Morning-Weekday-Holiday</option>
              <option value="Mid-Weekday-Normal">Mid-Weekday-Normal</option>
              <option value="Night-Weekday-Normal">Night-Weekday-Normal</option>
              <option value="Night-Weekday-Holiday">Night-Weekday-Holiday</option>
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th>Completed Date</th>
              <th>Completed User</th>
              <th>Confirmed Date</th>
              <th>Confirmed User</th>
              <th>Action</th>
              <th>Confirmation</th>
              <th>Comment</th>
              <th>Save Comment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="truncate-cell">{row.name}</td>
                <td>{row.completedTime}</td>
                <td>{row.user}</td>
                <td>{row.confirmTime}</td>
                <td>{row.confirmUser}</td>
                <td>
                  {row.status === 'Completed' ? <span className="green-text">{row.status}</span> : row.status ==='Not Applicable' ?
                      <span className="yellow-text">{row.status}</span> :
                      <select className='select' value={row.status} onChange={(e) => handleSelectChange(index, e.target.value)}>
                        {dropdownOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                        ))}
                      </select>}
                </td>
                <td>
                  {row.confirmation ? <span className="confirmed-text">CONFIRMED</span> :
                      <button
                          className={`buttonT ${row.confirmation ? 'confirmed' : ''}`}
                          onClick={() => handleConfirmationChange(index)}
                      >
                        {row.confirmation ? 'Confirmed' : 'Confirm'}
                      </button>
                  }
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
                  <button className="save-button" onClick={() => handleSaveComment(index)}>
                    SAVE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DialogBox
            isOpen={openDialog}
            message={messageForDialogBox}
            activityName={activityNameForDialogAndAlertBox}
            onConfirm={handleDialogConfirm}
            onCancel={handleDialogCancel}
        />
        <AlertBox
            isOpen={openAlert}
            activityName={activityNameForDialogAndAlertBox}
            message={messageForAlertBox}
            back={backToHome}
        />
      </div>
    </div>
  );
}
