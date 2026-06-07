import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "./image/download.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await fetch(`http://localhost:5000/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await result.json();
            if (result.ok) {
                localStorage.setItem("token", data.token);
                const userData = {
                    user_id: data.user?.user_id || "",
                    name: data.user?.name || "",
                    email: data.user?.email || "",
                    role: data.user?.role || "",
                };
                login(userData);
                navigate("/dashboard");
            } else {
                setError(typeof data === "string" ? data : data.message || "Login failed. Please try again.");
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
                    {error && <div className="login-error">⚠️ {error}</div>}

                    <div align="center">
                        <img src={logo} alt="JobPortal Logo" className="logo" />
                    </div>

                     <h3 className="title2">Welcome Back 👋</h3>
                    <h3 className="title">Login to Your Account</h3>

                    <form onSubmit={onSubmitForm}>
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
                            <label htmlFor="password">Password *</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password"
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingRight: 44 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: "absolute", right: 12, top: "50%",
                                        transform: "translateY(-50%)", background: "none",
                                        border: "none", cursor: "pointer", fontSize: "1rem",
                                        color: "#64748b", padding: 0,
                                    }}
                                >
                                    {showPass ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <p className="title1">
                            Don't have an account?{" "}
                            <Link to="/registration" className="link">Create Account</Link>
                        </p>

                        <br />
                        <button type="submit" className="btn1" disabled={loading}>
                            {loading ? "⏳ Logging in..." : "🚀 Login"}
                        </button>
                        <br />
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;