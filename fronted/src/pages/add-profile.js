import React, { useState, useEffect } from "react";
import "./style/style.css";
import { useNavigate, Link } from "react-router-dom";

const AddProfile = () => {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState([]);
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [education, setEducation] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users", { headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch users");
                setUser(Array.isArray(data) ? data : []);
            } catch (err) { setError(err.message); }
        };
        fetchUser();
    }, []);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("skills", skills);
            formData.append("experience", experience);
            formData.append("education", education);
            if (resumeFile) formData.append("resume", resumeFile);

            const res = await fetch("http://localhost:5000/api/profile", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add profile");
            alert("✅ Profile added successfully!");
            navigate("/view-profile");
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
                <h3 className="title3">👤 Add Profile</h3>
                <form onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <label>User *</label>
                        <select value={userId} onChange={e => setUserId(e.target.value)} required>
                            <option value="">-- Select User --</option>
                            {user.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Skills *</label>
                        <textarea placeholder="e.g. React, Node.js, PostgreSQL" value={skills} onChange={e => setSkills(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Experience</label>
                        <textarea placeholder="e.g. 3 years as Frontend Developer at XYZ" value={experience} onChange={e => setExperience(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Education</label>
                        <input type="text" placeholder="e.g. BSc Computer Science" value={education} onChange={e => setEducation(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Upload Resume</label>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])}
                            style={{ padding: "8px 0", border: "none", background: "none" }} />
                    </div>
                    <button type="submit" className="btn1" disabled={loading}>{loading ? "⏳ Saving..." : "👤 Add Profile"}</button>
                    <br /><br />
                    <Link to="/view-profile" className="link" style={{ display: "block", textAlign: "center" }}>← Back to Profiles</Link>
                </form>
            </div>
        </div>
    );
};
export default AddProfile;