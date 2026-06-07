import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";

const AddCompany = () => {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users", { headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch users");
                setUser(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUser();
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const body = { user_id: userId, company_name: companyName, description, website, location };
            const res = await fetch("http://localhost:5000/api/company", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add company");
            alert("✅ Company added successfully!");
            navigate("/view-company");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page-wrapper">
            <div className="home">
                {error && <div className="alert alert-danger">⚠️ {error}</div>}
                <h3 className="title3">🏢 Add Company</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>User *</label>
                        <select value={userId} onChange={e => setUserId(e.target.value)} required>
                            <option value="">-- Select User --</option>
                            {user.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Company Name *</label>
                        <input type="text" required placeholder="Enter company name" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea placeholder="Describe the company..." value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Website</label>
                        <input type="text" placeholder="https://example.com" value={website} onChange={e => setWebsite(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Location *</label>
                        <input type="text" required placeholder="City, Country" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <button type="submit" className="btn1" disabled={loading}>{loading ? "⏳ Saving..." : "🏢 Add Company"}</button>
                    <br /><br />
                    <Link to="/view-company" className="link" style={{ display: "block", textAlign: "center" }}>← Back to Companies</Link>
                </form>
            </div>
        </div>
    );
};
export default AddCompany;