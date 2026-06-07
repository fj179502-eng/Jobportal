import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";

const AddSaveJob = () => {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState([]);
    const [jobId, setJobId] = useState("");
    const [job, setJob] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [uRes, jRes] = await Promise.all([
                    fetch("http://localhost:5000/api/users", { headers }),
                    fetch("http://localhost:5000/api/job", { headers }),
                ]);
                const uData = await uRes.json();
                const jData = await jRes.json();
                setUser(Array.isArray(uData) ? uData : []);
                setJob(Array.isArray(jData) ? jData : jData.data || []);
            } catch (err) { setError(err.message); }
        };
        fetchAll();
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:5000/api/savejob", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ user_id: userId, job_id: jobId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to save job");
            alert("✅ Job saved successfully!");
            navigate("/view-saveJob");
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
                <h3 className="title3">🔖 Save a Job</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>User *</label>
                        <select value={userId} onChange={e => setUserId(e.target.value)} required>
                            <option value="">-- Select User --</option>
                            {user.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Job *</label>
                        <select value={jobId} onChange={e => setJobId(e.target.value)} required>
                            <option value="">-- Select Job --</option>
                            {job.map(j => <option key={j.job_id} value={j.job_id}>{j.title} — {j.location}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="btn1" disabled={loading}>{loading ? "⏳ Saving..." : "🔖 Save Job"}</button>
                    <br /><br />
                    <Link to="/view-saveJob" className="link" style={{ display: "block", textAlign: "center" }}>← Back to Saved Jobs</Link>
                </form>
            </div>
        </div>
    );
};
export default AddSaveJob;