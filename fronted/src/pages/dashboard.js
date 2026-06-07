import React, { useState, useEffect, useContext } from "react";
import "./style/style.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        companies: 0,
        jobs: 0,
        applications: 0,
        profiles: 0,
        savedJobs: 0,
        categories: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const fetchStats = async () => {
            try {
                const [companies, jobs, applications, profiles, savedJobs, categories] = await Promise.all([
                    fetch("http://localhost:5000/api/company", { headers }).then(r => r.json()).catch(() => []),
                    fetch("http://localhost:5000/api/job", { headers }).then(r => r.json()).catch(() => []),
                    fetch("http://localhost:5000/api/application", { headers }).then(r => r.json()).catch(() => []),
                    fetch("http://localhost:5000/api/profile", { headers }).then(r => r.json()).catch(() => []),
                    fetch("http://localhost:5000/api/savejob", { headers }).then(r => r.json()).catch(() => []),
                    fetch("http://localhost:5000/api/category", { headers }).then(r => r.json()).catch(() => []),
                ]);
                setStats({
                    companies: Array.isArray(companies) ? companies.length : 0,
                    jobs: Array.isArray(jobs) ? jobs.length : 0,
                    applications: Array.isArray(applications) ? applications.length : 0,
                    profiles: Array.isArray(profiles) ? profiles.length : 0,
                    savedJobs: Array.isArray(savedJobs) ? savedJobs.length : 0,
                    categories: Array.isArray(categories) ? categories.length : 0,
                });
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
            navigate("/login");
        }
    };

    const statCards = [
        { label: "Companies", value: stats.companies, icon: "🏢", color: "green", link: "/view-company" },
        { label: "Jobs", value: stats.jobs, icon: "💼", color: "blue", link: "/view-job" },
        { label: "Applications", value: stats.applications, icon: "📋", color: "purple", link: "/view-application" },
        { label: "Profiles", value: stats.profiles, icon: "👤", color: "teal", link: "/view-profile" },
        { label: "Saved Jobs", value: stats.savedJobs, icon: "🔖", color: "orange", link: "/view-saveJob" },
        { label: "Categories", value: stats.categories, icon: "🏷️", color: "pink", link: "/view-category" },
    ];

    const quickLinks = [
        { label: "Add Company", icon: "🏢", to: "/add-company", color: "" },
        { label: "Add Job", icon: "💼", to: "/add-job", color: "blue" },
        { label: "Add Application", icon: "📋", to: "/add-application", color: "purple" },
        { label: "Add Category", icon: "🏷️", to: "/add-category", color: "orange" },
        { label: "Add Profile", icon: "👤", to: "/add-profile", color: "blue" },
        { label: "Save a Job", icon: "🔖", to: "/add-saveJob", color: "purple" },
    ];

    const activities = [
        { text: "New job application received", time: "Just now", dot: "green" },
        { text: "Company profile updated", time: "2 min ago", dot: "blue" },
        { text: "New category added", time: "15 min ago", dot: "purple" },
        { text: "Job posting created for React Dev", time: "1 hour ago", dot: "orange" },
        { text: "Profile updated successfully", time: "3 hours ago", dot: "green" },
    ];

    const displayName = user?.name || "Admin";
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <div className="dashboard-wrapper">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="welcome-text">
                    👋 Welcome back, <strong>{displayName}</strong>
                    <span style={{ marginLeft: 10, background: "#f0fdf4", color: "#059669", padding: "2px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600 }}>
                        {user?.role?.toUpperCase() || "USER"}
                    </span>
                </div>
                <div className="actions">
                    <Link to="/view-job" className="badge-btn">💼 Browse Jobs</Link>
                    <button className="badge-btn" onClick={handleLogout} style={{ color: "#dc2626" }}>
                        🚪 Logout
                    </button>
                    <div className="user-avatar">{initials}</div>
                </div>
            </div>

            {/* Header */}
            <div className="dashboard-header">
                <h1>📊 Dashboard Overview</h1>
                <p>Track your job portal activity and manage all records from one place.</p>
            </div>

            {/* Stats Cards */}
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span>Loading statistics...</span>
                </div>
            ) : (
                <div className="stats-grid">
                    {statCards.map((card, i) => (
                        <Link to={card.link} key={i} style={{ textDecoration: "none" }}>
                            <div className="stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
                                <div className={`stat-icon ${card.color}`}>{card.icon}</div>
                                <div className="stat-info">
                                    <h3>{card.value}</h3>
                                    <p>{card.label}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Two columns section */}
            <div className="dashboard-sections">
                {/* Quick Actions */}
                <div className="dash-section">
                    <h2><span className="sec-icon">⚡</span> Quick Actions</h2>
                    <div className="quick-actions">
                        {quickLinks.map((ql, i) => (
                            <Link key={i} to={ql.to} className={`quick-btn ${ql.color}`}>
                                {ql.icon} {ql.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dash-section">
                    <h2><span className="sec-icon">🕐</span> Recent Activity</h2>
                    <ul className="activity-list">
                        {activities.map((a, i) => (
                            <li className="activity-item" key={i}>
                                <div className={`activity-dot ${a.dot}`}></div>
                                <div>
                                    <div className="activity-text">{a.text}</div>
                                    <div className="activity-time">{a.time}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Portal Summary */}
            <div className="dash-section" style={{ marginBottom: 0 }}>
                <h2><span className="sec-icon">🌐</span> Job Portal Summary</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {[
                        { label: "Total Listings", val: stats.companies + stats.jobs, color: "#10b981" },
                        { label: "Active Applications", val: stats.applications, color: "#8b5cf6" },
                        { label: "Saved Opportunities", val: stats.savedJobs, color: "#f59e0b" },
                        { label: "Categories Open", val: stats.categories, color: "#3b82f6" },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: "#f8fafc",
                            borderRadius: 12,
                            padding: "16px 20px",
                            borderLeft: `4px solid ${item.color}`
                        }}>
                            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: item.color }}>{item.val}</div>
                            <div style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 500 }}>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;