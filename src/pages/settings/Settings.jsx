import "./settings.css";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [success, setSuccess] = useState(false);
  const [photoURL,setPhotoURL]=useState(null);

  const { user, dispatch } = useContext(Context);

  const uploadImage = async(base64EncodedImage)=>{
    try {
     await fetch( 'https://blogcreator-backend.herokuapp.com/api/upload',
         {
     
         method: 'POST',
         body: JSON.stringify({ data: base64EncodedImage }),
         headers: { 'Content-Type': 'application/json' },
     }).then((response) => { 
         response.json().then((data) => {
       setPhotoURL(data.photo)
           
       }).catch((err) => {
           console.log(err);
       }) 
  
     });
} catch (err) {
     console.error(err);
 }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
    const updatedUser = {
      userId: user._id,
      username,
      email,
      password,
      about
    };
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
          uploadImage(reader.result);
      };
   
     
    }
    updatedUser.profilePic = photoURL;
    try {
      const res = await axios.put("http://localhost:5000/api/users/" + user._id, updatedUser);
      setSuccess(true);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle">Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
           <label>About Me</label>
           <input
            type="text"
            placeholder={user.about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Profile has been updated...
            </span>
          )}
        </form>
      </div>
      <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">ABOUT AUTHOR</span>
        <img
       style={{width : "210px"}}
        src={user.profilePic}
          alt=""
        />
        <p>
         {user.about}
        </p>
      </div>
    </div>
    </div>
  );
}
