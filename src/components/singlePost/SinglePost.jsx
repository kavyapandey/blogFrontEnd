import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./singlePost.css";

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [display,setDisplay] = useState(false)
  const [authorpic,setAuthorPic] = useState("");
  const [authorAbout, setAuthorAbout] = useState("");
  const [desc, setDesc] = useState("");
 
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get("https://blogcreator-backend.herokuapp.com/api/posts/" + path);
    
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      getAuthor(res.data.username);
    };
    getPost();
  }, [path]);
  const getAuthor = async(name) =>{
      const res = await axios.get(`https://blogcreator-backend.herokuapp.com/api/users/`,{ params: { username: name } });
      setAuthorAbout(res.data[0].about)
       setAuthorPic(res.data[0].profilePic)
       setDisplay(true)
    } 
  
  const handleDelete = async () => {
    try {
      await axios.delete(`https://blogcreator-backend.herokuapp.com/api/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {}
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://blogcreator-backend.herokuapp.com/api/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
      });
      setUpdateMode(false)
    } catch (err) {}
  };

  return (
    <>
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.username}`} className="link">
              <b> {post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      
      </div>
    
    </div>
      <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">ABOUT AUTHOR</span>
        <img
       style={{width : "210px"}}
        src={display && authorpic}
          alt=""
        />
        {display &&  <p>
         {authorAbout}
        </p> }
       
      </div>
    </div>
    </>
  );
}
