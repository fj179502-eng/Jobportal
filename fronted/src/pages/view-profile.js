import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewProfile = () => {
    const [profile, setProfile] = useState([]);
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
                const [pRes, uRes] = await Promise.all([
                    fetch("http://localhost:5000/api/profile", { headers }),
                    fetch("http://localhost:5000/api/users", { headers }),
                ]);
                const pData = await pRes.json();
                const uData = await uRes.json();
                if (!pRes.ok) throw new Error(pData.message || "Failed to fetch profiles");
                setProfile(Array.isArray(pData) ? pData : pData.data || []);
                setUser(Array.isArray(uData) ? uData : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const deleteProfile = async (id) => {
        if (!window.confirm("Delete this profile?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/profile/${id}`, { method: "DELETE", headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setProfile(prev => prev.filter(p => String(p.profile_id) !== String(id)));
        } catch (err) { alert("Error: " + err.message); }
    };

    const filtered = profile.filter(p => {
        const uName = user.find(u => String(u.user_id) === String(p.user_id))?.name || "";
        return uName.toLowerCase().includes(search.toLowerCase()) ||
            p.skills?.toLowerCase().includes(search.toLowerCase()) ||
            p.education?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="home1">
            {error && <div className="alert alert-danger">⚠️ {error}</div>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 className="title3" style={{ marginBottom: 0 }}>👤 Profiles</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 200, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "inherit", fontSize: "0.875rem" }} />
                    <Link to="/add-profile" className="btn-success">+ Add Profile</Link>
                </div>
            </div>
            {loading ? (
                <div className="loading-container"><div className="spinner"></div><span>Loading...</span></div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th><th>User</th><th>Skills</th><th>Experience</th>
                                <th>Education</th><th>Resume</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="7" align="center" style={{ padding: 30, color: "#94a3b8" }}>No profiles found</td></tr>
                            ) : filtered.map((p, i) => (
                                <tr key={p.profile_id}>
                                    <td>{i + 1}</td>
                                    <td><strong>👤 {user.find(u => String(u.user_id) === String(p.user_id))?.name || "N/A"}</strong></td>
                                    <td style={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {p.skills || "—"}
                                    </td>
                                    <td style={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {p.experience || "—"}
                                    </td>
                                    <td>{p.education || "—"}</td>
                                    <td>
                                        {p.resume_url ? (
                                            <a href={`http://localhost:5000/uploads/${p.resume_url}`} target="_blank" rel="noreferrer"
                                                className="btn-success" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>📄 View</a>
                                        ) : <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>No file</span>}
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <Link to={`/update-profile/${p.profile_id}`} className="btn-success">✏️ Edit</Link>&nbsp;
                                        <button onClick={() => deleteProfile(p.profile_id)} className="btn-danger">🗑️ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#94a3b8" }}>Total: <strong>{filtered.length}</strong> profiles</div>
        </div>
    );
};
export default ViewProfile;