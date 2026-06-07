import React,{useState,useEffect} from "react";
import "./style/style.css";
import { useNavigate,useParams } from "react-router-dom";

const UpdateProfile=()=>{
    const{id}=useParams();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    const[user,setUser]=useState([]);

    const navigate=useNavigate("");
    
   const [formData,setFormData]=useState({user_id:"",skills:"",experience:"",education:"",resume_url:"", resume_file:null });

    useEffect(()=>{
        const fetchProfile=async()=>{
            try{
                const token=localStorage.getItem("token");
                const reuslt=await fetch(`http://localhost:5000/api/profile/${id}`,{
                    headers:{Authorization:`Bearer ${token}`},
                })
                const data=await reuslt.json();
                if(!reuslt.ok){
                    throw new Error(data.message||"faild to fetch profile data");
                }
                setFormData({
                    user_id:data.user_id,
                    skills:data.skills,
                    experience:data.experience,
                    education:data.education,
                    resume_url:data.resume_url,
                })
            }
            catch(err){
                console.error(err);
                setError(err.message);
            }
        }
        fetchProfile();
    },[id]);

    const handleEditChange=async(e)=>{
        const{name,value}=e.target;
        setFormData(prev=>({...prev,[name]:value}));
    }

   const handleUpdate=async(e)=>{
    e.preventDefault();

    try{
        const token=localStorage.getItem("token");
        const formDataToSend=new FormData();
        formDataToSend.append("user_id",formData.user_id);
        formDataToSend.append("skills",formData.skills);
        formDataToSend.append("experience",formData.experience);
        formDataToSend.append("education",formData.education);

        if (formData.resume_file) {
            formDataToSend.append("resume", formData.resume_file);
        }

        const result = await fetch(`http://localhost:5000/api/profile/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formDataToSend
        });

        const data = await result.json();
        if (!result.ok) throw new Error(data.message);

        alert("Profile updated successfully");
        navigate("/view-profile");

    } catch(err){
        setError(err.message);
    }
}
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
            } 
            catch (err) {
                console.error(err);
                setError(err.message);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);


   return(
        <div className="container">
            <div className="home">
                   {error && (
                    <div className="alert alert-danger" style={{ color: "red", textAlign: "center" }}>{error}
                    </div>
                )}
                <h3 className="title3">Add Profile</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="user">User *</label>
                       <select id="user_id" name="user_id" value={formData.user_id} onChange={handleEditChange}>
                        <option value="">Select</option>
                        {user.length>0 ? (
                            user.map((u)=>(
                                <option key={u.user_id} value={u.user_id}>{u.name}</option>
                            ))
                        ):(
                            <option>No user available</option>
                        )
                        }
                       </select>
                    </div>

                    <div className="form-group">
                        <label>Skill *</label>
                        <input type="text" name="skills" required placeholder="Enter..." value={formData.skills} onChange={handleEditChange} />
                    </div>

                    <div className="form-group">
                        <label>Experience *</label>
                        <input type="text" name="experience" required placeholder="Enter..." value={formData.experience} onChange={handleEditChange} />
                    </div>

                   
                    <div className="form-group">
                        <label>Education *</label>
                        <input type="text" name="education" required placeholder="Enter..." value={formData.education} onChange={handleEditChange} />
                    </div>
                    
                    <div className="form-group">
                        <label>Resume</label>
                        {formData.resume_url ? (
                            <a href={`http://localhost:5000/uploads/${formData.resume_url}`} target="_blank" rel="noreferrer" >📄 View CV</a>
                        ) : (
                             <p>No CV uploaded</p>
                             )}
                    </div>
                    <br/>
                    <button type="submit" className="btn1">Update Profile</button>
                    <p><br/></p>

                </form>

            </div>
        </div>
    )
}
export default UpdateProfile 