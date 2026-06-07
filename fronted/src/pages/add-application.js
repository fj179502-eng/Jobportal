import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";

const AddApplication = () => {
    const [jobId, setJobId] = useState("");
    const [job, setJob] = useState([]);
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState([]);
    const [coverLetter, setCoverLetter] = useState("");
    const [cvFile, setCvFile] = useState(null);
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [jRes, uRes] = await Promise.all([
                    fetch("http://localhost:5000/api/job", { headers }),
                    fetch("http://localhost:5000/api/users", { headers }),
                ]);
                const jData = await jRes.json();
                const uData = await uRes.json();
                setJob(Array.isArray(jData) ? jData : jData.data || []);
                setUser(Array.isArray(uData) ? uData : []);
            } catch (err) { setError(err.message); }
        };
        fetchAll();
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("job_id", jobId);
            formData.append("user_id", userId);
            formData.append("cover_letter", coverLetter);
            formData.append("status", status);
            if (cvFile) formData.append("cv", cvFile);

            const res = await fetch("http://localhost:5000/api/application", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add application");
            alert("✅ Application submitted successfully!");
            navigate("/view-application");
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
                <h3 className="title3">📋 Add Application</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>Job *</label>
                        <select value={jobId} onChange={e => setJobId(e.target.value)} required>
                            <option value="">-- Select Job --</option>
                            {job.map(j => <option key={j.job_id} value={j.job_id}>{j.title}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Applicant *</label>
                        <select value={userId} onChange={e => setUserId(e.target.value)} required>
                            <option value="">-- Select User --</option>
                            {user.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Cover Letter</label>
                        <textarea placeholder="Write your cover letter..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} style={{ minHeight: 100 }} />
                    </div>
                    <div className="form-group">
                        <label>Upload CV (PDF/DOC)</label>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])}
                            style={{ padding: "8px 0", border: "none", background: "none" }} />
                    </div>
                    <div className="form-group">
                        <label>Status *</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} required>
                            <option value="pending">⏳ Pending</option>
                            <option value="approved">✅ Approved</option>
                            <option value="rejected">❌ Rejected</option>
                        </select>
                    </div>
                    <button type="submit" className="btn1" disabled={loading}>{loading ? "⏳ Submitting..." : "📋 Submit Application"}</button>
                    <br /><br />
                    <Link to="/view-application" className="link" style={{ display: "block", textAlign: "center" }}>← Back to Applications</Link>
                </form>
            </div>
        </div>
    );
};
export default AddApplication;