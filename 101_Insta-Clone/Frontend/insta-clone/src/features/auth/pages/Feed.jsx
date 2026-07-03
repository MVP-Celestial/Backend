import React, { useEffect } from "react";
import "../../posts/style/feed.scss"
import Post from "../../posts/components/Post.jsx"
import {usePost} from '../../posts/hook/usePost.js'
const Feed = () => {

  const {loading, feed, handleGetFeed} = usePost()
  useEffect(()=> {
    handleGetFeed()
  }, [])

  if(loading || !feed) {
    return(<h1>Feed is Loading</h1>)
  }

  console.log(feed);
  return (
    <main className="feed-page">
      <div className="feed">
        <div className="posts">
          {feed?.map((item) => (
            <Post key={item._id} user={item.user} post={item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;
