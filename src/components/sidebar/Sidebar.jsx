import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { Context } from "../../context/Context";
export default function Sidebar() {
  const {user} = useContext(Context);
  const PF = "http://localhost:5000/images/"


  return (
    <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">ABOUT AUTHOR</span>
        <img
       style={{width : "210px"}}
        src={PF+user.profilePic}
          alt=""
        />
        <p>
         {user.about}
        </p>
      </div>
    </div>
  );
}
