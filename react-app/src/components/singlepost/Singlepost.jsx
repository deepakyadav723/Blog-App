import { useLocation } from "react-router-dom"
import "./singlepost.css"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";


export default function Singlepost() {
  const location = useLocation()
  const path = location.pathname.split("/")[2]; //Id of post on which we click

  const [post, setPost] = useState([]);
  useEffect(()=>{
    const getPost = async ()=>{
      const res =  await axios.get("/posts/"+path);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    }
    getPost();
  }, [path])

  const PF = "http://localhost:5000/images/";
  const {user} = useContext(Context);

  const handleDelete = async ()=>{
    try {
      await axios.delete(`/posts/${post._id}`, {data: {username: user.username}});
      window.location.replace("/");
    } catch (error) {}
  }


  //for editing post
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const handleUpdate = async ()=>{
    try {
      await axios.put(`/posts/${post._id}`, {username: user.username, title, desc});
      setUpdateMode(false);
    } catch (error) {}
  }

  return (
    <div className="singlepost">
      <div className="singlePostWrapper">

        {post.photo && (
          <img src={PF + post.photo} alt="" className="singlePostImg" />
        )}
        {
          updateMode ? <input type="text" value={title} className="singlePostTitleInput" onChange={(e)=>setTitle(e.target.value)} autoFocus/> :
          <h1 className="singlePostTitle">
              {title}
              {post.username === user?.username && (
                <div className="singlePostEdit">
                    <i className="singlePostIcon far fa-edit" onClick={()=>setUpdateMode(true)}></i>
                    <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
                </div>
              )}
          </h1>
        }
        <div className="singlePostInfo">
            <span className="singlePostAuthor">Author:
              <Link className="link" to={`/?user=${post.username}`}><b>{post.username}</b></Link>
            </span>
            <span className="singlePostDate">{new Date(post.createdAt).toDateString()}</span>
        </div>
        {
          updateMode ? <textarea value={desc} className="singlePostDescInput" onChange={(e)=>setDesc(e.target.value)}/> :
          <p className="singlePostDesc">
            {desc}
          </p>
        }
        {
          updateMode && 
          <button className="singlePostButton" onClick={handleUpdate}>Update</button>
        }
      </div>
    </div>
  )
}
