import React, { useRef, useState } from "react";
import "../../shared/post.scss";
import { usePost } from "../hook/usePost";
import { useNavigate } from "react-router";


const CreatePost = () => {

  const [caption, setCaption] = useState("")

  const postImageInputFieldRef = useRef(null)
  const navigate = useNavigate()

  const {loading, handleCreatePost} = usePost()

  async function handleSubmit(e){
    e.preventDefault();
    const file = postImageInputFieldRef.current.files[0]

    await handleCreatePost(file, caption)
    navigate("/")

  }

  if(loading) {
    return(
      <main>
        <h1>creating post</h1>
      </main>
    )
  }

  return (
    <div className="post-layout">
      <div className="post-page">
        <h1>Create Your Post</h1>
        <form onSubmit={handleSubmit}>

          <label id="label" htmlFor="postImage">Select Image +</label>
          <div className="file-container">
            <input
            ref={postImageInputFieldRef}
            hidden
              type="file"
              name="postImage"
              id="postImage"
            />
          </div>

          <input
            value={caption}
            onChange={(e)=>{setCaption(e.target.value)}}
            type="text"
            name="caption"
            id="caption"
            placeholder="Write a caption..."
          />

          <button type="submit" className="post-create">
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;