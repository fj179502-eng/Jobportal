import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewSaveJob = () => {
    const [savejob, setSaveJob] = useState([]);
    const [user, setUser] = useState([]);
    const [job, setJob] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [sRes, uRes, jRes] = await Promise.all([
                    fetch("http://localhost:5000/api/savejob", { headers }),
                    fetch("http://localhost:5000/api/users", { headers }),
                    fetch("http://localhost:5000/api/job", { headers }),
                ]);
                const sData = await sRes.json();
                const uData = await uRes.json();
                const jData = await jRes.json();
                if (!sRes.ok) throw new Error(sData.message || "Failed to fetch saved jobs");
                setSaveJob(Array.isArray(sData) ? sData : sData.data || []);
                setUser(Array.isArray(uData) ? uData : []);
                setJob(Array.isArray(jData) ? jData : jData.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const deleteSaveJob = async (id) => {
        if (!window.confirm("Remove this saved job?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/savejob/${id}`, { method: "DELETE", headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setSaveJob(prev => prev.filter(sj => String(sj.saved_id) !== String(id)));
        } catch (err) { alert("Error: " + err.message); }
    };

    const filtered = savejob.filter(sj => {
        const uName = user.find(u => String(u.user_id) === String(sj.user_id))?.name || "";
        const jTitle = job.find(j => String(j.job_id) === String(sj.job_id))?.title || "";
        return uName.toLowerCase().includes(search.toLowerCase()) ||
            jTitle.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="home1">
            {error && <div className="alert alert-danger">⚠️ {error}</div>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 className="title3" style={{ marginBottom: 0 }}>🔖 Saved Jobs</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 200, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "inherit", fontSize: "0.875rem" }} />
                    <Link to="/add-saveJob" className="btn-success">+ Save a Job</Link>
                </div>
            </div>
            {loading ? (
                <div className="loading-container"><div className="spinner"></div><span>Loading...</span></div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr><th>#</th><th>User</th><th>Job Title</th><th>Job Location</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" align="center" style={{ padding: 30, color: "#94a3b8" }}>No saved jobs found</td></tr>
                            ) : filtered.map((sj, i) => {
                                const jobData = job.find(j => String(j.job_id) === String(sj.job_id));
                                return (
                                    <tr key={sj.saved_id}>
                                        <td>{i + 1}</td>
                                        <td><strong>👤 {user.find(u => String(u.user_id) === String(sj.user_id))?.name || "N/A"}</strong></td>
                                        <td>💼 {jobData?.title || "N/A"}</td>
                                        <td>📍 {jobData?.location || "—"}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <Link to={`/update-saveJob/${sj.saved_id}`} className="btn-success">✏️ Edit</Link>&nbsp;
                                            <button onClick={() => deleteSaveJob(sj.saved_id)} className="btn-danger">🗑️ Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#94a3b8" }}>Total: <strong>{filtered.length}</strong> saved jobs</div>
        </div>
    );
};
export default ViewSaveJob;