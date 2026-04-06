import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { signupInit, signupVerify } from "../api/auth";
import { FaArrowLeft } from 'react-icons/fa';
export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", email: "", password: "", orgName: ""
    });
    const[otp, setOTP] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifybox, setVerifyBox] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) {
            setError("");
        }
    };

    const handleOtpChange = (e) => {
        setOTP(e.target.value);
        if (error) {
            setError(""); 
        }
    }

    const validateForm = () => {
        if (!form.name.trim()) return "Name is required";

        if (!form.orgName.trim()) return "Organization name is required";

        if (!form.email.trim()) return "Emil is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return "Enter a valid email address";
        }

        if (!form.password) return "Password is required";
        if (form.password.length < 8) {
            return "Password must be at least 8 characters";
        }

        return null;
    };


    const handleSignup = async () => {
        console.log(form.orgName);
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(""); 
        try {
            setLoading(true);
            await signupInit(form);
            setVerifyBox(true);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");

        } finally {
            setLoading(false);
        }
    }

    const handleVerify = async () => {
        if (!otp) {
            setError("OTP is required. Sent to mail " + form.email);return;
        }
        setError("");
        try {
            setLoading(true);
            await signupVerify({ email: form.email, otp });
            setForm({ name: "", email: "", password: "", orgName: "" });
            setOTP("");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="signuppage">
                <div className="signupbox">
                    <div className="signupleft">

                    </div>
                    <div className="signupright">
                        {verifybox && <button className="backbtn" onClick={() => setVerifyBox(false)}> <FaArrowLeft /></button>}
                        <img src="/logo.png" alt="" />
                        <h2>Create Account!</h2>
                        {verifybox &&
                            <>

                                <input  type="email"  value={form.email}  readOnly  className="disabled-input"/>
                                <input name="otp" type="text" placeholder="Enter OTP" onChange={handleOtpChange} />
                                <p className="otp-email">OTP sent to: <b>{form.email}</b></p>
                                {error && <p className="errortext">{error}</p>}
                                <button className="signupbtn" onClick={handleVerify}>Continue</button>

                            </>}
                        {!verifybox &&
                            <>
                                <input name="name" type="text" placeholder="Name" onChange={handleChange} />
                                <input name="email" type="email" placeholder="Email" onChange={handleChange} />
                                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                                <input name="orgName" type="text" placeholder="Organization Name" onChange={handleChange} />
                                {error && <p className="errortext">{error}</p>}
                                <button disabled={loading} className="signupbtn" onClick={handleSignup}>{loading ? "Signing up..." : "Signup"}</button>
                                <p>
                                    Already have an account?
                                    <button className="signup-change" onClick={() => { navigate("../login") }} > <u>Login</u></button>
                                </p>

                            </>

                        }

                    </div>
                </div>
            </div>
        </>
    )
}