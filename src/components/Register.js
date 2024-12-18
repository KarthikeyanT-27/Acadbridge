import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import('./Register.css');

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [dob, setDob] = useState("");
    const [registernumber, setRegisternumber] = useState("");
    const [college, setCollege] = useState("");
    const [batch, setBatch] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [image, setImage] = useState(null);
    const[domain,setDomain]=useState("");
    const navigate = useNavigate();

    const handleImagechange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleRegister = async () => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("name", name);
        formData.append("department", department);
        formData.append("registernumber", registernumber);
        formData.append("dob", dob);
        formData.append("college", college);
        formData.append("batch", batch);
        formData.append("doomain",domain)
        formData.append("secretKey", secretKey);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/");
        } catch (error) {
            alert(error.response.data || "Failed to register");
        }
    };

    return (
        <div className="fullportal">
            <h2>Register</h2>
            <label>Select Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="anchor">Anchor</option>
                <option value="admin">Admin</option>
            </select>
            <label >Enter your name</label>
            <input type="text"  value={name} onChange={(e) => setName(e.target.value)} />
            <label >enter Email</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Enter strong password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {role === "admin" && (
                <>
                <label >Enter your secret key<p>if dont know contact office</p></label>
                <input type="text" placeholder="Secret Key" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
                </>
            )}

            {role === "anchor" && (
                <>
                <label >Select domain</label>
                    <select value={domain} onChange={(e)=>setDomain(e.currentTarget.value)}>
                        <option value="arts">Arts and science</option>
                        <option value="engineering">Engineering and Technology</option>
                    </select>
                    <label >Upload your image</label>
                    <input type="file" onChange={handleImagechange} />
                    <label >Enter batch</label>
                    <input type="text" placeholder="Batch ex:'cit27E'" value={batch} onChange={(e) => setBatch(e.target.value)} />
                </>
            )}
            
            {role === "student" && (
                <>
                <label >Enter your domain</label>
                <select value={domain} onChange={(e)=>setDomain(e.currentTarget.value)}>
                        <option value="arts">Arts and science</option>
                        <option value="engineering">Engineering and Technology</option>
                    </select>
                    <label >Enter your registernumber</label>
                    <input type="text" placeholder="Enter your Register Number" value={registernumber} onChange={(e) => setRegisternumber(e.target.value)} />
                    <label >Enter your date of birth</label>
                    <input type="text" placeholder="Your DOB" value={dob} onChange={(e) => setDob(e.target.value)} />
                    <label >Enter your batch</label>
                    <input type="text" placeholder="Batch code ex.'cit27E' " value={batch} onChange={(e) => setBatch(e.target.value)} />
                    <label >Enter your college name</label>
                    <input type="text" placeholder="Your College Name" value={college} onChange={(e) => setCollege(e.target.value)} />
                    <label >upload yoour image</label>
                    <input type="file" onChange={handleImagechange} />
                    <label >Enter your department</label>
                    <input type="text" placeholder="your department "value={department} onChange={(e)=>setDepartment(e.target.value)} />
                </>
            )}
           
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;
