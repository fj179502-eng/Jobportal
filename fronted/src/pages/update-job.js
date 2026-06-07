import React,{useState,useEffect} from "react";
import "./style/style.css";
import { useNavigate,useParams } from "react-router-dom";
const UpdateJob=()=>{
    const{id}=useParams();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    const[company,setCompany]=useState([]);
    const navigate=useNavigate();

    const[formData,setFormData]=useState({company_id:"",title:"",description:"",salary:"",location:"",job_type:"",category:""});

    useEffect(()=>{
        const fetchJob=async()=>{
            try{
                const token=localStorage.getItem("token");
                const result=await fetch(`http://localhost:5000/api/job/${id}`,{
                    method:"GET",
                    headers:{Authorization:`Bearer ${token}`}
                })
                const data=await result.json();
                if(!result.ok){
                    throw new Error(data.message||"Faild to fetch job data");
                }
                setFormData({
                    company_id:data.company_id||"",
                    title:data.title||"",
                    description:data.description||"",
                    salary:data.salary||"",
                    location:data.location||"",
                    job_type:data.job_type||"",
                    category:data.category||"",
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
        fetchJob();
    },[id]);

    const handleEditChange=async(e)=>{
        const{name,value}=e.target;
        setFormData(prev=>({...prev,[name]:value}));
    }
    const updateHandle=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            const token=localStorage.getItem("token");
            const result=await fetch(`http://localhost:5000/api/job/${id}`,{
                method:"PUT",
                headers:{"Content-Type" :"application/json",Authorization:`Bearer ${token}`},
                body:JSON.stringify(formData),
            })
            const data=await result.json();
            if(!result.ok){
                throw new Error(data.message||"job update faild");
            }
            alert("Job update successfully");
            navigate("/view-job");
        }
        catch(err){
            console.error(err);
            setError(err.message);
        }
    }


     useEffect(() => {
               const fetchCompnay = async () => {
                   try {
                       const token = localStorage.getItem("token");
                       const result = await fetch(`http://localhost:5000/api/company`, {
                           headers: { Authorization: `Bearer ${token}` },
                       });
                       const data = await result.json();
                       console.log("company:", data);
       
                       if (!result.ok) {
                           throw new Error(data.message || "Failed to fetch company");
                       }
       
                       if(Array.isArray(data)){
                           setCompany(data);
                       }
                       else if(Array.isArray(data.data)){
                           setCompany(data.data);
                       }
                       else{
                           setCompany([]);
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
       
               fetchCompnay();
           }, []);
   
       return (
           <div className="container">
               <div className="home">
                     {error && (
                       <div className="alert alert-danger" style={{ color: "red", textAlign: "center" }}>{error}
                       </div>
                   )}
                   <h3 className="title3">Update Job</h3>
                   <form onSubmit={updateHandle}>
                       <div className="form-group">
                           <label htmlFor="company">Company *</label>
                           <select id="compnayId" name="companyId" required value={formData.company_id} onChange={handleEditChange}>
                               <option value="">Select</option>
                               {
                                   company.length>0 ? (
                                       company.map((c)=>(
                                           <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                                       ))
                                   ):(
                                       <option disabled>Company not found</option>
                                   )
                               }
                           </select>
                       </div>
                       <div className="form-group">
                           <label htmlFor="title" >Title *</label>
                           <input typ="text" name="title" required placeholder="Enter..." value={formData.title} onChange={handleEditChange}/>
                       </div>
   
                       <div className="form-group">
                           <label htmlFor="description" >Description *</label>
                           <textarea name="description" required placeholder="Enter..." value={formData.description} onChange={handleEditChange}></textarea>
                       </div>
   
                        <div className="form-group">
                           <label htmlFor="salary" >Salary *</label>
                           <input typ="text" name="salary" required placeholder="Enter..." value={formData.salary} onChange={handleEditChange}/>
                       </div>
   
                        <div className="form-group">
                           <label htmlFor="title" >Location *</label>
                           <input typ="text" name="location" required placeholder="Enter..." value={formData.location} onChange={handleEditChange}/>
                       </div>
   
                        <div className="form-group">
                           <label htmlFor="title" >Job Type *</label>
                           <select id="jobType" name="jobType" required value={formData.job_type} onChange={handleEditChange} >
                               <option value="">Select</option>
                               <option value="remote">Remote</option>
                               <option value="onsite">OnSite</option>
                               <option value="hybrid">Hybrid</option>
                           </select>
                       </div>
   
                        <div className="form-group">
                           <label htmlFor="category" >Category *</label>
                           <input typ="text" name="category" required placeholder="Enter..." value={formData.category} onChange={handleEditChange}/>
                       </div>
                       <br/>
                       <button type="submit" className="btn1">Update Job</button>
                       <p><br/></p>
                   </form>
               </div>
            </div>
       )
}
export default UpdateJob