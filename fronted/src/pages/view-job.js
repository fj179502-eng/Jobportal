import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewJob = () => {
    const [job, setJob] = useState([]);
    const [company, setCompany] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [jRes, cRes] = await Promise.all([
                    fetch("http://localhost:5000/api/job", { headers }),
                    fetch("http://localhost:5000/api/company", { headers }),
                ]);
                const jData = await jRes.json();
                const cData = await cRes.json();
                if (!jRes.ok) throw new Error(jData.message || "Failed to fetch jobs");
                setJob(Array.isArray(jData) ? jData : jData.data || []);
                setCompany(Array.isArray(cData) ? cData : cData.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const deleteJob = async (id) => {
        if (!window.confirm("Delete this job?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/job/${id}`, { method: "DELETE", headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setJob(prev => prev.filter(j => String(j.job_id) !== String(id)));
        } catch (err) { alert("Error: " + err.message); }
    };

    const badgeClass = (type) => {
        if (!type) return "";
        const t = type.toLowerCase();
        if (t === "remote") return "badge badge-remote";
        if (t === "onsite") return "badge badge-onsite";
        if (t === "hybrid") return "badge badge-hybrid";
        return "badge";
    };

    const filtered = job.filter(j =>
        j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.location?.toLowerCase().includes(search.toLowerCase()) ||
        j.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="home1">
            {error && <div className="alert alert-danger">⚠️ {error}</div>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 className="title3" style={{ marginBottom: 0 }}>💼 Jobs</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 200, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "inherit", fontSize: "0.875rem" }} />
                    <Link to="/add-job" className="btn-success">+ Add Job</Link>
                </div>
            </div>
            {loading ? (
                <div className="loading-container"><div className="spinner"></div><span>Loading...</span></div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th><th>Company</th><th>Title</th><th>Salary</th>
                                <th>Location</th><th>Type</th><th>Category</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="8" align="center" style={{ padding: 30, color: "#94a3b8" }}>No jobs found</td></tr>
                            ) : filtered.map((j, i) => (
                                <tr key={j.job_id}>
                                    <td>{i + 1}</td>
                                    <td>{company.find(c => String(c.company_id) === String(j.company_id))?.company_name || "N/A"}</td>
                                    <td><strong>{j.title}</strong></td>
                                    <td style={{ color: "#059669", fontWeight: 600 }}>💰 {j.salary}</td>
                                    <td>📍 {j.location}</td>
                                    <td><span className={badgeClass(j.job_type)}>{j.job_type}</span></td>
                                    <td>{j.category}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <Link to={`/update-job/${j.job_id}`} className="btn-success">✏️ Edit</Link>&nbsp;
                                        <button onClick={() => deleteJob(j.job_id)} className="btn-danger">🗑️ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#94a3b8" }}>Total: <strong>{filtered.length}</strong> jobs</div>
        </div>
    );
};
export default ViewJob;