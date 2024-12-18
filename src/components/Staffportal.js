import React, { useEffect, useState } from 'react';
import axios from 'axios';
import('./Staffportal.css');

function StaffPortal() {
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState("");
  const [file, setFile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/staff/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff details:', error);
      }
    };
    fetchStaffDetails();
  }, [token]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/staff/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, [token]);



  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:5000/api/marks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error.response?.data || error.message);
      alert('Error uploading file');
    }
  };

  return (
    <div>
      <div>
        <h1>WELCOME {staff.name}!</h1>
        <img src={`http://localhost:5000${staff.imageUrl}`} alt="Profile" width="150" height="150" />
        <p>Name: {staff.name}</p>
        <p>Mail: {staff.email}</p>
        <p>Batch: {staff.batch}</p>
        <p>Domain: {staff.domain}</p>
      </div>

      <h2>Students in Your Department</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 && students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.department}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Attendance Records</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 && students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>
                {student.attendance.length > 0
                  ? student.attendance.map(record => (
                      <span key={record._id}>
                        {new Date(record.date).toLocaleDateString()}: {record.status}<br />
                      </span>
                    ))
                  : "No attendance records"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Marks</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 && students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>
                {student.marks.length > 0
                  ? student.marks.map(mark => (
                      <span key={mark._id}>
                        {mark.subject}: {mark.marks} ({mark.isPass ? 'Pass' : 'Fail'})<br />
                      </span>
                    ))
                  : "No marks records"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h2>Upload Marks</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default StaffPortal;

