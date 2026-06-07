import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, useParams, Link } from "react-router-dom";

const UpdateCompany = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ user_id: "", company_name: "", description: "", website: "", location: "" });

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [cRes, uRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/company/${id}`, { headers }),
                    fetch("http://localhost:5000/api/users", { headers }),
                ]);
                const cData = await cRes.json();
                const uData = await uRes.json();
                if (!cRes.ok) throw new Error(cData.message || "Failed to fetch company");
                setFormData({ user_id: cData.user_id || "", company_name: cData.company_name || "", description: cData.description || "", website: cData.website || "", location: cData.location || "" });
                setUser(Array.isArray(uData) ? uData : []);
            } catch (err) { setError(err.message); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:5000/api/company/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            alert("✅ Company updated successfully!");
            navigate("/view-company");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="form-page-wrapper"><div className="loading-container"><div className="spinner"></div><span>Loading...</span></div></div>;

    return (
        <div className="form-page-wrapper">
            <div className="home">
                {error && <div className="alert alert-danger">⚠️ {error}</div>}
                <h3 className="title3">✏️ Update Company</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>User *</label>
                        <select name="user_id" value={formData.user_id} onChange={handleChange}>
                            <option value="">-- Select User --</option>
                            {user.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Company Name *</label>
                        <input type="text" name="company_name" required value={formData.company_name} onChange={handleChange} placeholder="Enter company name" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" />
                    </div>
                    <div className="form-group">
                        <label>Website</label>
                        <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                    </div>
                    <div className="form-group">
                        <label>Location *</label>
                        <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="City, Country" />
                    </div>
                    <button type="submit" className="btn1" disabled={saving}>{saving ? "⏳ Updating..." : "✅ Update Company"}</button>
                    <br /><br />
                    <Link to="/view-company" className="link" style={{ display: "block", textAlign: "center" }}>← Back to Companies</Link>
                </form>
            </div>
        </div>
    );
};
export default UpdateCompany;