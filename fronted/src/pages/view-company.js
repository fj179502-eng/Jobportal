import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewCompany = () => {
    const [company, setCompany] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const [cRes, uRes] = await Promise.all([
                    fetch("http://localhost:5000/api/company", { headers }),
                    fetch("http://localhost:5000/api/users", { headers }),
                ]);
                const cData = await cRes.json();
                const uData = await uRes.json();
                if (!cRes.ok) throw new Error(cData.message || "Failed to fetch companies");
                setCompany(Array.isArray(cData) ? cData : cData.data || []);
                setUser(Array.isArray(uData) ? uData : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const deleteCompany = async (id) => {
        if (!window.confirm("Are you sure you want to delete this company?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/company/${id}`, { method: "DELETE", headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setCompany(prev => prev.filter(c => String(c.company_id) !== String(id)));
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const filtered = company.filter(c =>
        c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.location?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="home1">
            {error && <div className="alert alert-danger">⚠️ {error}</div>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 className="title3" style={{ marginBottom: 0 }}>🏢 Companies</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="🔍 Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 200, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "inherit", fontSize: "0.875rem" }}
                    />
                    <Link to="/add-company" className="btn-success">+ Add Company</Link>
                </div>
            </div>
            {loading ? (
                <div className="loading-container"><div className="spinner"></div><span>Loading...</span></div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Company Name</th>
                                <th>Description</th>
                                <th>Website</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="7" align="center" style={{ padding: 30, color: "#94a3b8" }}>No companies found</td></tr>
                            ) : (
                                filtered.map((c, index) => (
                                    <tr key={c.company_id}>
                                        <td>{index + 1}</td>
                                        <td>{user.find(u => String(u.user_id) === String(c.user_id))?.name || "N/A"}</td>
                                        <td><strong>{c.company_name}</strong></td>
                                        <td style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.description}</td>
                                        <td>
                                            {c.website ? (
                                                <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                                                    target="_blank" rel="noreferrer"
                                                    style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.82rem" }}>
                                                    🌐 Visit
                                                </a>
                                            ) : "—"}
                                        </td>
                                        <td>📍 {c.location}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <Link to={`/update-company/${c.company_id}`} className="btn-success">✏️ Edit</Link>
                                            &nbsp;
                                            <button onClick={() => deleteCompany(c.company_id)} className="btn-danger">🗑️ Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#94a3b8" }}>
                Total: <strong>{filtered.length}</strong> {filtered.length === 1 ? "company" : "companies"}
            </div>
        </div>
    );
};

export default ViewCompany;