import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "./image/download.jpg";

const Registration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("job_seeker");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await fetch(`http://localhost:5000/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, role, password }),
            });
            const data = await result.json();
            if (result.ok) {
                localStorage.setItem("token", data.token);
                const userData = {
                    user_id: data.user?.user_id || "",
                    name: data.user?.name || name,
                    email: data.user?.email || email,
                    role: data.user?.role || role,
                };
                login(userData);
                navigate("/login");
            } else {
                setError(typeof data === "string" ? data : data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Connection error. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hero">
            <div className="container">
                <div className="home">
                    {error && <div className="registration-error">⚠️ {error}</div>}

                    <div align="center">
                        <img src={logo} alt="JobPortal Logo" className="logo" />
                    </div>

                    <h3 className="title2">Join JobPortal 🚀</h3>
                    <h3 className="title">Create Your Account</h3>

                    <form onSubmit={onSubmitForm}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                required
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="e.g. abc@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role *</label>
                            <select
                                id="role"
                                name="role"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="job_seeker">Job Seeker</option>
                                <option value="employer">Employer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <p className="title1">
                            Already have an account?{" "}
                            <Link to="/login" className="link">Login</Link>
                        </p>

                        <br />
                        <button type="submit" className="btn1" disabled={loading}>
                            {loading ? "⏳ Creating account..." : "✅ Register"}
                        </button>
                        <br />
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Registration;