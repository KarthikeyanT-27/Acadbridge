import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Studentportal.css';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, Chart } from 'chart.js/auto';


 Chart.register(CategoryScale);

function StudentPortal() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [attendanceOpenedAt, setAttendanceOpenedAt] = useState([]);
  const [marks, setMarks] = useState([]);
  const token = localStorage.getItem('token');
    const[timerInterval,setTimerInterval]=useState(null);
    const [tests, setTests] = useState([]);
    const [currentTest, setCurrentTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const[ttimeLeft,setTtimeLeft]=useState(0);
    const [result, setResult] = useState(null);
  
    useEffect(() => {
  
      const fetchTests = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/tests/student', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTests(response.data);
          
        } catch (error) {
          console.error('Error fetching tests:', error);
        }
      };
  
      fetchTests();
    }, [token]);
  
    const startTest = (test) => {
      console.log("starting test",test);
      setCurrentTest(test);
      setTtimeLeft(60* 60);
      const interval = setInterval(() => {
        setTtimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            submitTest();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    };
  
    useEffect(()=>{
      return()=>{
        if(timerInterval){
          clearInterval(timerInterval);
        }
      };
    },[timerInterval]);


    const handleAnswerChange = (questionId, answer) => {
      setAnswers({ ...answers, [questionId]: answer });
    };
  
    const submitTest = async () => {
if(timerInterval){
  clearInterval(timerInterval);
}

      try {
        let score = 0;
        currentTest.questions.forEach((question) => {
          if (answers[question._id] === question.correctAnswer) {
            score += 1;
          }
        });
        setResult({ testName: currentTest.name, score, total: currentTest.questions.length });
  
        // Save result to marks database
        await axios.post('http://localhost:5000/api/marks/save', {
          testName: currentTest.testName,
          score,
          total: currentTest.questions.length,
          studentId: student._id,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("test submitted");
     } catch (error) {
        console.error('Error submitting test:', error.response?.data || error.message);
      }
    };
  





  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        console.log(token);
        const response = await axios.get('http://localhost:5000/api/student/profileinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(response.data);

        const attendanceResponse = await axios.get('http://localhost:5000/api/attendance/student', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendance(attendanceResponse.data);

        const openTimeResponse = await axios.get('http://localhost:5000/api/attendance/open-time', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceOpenedAt(new Date(openTimeResponse.data.openedAt));

      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetails();
  }, [token]);

  useEffect(() => { 
    if (attendanceOpenedAt) { 
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = (now - new Date(attendanceOpenedAt)) / 1000; 
        setTimeLeft(Math.max(180 - elapsed, 0)); 
        if (elapsed >= 180) { clearInterval(interval); }
      }, 1000); 
      return () => clearInterval(interval);
    } 
  }, [attendanceOpenedAt]);

  useEffect(() => { 
    if (student) { 
      const fetchMarks = async () => { 
        try { 
          const marksResponse = await axios.get(`http://localhost:5000/api/marks/student/${student.name}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMarks(marksResponse.data);
        } catch (error) { 
          console.error('Error fetching marks:', error.response?.data || error.message);
        }
      }; 
      fetchMarks();
    } 
  }, [student, token]);

  const markAttendance = async () => { 
    try { 
      await axios.post('http://localhost:5000/api/attendance/mark', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Attendance marked successfully'); 
    } catch (error) {
      console.error('Error marking attendance:', error.response?.data || error.message);
    }
  };

  const data = { 
    labels: marks.map(mark => mark.subject),
    datasets: [ 
      { label: 'Marks', 
        data: marks.map(mark => mark.marks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)', 
      }
    ]
  };



  return (
    <div>
      {student ? (
        <div>
          <h1>WELCOME {student.name}!</h1>
          <img src={`http://localhost:5000${student.imageUrl}`} alt="Profile" width="150" height="150" />
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Domain:</strong>{student.domain}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Register Number:</strong> {student.registernumber}</p>
          <p><strong>Date of Birth:</strong> {student.dob}</p>
          <p><strong>College:</strong> {student.college}</p>
          <p><strong>Batch:</strong> {student.batch}</p>
          <button onClick={markAttendance} disabled={timeLeft === 0}>
            {timeLeft > 0
              ? `Mark Me Present (${Math.floor(timeLeft / 60)}:${Math.floor(timeLeft % 60).toString().padStart(2, '0')})`
              : 'Attendance Time Expired'}
          </button>
          <h2>Attendance Detail</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(record => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Your Marks</h2>
          <Bar data={data}/>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {marks.map(mark => (
                <tr key={mark._id}>
                  <td>{mark.subject}</td>
                  <td>{mark.marks}</td>
                  <td>{mark.isPass ? 'Pass' : 'Fail'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            
  
            <h2>Available Tests</h2>
            <ul>
              {tests.map((test) => (
                <li key={test._id}>
                  <button onClick={() => startTest(test)}>{test.testName}</button>
                </li>
              ))}
            </ul>
  
            {currentTest && (
              <div>
                <h2>{tests.testName}</h2>
                <p>Time left: {Math.floor(ttimeLeft / 60)}:{(ttimeLeft % 60).toString().padStart(2, '0')}</p>
                {currentTest.questions.map((question) => (
                  <div key={question._id}>
                    <p>{question.questionText}</p>
                    {question.choices.map((choice, index) => (
                      <div key={index}>
                        <input
                          type="radio"
                          id={`question-${question._id}-choice-${index}`}
                          name={`question-${question._id}`}
                          value={choice}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        />
                        <label htmlFor={`question-${question._id}-choice-${index}`}>{choice}</label>
                      </div>
                    ))}
                  </div>
                ))}
                <button onClick={submitTest}>Submit Test</button>
              </div>
            )}
  
            {result && (
              <div>
                <h2>Test Result</h2>
                <p>{result.testName}</p>
                <p>Score: {result.score} / {result.total}</p>
              </div>
            )}
          </div>
        
        
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default StudentPortal;
