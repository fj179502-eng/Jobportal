import React,{useState,useEffect} from "react";
import "./style/style.css";
import { useNavigate,useParams } from "react-router-dom";
const UpdateCategory=()=>{
    const {id}=useParams();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    const navigate=useNavigate();
    const[formData,setFormData]=useState({name:""});

    useEffect(()=>{
        const fetchCategory=async()=>{
            try{
                const token=localStorage.getItem("token");
                const result=await fetch(`http://localhost:5000/api/category/${id}`,{
                    method:"GET",
                    headers:{Authorization:`Bearer ${token}`}
                })
                const data=await result.json();
                if(!result.ok){
                    throw new Error(data.message||"Faild to fetch category");
                }
                setFormData({
                    name:data.name||"",
                })
            }
            catch(err){
                console.eror(err);
                setError(err.message);
            }
        }
        fetchCategory();
    },[id]);
    

    const handleEditChange=async(e)=>{
        const{name,value}=e.target;
        setFormData(prev=>({...prev,[name]:value}));
    }

    const handleUpdate=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError(false);
        try{
        const token=localStorage.getItem("token");
        const result=await fetch(`http://localhost:5000/api/category/${id}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
            body:JSON.stringify(formData)
        })
        const data=await result.json();
        if(!result.ok){
            throw new Error(data.message||"category update faild");
        } 
        alert("Category update successfully");
        navigate("/view-category");
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
                <h3 className="title3">Update Category</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="name" >Name *</label>
                        <input type="text" name="name" required placeholder="Enter..." value={formData.name} onChange={handleEditChange} />
                    </div>
                    <br/>
                    <button type="submit" className="btn1">Update Category</button>
                    <p><br/></p>
                </form>
            </div>
        </div>
    )
}
export default UpdateCategory;