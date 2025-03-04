import './App.css';
import Header from './components/Header/header';
import { useState } from 'react';
import PostList from './components/PostList/results';
import Communities from './components/communities/communities';

function App() {
  const[posts, setPosts] = useState([]);
  const [selectedSubreddit, setSelectedSubreddit] = useState('');

  const handleSearch = (results) => {
    console.log('Posts from search', results);
    setPosts(results);
  }

  const handleCommunityClick = (subreddit) => {
    setSelectedSubreddit(subreddit);
    setPosts([]);
  }

  return (
    <div className="App">
      <Header onSearch={handleSearch}/>
      <section className="mainpage-layout">
        <PostList posts={posts} selectedSubreddit={selectedSubreddit}/>
        <Communities onCommunityClick={handleCommunityClick}/>
      </section>

    </div>
  );
}

export default App;
