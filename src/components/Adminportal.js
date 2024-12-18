import React, { useEffect, useState } from 'react';
import axios from 'axios';


function AdminPortal() {
  const [studentsByDepartment, setStudentsByDepartment] = useState({});
 const token=localStorage.getItem('token');
  const [testName, setTestName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
 import('./Adminportal.css');

  const addQuestion = () => {
    setQuestions([...questions, { questionText, choices, correctAnswer }]);
    setQuestionText('');
    setChoices(['', '', '', '']);
    setCorrectAnswer('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tests/create', { testName, questions }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Test created successfully');
      setTestName('');
      setQuestions([]);
    } catch (error) {
      alert('Error creating test: ' + error.message);
    }
  };

  
   
      
 

  
  const openAttendance = async () => {
    try {
      await axios.post('http://localhost:5000/api/attendance/open', {}, {
        headers: { Authorization: `Bearer ${token}` }, 
      }); 
      alert('Attendance opened for today');
    } catch (error) { 
      console.error('Error opening attendance:', error.response?.data || error.message); 
    }
  };

  useEffect(() => {
    const fetchStudentsByDepartment = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setStudentsByDepartment(response.data);
      } catch (error) {
        console.error('Error fetching students:', error.response || error.message);
      }
    };
    fetchStudentsByDepartment();
  }, [token]);

  return (
    <div className='admin'>
      <h1>Admin Portal</h1>
      <button onClick={openAttendance}>Open Attendance</button>
      <h2>Student Details by Department</h2>
      {Object.keys(studentsByDepartment).map(department => (
        <div key={department}>
          <h3>{department}</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Register Number</th>
                <th>Date of Birth</th>
                <th>College</th>
                <th>Batch</th>
                <th>Subjects and Marks</th>
              </tr>
            </thead>
            <tbody>
              {studentsByDepartment[department].map(student => (
                <tr key={student._id}>
                  <td>{student.username || student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.registernumber}</td>
                  <td>{student.dob}</td>
                  <td>{student.college}</td>
                  <td>{student.batch}</td>
                  <td>
                    <ul> 
                      {student.marks.map(mark => (
                        <li key={mark._id}>{mark.subject}: {mark.marks}</li> 
                      ))} 
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <h2>Create Test</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} placeholder="Test Name" required />
        <div>
          <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Question" required />
          {choices.map((choice, index) => (
            <input key={index} type="text" value={choice} onChange={(e) => {
              const newChoices = [...choices];
              newChoices[index] = e.target.value;
              setChoices(newChoices);
            }} placeholder={`Choice ${index + 1}`} required />
          ))}
          <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} placeholder="Correct Answer" required />
          <button type="button" onClick={addQuestion}>Add Question</button>
        </div>
        <button type="submit">Create Test</button>
      </form>
      <div>
        <h3>Questions</h3>
        <ul>
          {questions.map((q, index) => (
            <li key={index}>
              {q.questionText} - Correct Answer: {q.correctAnswer}
              <ul>
                {q.choices.map((choice, i) => (
                  <li key={i}>{choice}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    
    </div>
  );
}

export default AdminPortal;
