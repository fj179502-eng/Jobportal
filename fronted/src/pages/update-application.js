import React,{useState,useEffect} from "react";
import "./style/style.css";
import { useNavigate,useParams } from "react-router-dom";

const UpdateApplication=()=>{
    const{id}=useParams();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    const[job,setJob]=useState([]);
    const[user,setUser]=useState([]);
    const navigate=useNavigate();

    const [formData, setFormData] = useState({job_id: "",user_id: "",cover_letter: "",cv_url: "",cv_file: null,status: ""
        
    });

    useEffect(() => {
    const fetchApplication = async () => {
        try {
            const token = localStorage.getItem("token");
            const result = await fetch(`http://localhost:5000/api/application/${id}`,{
                headers: { Authorization: `Bearer ${token}` }
                }
            );
            const data = await result.json();
            if (!result.ok) throw new Error(data.message||"Failed to fetch application");
            setFormData({
                job_id: data.job_id,
                user_id: data.user_id,
                cover_letter: data.cover_letter,
                status: data.status,
                cv_url: data.cv_url
            });

        } 
        catch (err) {
            setError(err.message);
        }
    };
    fetchApplication();
}, [id]);


    const handleEditChange=async(e)=>{
        const{name,value}=e.target;
        setFormData(prev=>({...prev,[name]:value}));
    }

    const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem("token");

        const formDataToSend = new FormData();
        formDataToSend.append("job_id", formData.job_id);
        formDataToSend.append("user_id", formData.user_id);
        formDataToSend.append("cover_letter", formData.cover_letter);
        formDataToSend.append("status", formData.status);

        if (formData.cv_file) {
            formDataToSend.append("cv", formData.cv_file);
        }

        const result = await fetch(`http://localhost:5000/api/application/${id}`, {
            method: "PUT",
            headers: {Authorization: `Bearer ${token}`},
            body: formDataToSend
        });

        const data = await result.json();

        if (!result.ok) {
            throw new Error(data.message || "Update failed");
        }
        alert("Application updated");
        navigate("/view-application");

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
                const fetchJob = async () => {
                    try {
                        const token = localStorage.getItem("token");
        
                        const result = await fetch(`http://localhost:5000/api/job`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
        
                        const data = await result.json();
                        console.log("JOBS:", data);
        
                        if (!result.ok) {
                            throw new Error(data.message || "Failed to fetch job");
                        }
                        if(Array.isArray(data)){
                            setJob(data);
                        }
                        else if(Array.isArray(data.data)){
                            setJob(data.data);
                        }
                        else{
                            setJob([]);
                        }
                        
        
                    } catch (err) {
                        console.error(err);
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                };
        
                fetchJob();
            }, []);
    
    
    
         useEffect(() => {
                const fetchUser = async () => {
                    try {
                        const token = localStorage.getItem("token");
        
                        const result = await fetch(`http://localhost:5000/api/users`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
        
                        const data = await result.json();
                        console.log("USERS:", data);
        
                        if (!result.ok) {
                            throw new Error(data.message || "Failed to fetch User");
                        }
        
                         if(Array.isArray(data)){
                            setUser(data);
                        }
                        else if(Array.isArray(data.data)){
                            setUser(data.data);
                        }
                        else{
                            setUser([]);
                        }
        
                    } catch (err) {
                        console.error(err);
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                };
        
                fetchUser();
            }, []);

  return (
        <div className="container">
            <div className="home">
                  {error && (
                    <div className="alert alert-danger" style={{ color: "red", textAlign: "center" }}>{error}
                    </div>
                )}
                <h3 className="title3">Update Application</h3>
                
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="job">Job *</label>
                        <select id="job_id" name="job_id" required value={formData.job_id} onChange={handleEditChange}>
                            <option value="">Select</option>
                            {job.length>0 ? (
                                job.map((j)=>(
                                    <option key={j.job_id} value={j.job_id}>{j.title}</option>
                                ))
                            ):(
                                <option disabled>No Job is Aviable</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="user">User *</label>
                        <select id="user_id" name="user_id" required value={formData.user_id} onChange={handleEditChange}>
                            <option value="">Select</option>
                            {user.length>0 ? (
                            user.map((u)=>(
                                    <option key={u.user_id} value={u.user_id}>{u.name}</option>
                                ))
                            ):(
                                <option disabled>No user is Aviable</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Cover Letter *</label>
                        <textarea id="coverLetter" name="coverLetter" required value={formData.cover_letter} onChange={handleEditChange} />
                    </div>

                  <div className="form-group">
    <label>Current CV</label>

    {formData.cv_url ? (
        <a
            href={`http://localhost:5000/uploads/${formData.cv_url}`}
            target="_blank"
            rel="noreferrer"
        >
            📄 View CV
        </a>
    ) : (
        <p>No CV uploaded</p>
    )}
</div>

                    <div className="form-group">
                        <label>Status *</label>
                        <select id="status" name="status" required value={formData.status} onChange={handleEditChange}>
                            <option value="">Select</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <br/>
                    <button type="submit" className="btn1" >Update Application</button>
                    <p><br/></p>
                </form>

            </div>
        </div>
    )
}
export default UpdateApplication;