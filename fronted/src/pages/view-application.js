import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewApplication = () => {
    const [application, setApplication] = useState([]);
    const [job, setJob] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [aRes, jRes, uRes] = await Promise.all([
                    fetch("http://localhost:5000/api/application", { headers }),
                    fetch("http://localhost:5000/api/job", { headers }),
                    fetch("http://localhost:5000/api/users", { headers }),
                ]);
                const aData = await aRes.json();
                const jData = await jRes.json();
                const uData = await uRes.json();
                if (!aRes.ok) throw new Error(aData.message || "Failed to fetch applications");
                setApplication(Array.isArray(aData) ? aData : aData.data || []);
                setJob(Array.isArray(jData) ? jData : jData.data || []);
                setUser(Array.isArray(uData) ? uData : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const deleteApp = async (id) => {
        if (!window.confirm("Delete this application?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/application/${id}`, { method: "DELETE", headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setApplication(prev => prev.filter(a => String(a.application_id) !== String(id)));
        } catch (err) { alert("Error: " + err.message); }
    };

    const statusBadge = (status) => {
        if (!status) return <span className="badge badge-pending">pending</span>;
        const s = status.toLowerCase();
        if (s === "approved") return <span className="badge badge-approved">✅ Approved</span>;
        if (s === "rejected") return <span className="badge badge-rejected">❌ Rejected</span>;
        return <span className="badge badge-pending">⏳ Pending</span>;
    };

    const filtered = application.filter(a => {
        const jName = job.find(j => String(j.job_id) === String(a.job_id))?.title || "";
        const uName = user.find(u => String(u.user_id) === String(a.user_id))?.name || "";
        return jName.toLowerCase().includes(search.toLowerCase()) ||
            uName.toLowerCase().includes(search.toLowerCase()) ||
            a.status?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="home1">
            {error && <div className="alert alert-danger">⚠️ {error}</div>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 className="title3" style={{ marginBottom: 0 }}>📋 Applications</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 200, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "inherit", fontSize: "0.875rem" }} />
                    <Link to="/add-application" className="btn-success">+ Add Application</Link>
                </div>
            </div>
            {loading ? (
                <div className="loading-container"><div className="spinner"></div><span>Loading...</span></div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th><th>Job</th><th>Applicant</th><th>Cover Letter</th>
                                <th>CV</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="7" align="center" style={{ padding: 30, color: "#94a3b8" }}>No applications found</td></tr>
                            ) : filtered.map((app, i) => (
                                <tr key={app.application_id}>
                                    <td>{i + 1}</td>
                                    <td><strong>{job.find(j => String(j.job_id) === String(app.job_id))?.title || "N/A"}</strong></td>
                                    <td>👤 {user.find(u => String(u.user_id) === String(app.user_id))?.name || "N/A"}</td>
                                    <td style={{ maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {app.cover_letter || "—"}
                                    </td>
                                    <td>
                                        {app.cv_url ? (
                                            <>
                                                <a href={`http://localhost:5000/uploads/${app.cv_url}`} target="_blank" rel="noreferrer"
                                                    className="btn-success" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>👁️ View</a>
                                                &nbsp;
                                                <a href={`http://localhost:5000/uploads/${app.cv_url}`} download
                                                    className="btn-success" style={{ fontSize: "0.75rem", padding: "4px 10px", background: "linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow: "0 2px 6px rgba(59,130,246,0.3)" }}>⬇️</a>
                                            </>
                                        ) : <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>No CV</span>}
                                    </td>
                                    <td>{statusBadge(app.status)}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <Link to={`/update-application/${app.application_id}`} className="btn-success">✏️ Edit</Link>&nbsp;
                                        <button onClick={() => deleteApp(app.application_id)} className="btn-danger">🗑️ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#94a3b8" }}>Total: <strong>{filtered.length}</strong> applications</div>
        </div>
    );
};
export default ViewApplication;