import axios from "axios";
import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { HashLink as Link } from 'react-router-hash-link';
import { Context } from "../../context/Context";
import "./topbar.css";

export default function TopBar() {
  const { user, dispatch } = useContext(Context);
  
  const [cats, setCats] = useState([]);

  useEffect(() => {
    let isMounted = true;   
    const getCats = async () => {
      const res = await axios.get("https://blogcreator-backend.herokuapp.com/api/categories");
      if(isMounted)
      setCats(res.data);
     
    };
    getCats();
    return () => { isMounted = false };
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <div className="top topmedia">
      <div className="topLeft">
      <div className="topListItem">
            <Link className="link" to="/">
              <b>HOME</b>
            </Link>
          </div>
      </div>
      <div className="topCenter">
      <ul className="topList">
          {cats.map((c) => (
            <Link to={`/?cat=${c.name}#posts`} className="link">
            <li className="topListItem">{(c.name).toUpperCase()}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="topRight">
        {user ? (
          <div data-tooltip="Settings">
          <Link to="/settings">
            <img className="topImg" src={user.profilePic} alt="" />
          </Link>
          </div>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">
                LOGIN
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">
                REGISTER
              </Link>
            </li>
          </ul>
        )}
        <div data-tooltip="Write a blog">
            <Link className="link" to="/write">
              {user && <img className="topbaricons" src="../writeIcon.png"/>}
            </Link>
          </div>
          <div data-tooltip="Logout" onClick={handleLogout}>
            {user && <img className="topbaricons" src="../logout.png"/>}
          </div>
      </div>
    </div>
  );
}
