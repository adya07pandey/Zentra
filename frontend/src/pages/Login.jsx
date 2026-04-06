import { useNavigate } from "react-router-dom"
import { login } from "../api/auth";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { fetchUser } = useAuth();
    const [form,setForm] = useState({email:"", password:""});
    const [error,setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({...form,[e.target.name]:e.target.value});
    };
    const validateForm = () => {
        if (!form.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address";
        if (!form.password.trim()) return "Password is required";
        return null;
    };

    const handleLogin = async() => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        try{
            setLoading(true)
            await login(form);
            await fetchUser();
            console.log("navigate");
            navigate("/dashboard");
        }catch(err){
            setError(err.response?.data?.message || "Login failed");
        }finally{
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
                        <img src="/logo.png" alt="" />
                        <h2>Welcome Back!</h2>
                        <input name = "email" type="email" placeholder="Email" onChange={handleChange} />
                        <input name = "password" type="password" placeholder="Password" onChange={handleChange} />
                        {error && <p className="errortext">{error}</p>}
                        <button disabled={loading} className="signupbtn" onClick={handleLogin}>{loading ? "Logging in..." : "Login"}</button>
                        <p>
                            Don't have an account?
                            <button className="signup-change" onClick={() => navigate("../signup")}> <u>Signup</u></button>
                        </p>

                    </div>
                </div>
            </div>
        </>
    )
}