import React, { useState, useContext } from "react";
import "./style/style.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import {
    FaTachometerAlt, FaBuilding, FaBriefcase, FaFileAlt,
    FaUser, FaBookmark, FaTags, FaChevronDown,
    FaChevronRight, FaCircle, FaBars, FaTimes, FaSignOutAlt
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const closeSidebar = () => {
        setSidebarOpen && setSidebarOpen(false);
    };

    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [isJobOpen, setIsJobOpen] = useState(false);
    const [isApplicationOpen, setIsApplicationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSaveJobOpen, setIsSaveJobOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const toggle = (setter, others) => {
        others.forEach(s => s(false));
        setter(prev => !prev);
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
            navigate("/login");
        }
    };

    const displayName = user?.name || "Admin";
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                className="hamburger-btn"
                onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
                style={{ display: "flex" }}
            >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={closeSidebar}></div>
            )}

            <div className={`sidebar ${sidebarOpen ? "Open" : ""}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="brand-icon">💼</div>
                    <div>
                        <div className="brand-name">JobPortal</div>
                        <div className="brand-sub">Admin Panel</div>
                    </div>
                </div>

                {/* User Info */}
                <div style={{
                    padding: "12px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                    borderBottom: "1px solid rgba(255,255,255,0.06)"
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg, #10b981, #3b82f6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 700, fontSize: "0.9rem", flexShrink: 0
                    }}>
                        {initials}
                    </div>
                    <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>{displayName}</div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                            {user?.role || "Job Seeker"}
                        </div>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <div className="menu-label">Navigation</div>

                    {/* Dashboard */}
                    <div className="menu-item">
                        <Link to="/dashboard" onClick={closeSidebar}>
                            <FaTachometerAlt className="icon" /> Dashboard
                        </Link>
                    </div>

                    {/* Company */}
                    <div className="menu-item dropdown-toggle" onClick={() =>
                        toggle(setIsCompanyOpen, [setIsJobOpen, setIsApplicationOpen, setIsProfileOpen, setIsSaveJobOpen, setIsCategoryOpen])
                    }>
                        <Link to="#">
                            <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                                <FaBuilding className="icon" /> Company
                            </span>
                            {isCompanyOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </Link>
                    </div>
                    {isCompanyOpen && (
                        <div className="dropdown-content open">
                            <div className="dropdown-item">
                                <Link to="/add-company" onClick={closeSidebar}><FaCircle size={7} /> Add Company</Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-company" onClick={closeSidebar}><FaCircle size={7} /> View Company</Link>
                            </div>
                        </div>
                    )}

                    {/* Jobs */}
                    <div className="menu-item dropdown-toggle" onClick={() =>
                        toggle(setIsJobOpen, [setIsCompanyOpen, setIsApplicationOpen, setIsProfileOpen, setIsSaveJobOpen, setIsCategoryOpen])
                    }>
                        <Link to="#">
                            <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                                <FaBriefcase className="icon" /> Jobs
                            </span>
                            {isJobOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </Link>
                    </div>
                    {isJobOpen && (
                        <div className="dropdown-content open">
                            <div className="dropdown-item">
                                <Link to="/add-job" onClick={closeSidebar}><FaCircle size={7} /> Add Job</Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-job" onClick={closeSidebar}><FaCircle size={7} /> View Jobs</Link>
                            </div>
                        </div>
                    )}

                    {/* Application */}
                    <div className="menu-item dropdown-toggle" onClick={() =>
                        toggle(setIsApplicationOpen, [setIsCompanyOpen, setIsJobOpen, setIsProfileOpen, setIsSaveJobOpen, setIsCategoryOpen])
                    }>
                        <Link to="#">
                            <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                                <FaFileAlt className="icon" /> Applications
                            </span>
                            {isApplicationOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </Link>
                    </div>
                    {isApplicationOpen && (
                        <div className="dropdown-content open">
                            <div className="dropdown-item">
                                <Link to="/add-application" onClick={closeSidebar}><FaCircle size={7} /> Add Application</Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-application" onClick={closeSidebar}><FaCircle size={7} /> View Applications</Link>
                            </div>
                        </div>
                    )}

                    {/* Profile */}
                    <div className="menu-item dropdown-toggle" onClick={() =>
                        toggle(setIsProfileOpen, [setIsCompanyOpen, setIsJobOpen, setIsApplicationOpen, setIsSaveJobOpen, setIsCategoryOpen])
                    }>
                        <Link to="#">
                            <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                                <FaUser className="icon" /> Profiles
                            </span>
                            {isProfileOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </Link>
                    </div>
                    {isProfileOpen && (
                        <div className="dropdown-content open">
                            <div className="dropdown-item">
                                <Link to="/add-profile" onClick={closeSidebar}><FaCircle size={7} /> Add Profile</Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-profile" onClick={closeSidebar}><FaCircle size={7} /> View Profiles</Link>
                            </div>
                        </div>
                    )}

                    {/* Save Job */}
                    <div className="menu-item dropdown-toggle" onClick={() =>
                        toggle(setIsSaveJobOpen, [setIsCompanyOpen, setIsJobOpen, setIsApplicationOpen, setIsProfileOpen, setIsCategoryOpen])
                    }>
                        <Link to="#">
                            <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                                <FaBookmark className="icon" /> Saved Jobs
                            </span>
                            {isSaveJobOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </Link>
                    </div>
                    {isSaveJobOpen && (
                        <div className="dropdown-content open">
                            <div className="dropdown-item">
                                <Link to="/add-saveJob" onClick={closeSidebar}><FaCircle size={7} /> Save a Job</Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-saveJob" onClick={closeSidebar}><FaCircle size={7} /> View Saved Jobs</Link>
                            </div>
                        </div>
                    )}

                    {/* Category */}
                    <div className="menu-item dropdown-toggle" onClick={() =>
                        toggle(setIsCategoryOpen, [setIsCompanyOpen, setIsJobOpen, setIsApplicationOpen, setIsProfileOpen, setIsSaveJobOpen])
                    }>
                        <Link to="#">
                            <span style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                                <FaTags className="icon" /> Categories
                            </span>
                            {isCategoryOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                        </Link>
                    </div>
                    {isCategoryOpen && (
                        <div className="dropdown-content open">
                            <div className="dropdown-item">
                                <Link to="/add-category" onClick={closeSidebar}><FaCircle size={7} /> Add Category</Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to="/view-category" onClick={closeSidebar}><FaCircle size={7} /> View Categories</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Logout */}
                <div className="sidebar-logout">
                    <button onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;