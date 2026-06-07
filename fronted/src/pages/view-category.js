import React, { useState, useEffect } from "react";
import "./style/style.css";
import { Link } from "react-router-dom";

const ViewCategory = () => {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:5000/api/category", { headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
                setCategory(Array.isArray(data) ? data : data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, []);

    const deleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/category/${id}`, { method: "DELETE", headers });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            setCategory(prev => prev.filter(c => String(c.category_id) !== String(id)));
        } catch (err) { alert("Error: " + err.message); }
    };

    const filtered = category.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="home1">
            {error && <div className="alert alert-danger">⚠️ {error}</div>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 className="title3" style={{ marginBottom: 0 }}>🏷️ Categories</h3>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="text" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 200, padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "inherit", fontSize: "0.875rem" }} />
                    <Link to="/add-category" className="btn-success">+ Add Category</Link>
                </div>
            </div>
            {loading ? (
                <div className="loading-container"><div className="spinner"></div><span>Loading...</span></div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr><th>#</th><th>Category Name</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="3" align="center" style={{ padding: 30, color: "#94a3b8" }}>No categories found</td></tr>
                            ) : filtered.map((ca, i) => (
                                <tr key={ca.category_id}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <span className="badge" style={{ background: "#ede9fe", color: "#7c3aed", padding: "4px 12px" }}>
                                            🏷️ {ca.name}
                                        </span>
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <Link to={`/update-category/${ca.category_id}`} className="btn-success">✏️ Edit</Link>&nbsp;
                                        <button onClick={() => deleteCategory(ca.category_id)} className="btn-danger">🗑️ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#94a3b8" }}>Total: <strong>{filtered.length}</strong> categories</div>
        </div>
    );
};
export default ViewCategory;