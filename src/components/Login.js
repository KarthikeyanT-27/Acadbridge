import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import('./Login.css');




function Login() {
    const [credential,setCredential]= useState({
      email:"",
      password:"",
    });
    const [userType,setUserType]= useState("");
    const navigate = useNavigate();
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [secretKey, setSecretKey] = useState("");

    const handleChange=(e)=>{
      setCredential({...credential,[e.target.name]:e.target.value});
    };

    const handleLogin = async (e) => {
      e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/login/${userType}`,{ email:credential.email, password:credential.password, },
              {
                headers:{
                  'Content-Type':'application/json',
                },
              }
            );
           const {token}=response.data;
           localStorage.setItem('token',token);

           //navigate portal
           if(userType==="student") navigate("/student");
           else if (userType==="anchor") navigate("/staff");
           else if (userType==="admin") navigate("/admin");
        } catch (error) {
            alert("enter valid login  mode");
        }
    };
    const handleForgotPassword = async (e) => {
       e.preventDefault(); 
       try { 
        /* const response = await axios.post('http://localhost:5000/api/auth/verify-secret-key', { email: credential.email, secretKey, }); 
        const { token } = response.data;  */
        await axios.post('http://localhost:5000/api/auth/reset-password', { secretKey, password: newPassword, }); 
        alert('Password has been reset');
         setShowForgotPassword(false); 
  } catch (error) { 
    alert(error.response.data); }
  };

    return (
        <div className="fullportal">
            <h3>Choose login mode</h3>
            <div className="portal">
              <button onClick={()=> setUserType("student")}>STUDENT LOGIN</button>
              <button onClick={()=> setUserType("anchor")}> STAFF LOGIN</button>
              <button onClick={()=> setUserType("admin")}> ADMIN LOGIN</button>
            </div>
            <div className="login">
            <form onSubmit={handleLogin}>
              <h2>{userType.charAt(0).toUpperCase()+userType.slice(1)} login mode </h2>
            <label >Enter your E-mail</label>
            <input type="email" name="email"  value={credential.email} onChange={handleChange} />
            <label >Enter your password</label>
            <input type="password" name="password"  value={credential.password} onChange={handleChange} />
            <button  className="loginbutton">Login</button>
            <button className="registerbutton" onClick={() => navigate("/register")}>Register</button>
            <button className="reset" onClick={()=>setShowForgotPassword(true)}>forgotPassword?</button>
            </form>
            </div> 
                {showForgotPassword && (
                  <div className="forgot-password"> 
                      <form onSubmit={handleForgotPassword}> 
                        <h2>Forgot Password</h2>
                        <label >Enter your E-mail</label>
                        <input type="email" name="email"  value={credential.email} onChange={handleChange} />
           
                        <label>Enter Secret Key</label>
                          <input type="text" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} /> 
                          <label>Enter New Password</label> <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                          <button type="submit">Reset Password</button> 
                        </form>
                    </div>
                )}
            </div>
        
    );
}

export default Login;
