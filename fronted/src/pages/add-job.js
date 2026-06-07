import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";

const AddJob = () => {
    const [companyId, setCompanyId] = useState("");
    const [company, setCompany] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/company", { headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
                setCompany(Array.isArray(data) ? data : data.data || []);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchCompany();
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const body = { company_id: companyId, title, description, salary, location, job_type: jobType, category };
            const res = await fetch("http://localhost:5000/api/job", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add job");
            alert("✅ Job added successfully!");
            navigate("/view-job");
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
                <h3 className="title3">💼 Add Job</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>Company *</label>
                        <select value={companyId} onChange={e => setCompanyId(e.target.value)} required>
                            <option value="">-- Select Company --</option>
                            {company.map(c => <option key={c.company_id} value={c.company_id}>{c.company_name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Job Title *</label>
                        <input type="text" required placeholder="e.g. React Developer" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea placeholder="Describe the role and responsibilities..." value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Salary</label>
                        <input type="text" placeholder="e.g. $50,000 - $70,000" value={salary} onChange={e => setSalary(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Location *</label>
                        <input type="text" required placeholder="City, Country" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Job Type *</label>
                        <select value={jobType} onChange={e => setJobType(e.target.value)} required>
                            <option value="">-- Select Type --</option>
                            <option value="remote">🌐 Remote</option>
                            <option value="onsite">🏢 On-Site</option>
                            <option value="hybrid">🔄 Hybrid</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input type="text" placeholder="e.g. Software Engineering" value={category} onChange={e => setCategory(e.target.value)} />
                    </div>
                    <button type="submit" className="btn1" disabled={loading}>{loading ? "⏳ Saving..." : "💼 Add Job"}</button>
                    <br /><br />
                    <Link to="/view-job" className="link" style={{ display: "block", textAlign: "center" }}>← Back to Jobs</Link>
                </form>
            </div>
        </div>
    );
};
export default AddJob;