import { useContext, useEffect, useState } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import Spinner from 'react-spinner-material';

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [categories, setCat] = useState("Lifestyle");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  const[showLoader,setShowLoader]=useState(false);
 const newPost = {
  username: user.username,
  title,
  desc,
  categories
};
    
  const uploadImage = async(base64EncodedImage)=>{
   
    try{
      const res = await axios.post(`https://blogcreator-backend.herokuapp.com/api/upload`,{
        data: base64EncodedImage
      })
      console.log("data.photo",res.data.photo)
     
      newPost.photo = res.data.photo; 
       try {
      const res = await axios.post("https://blogcreator-backend.herokuapp.com/api/posts", newPost);
      window.location.replace("/post/" + res.data._id);
      setShowLoader(false)
    } catch (err) {
      console.log(err);
    }
    }catch(err){
console.log(err)
    }

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true)
   
    if (file) {
      const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
    }

  
   
  };
  return (
    <div className="write">
       
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={e=>setTitle(e.target.value)}
          />
        </div>
        {showLoader? <div style={{width:"15%",margin:"auto",top:"100px",padding:"50px"}}>
        <Spinner radius={80} color={"#DFC0BB"} stroke={5} visible={true} />
      </div> : <div></div>}
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={e=>setDesc(e.target.value)}
          ></textarea>
        </div>
        <select className="categories dropdown-menu"
        value={categories.selectValue} 
        onChange={e=>setCat(e.target.value)}
        style={{display:"block"}}
         
      >
       <option value="Lifestyle">Lifestyle</option>
        <option class="dropdown-item" value="Food">Food</option>
        <option class="dropdown-item" value="Music">Music</option>
        <option class="dropdown-item" value="Tech">Tech</option>
        <option class="dropdown-item" value="Fashion">Fashion</option>
        <option class="dropdown-item" value="Travel">Travel</option>
      </select>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
     
    </div>
  );
}
