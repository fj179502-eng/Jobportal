import React,{useState,useEffect} from"react";
import "./style/style.css";
import { useNavigate,useParams } from "react-router-dom";
const UpdateSaveJob=()=>{
    const{id}=useParams();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    const[user,setUser]=useState([]);
    const[job,setJob]=useState([]);

    const navigate=useNavigate();
    const [formData,setFormData]=useState({user_id:"",job_id:""});

    useEffect(()=>{
        const fetchSaveJob=async()=>{
            try{
                const token=localStorage.getItem("token");
                const result=await fetch(`http://localhost:5000/api/savejob/${id}`,{
                    method:"GET",
                    headers:{Authorization:`Bearer ${token}`},
                })
                const data=await result.json();
                if(!result.ok){
                    throw new Error(data.message||"Faild to fetch save job");
                }
                setFormData({
                    user_id:data.user_id||"",
                    job_id:data.job_id||"",
                })
            }
            catch(err){
                console.error(err);
                setError(err.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchSaveJob();
    },[id]);

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
        
                useEffect(()=>{
                const fetchJob=async()=>{
                    try{
                        const token=localStorage.getItem("token");
                        const result=await fetch(`http://localhost:5000/api/job`,{
                            headers:{Authorization:`Bearer ${token}`}
                        })
                        const data=await result.json()
                        if(!result.ok){
                            throw new Error(data.message||"faild to fetch job");
                        }
                        if(Array.isArray(data)){
                            setJob(data);
                        }
                        else if(Array.isArray(data.data)){
                            setJob(data.data);
                        }
                        else{
                            setJob([])
                        }
                    }
                    catch(err){
                        console.error(err);
                        setError(err.message);
                    }
                    finally{
                        setLoading(false);
                    }
                }
                fetchJob();
            },[]);


    const handleEditChange=async(e)=>{
        const {name,value}=e.target;
        setFormData(prev=>({...prev,[name]:value}));
    }

    const handleUpdate=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            const token=localStorage.getItem("token");
            const result=await fetch(`http://localhost:5000/api/savejob/${id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
                body:JSON.stringify(formData)
            })
            const data=await result.json();
            if(!result.ok){
                throw new Error(data.message||"save job update faild");
            }
            alert("save job update successfully");
            navigate("/view-saveJob");
        }
        catch(err){
            console.error(err);
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    }
    


  return(
        <div className="container">
            <div className="home">
                  {error && (
                    <div className="alert alert-danger" style={{ color: "red", textAlign: "center" }}>{error}
                    </div>
                )}
                <h3 className="title3">Update Save Job </h3>

                <form onSubmit={handleUpdate}>
                      <div className="form-group">
                        <label htmlFor="user">User *</label>
                        <select id="userId" name="userId" required value={formData.user_id} onChange={handleEditChange}>
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
                        <label htmlFor="job">Job *</label>
                        <select id="jobId" name="jobId" required value={formData.job_id} onChange={handleEditChange}>
                            <option value="">Select</option>
                            {
                                job.length>0 ? (
                                    job.map((j)=>(
                                        <option key={j.job_id} value={j.job_id}>{j.title}</option>
                                    ))
                                ):(
                                    <option disabled>No Job available</option>
                                )
                            }
                        </select>
                    </div>
                    <br/>
                    <button type="submit" className="btn1" >Update Save Job</button>
                    <p><br/></p>

                </form>

               
            </div>
        </div>
    )
}
export default UpdateSaveJob;