import React, { useState } from "react";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";

const AddCategory = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:5000/api/category", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add category");
            alert("✅ Category added successfully!");
            navigate("/view-category");
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
                <h3 className="title3">🏷️ Add Category</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>Category Name *</label>
                        <input type="text" required placeholder="e.g. Software Engineering" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <button type="submit" className="btn1" disabled={loading}>{loading ? "⏳ Saving..." : "🏷️ Add Category"}</button>
                    <br /><br />
                    <Link to="/view-category" className="link" style={{ display: "block", textAlign: "center" }}>← Back to Categories</Link>
                </form>
            </div>
        </div>
    );
};
export default AddCategory;