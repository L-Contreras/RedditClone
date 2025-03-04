import './results.css';
import { useState, useEffect } from 'react';


function PostList({ posts, selectedSubreddit }) {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentsVisibility, setCommentsVisibility] = useState({});

    useEffect(() => {
        async function fetchPosts() {
            try {
                const url = selectedSubreddit
                ? `https://www.reddit.com/r/${selectedSubreddit}.json`
                : 'https://www.reddit.com/r/popular.json';

                const response = await fetch(url);
                const data = await response.json();

                //const response = await fetch('https://www.reddit.com/r/popular.json');
                //const data = await response.json();

                const fetchedPosts = data.data.children.map((item) => {
                    const postData = item.data;

                    const image = postData.preview?.images?.[0]?.source?.url 
                        ? decodeURIComponent(postData.preview.images[0].source.url.replace(/&amp;/g, "&")) 
                        : (postData.thumbnail && !["self", "default"].includes(postData.thumbnail) 
                            ? postData.thumbnail
                            : null);


                    return {
                        title: postData.title,
                        url: `https://www.reddit.com${postData.permalink}`,
                        ups: postData.ups || 0,
                        subreddit: postData.subreddit,
                        image: image,
                        permalink: postData.permalink,
                        id: postData.id
                    };

                });
                
                setTrendingPosts(fetchedPosts);
            } catch(error) {
                console.log('Error fetching trending posts: ', error);
            }
        }
            fetchPosts();
    }, [selectedSubreddit]);

    async function fetchComments(permalink) {
        setLoadingComments(true);
        try {
            const response = await fetch(`https://www.reddit.com${permalink}.json`);
            const data = await response.json();

            const fetchedComments = data[1].data.children.map(comment => ({
                id: comment.data.id,
                author: comment.data.author,
                body: comment.data.body,
                ups: comment.data.ups
            }));
            
            setComments(fetchedComments);
        } catch(error) {
            console.log('Error fetching comments: ', error);
        }
        setLoadingComments(false);
    }

    function handlePostClick(post){
        if (selectedPost?.id === post.id) {
            setSelectedPost(null);
            setComments([]);
            setCommentsVisibility((prevVisibility) => ({
                ...prevVisibility, [post.id]: false
            }));
        } else {
            setSelectedPost(post);
            fetchComments(post.permalink);
            setCommentsVisibility((prevVisibility) => ({
                ...prevVisibility,
                [post.id]: true
            }));
        }
    }


    const postsToShow = posts.length > 0 ? posts : trendingPosts;

    return (
        <div>
            <div className="subredditheader">
                <h1>{postsToShow.length > 0 ? `r/${postsToShow[0].subreddit}` : 'Trending Posts'}</h1>
            </div>
            {postsToShow.map((post, index) => (
                <div className="postcontainer" key={index}>
                    <div className="postinfo">
                        <h3>
                            <a href={post.url} target="_blank" rel="noopener noreferrer">
                                {post.title}
                            </a>
                        </h3>
                        <p>↑ {post.ups} ↓ {post.downs}</p>
                        <p>Subreddit: {post.subreddit}</p>
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                            />
                        )}

                        <h4 onClick={() => handlePostClick(post)}>
                            {commentsVisibility[post.id] ? 'Hide Comments' : 'Show Comments'}
                        </h4>
                    </div>
                    {selectedPost?.id === post.id && (
                        <div>
                            <h4>Comments</h4>
                            {loadingComments ? (
                                <div className="loading-spinner">Loading comments...</div>
                            ) : (
                                <>
                                {comments.length > 0 ? (
                                    comments.map(comment => (
                                        <div key={comment.id} className="comment">
                                            <p><strong>{comment.author}</strong> {comment.body}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}
                               </> 
                            )}
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
}

export default PostList;
