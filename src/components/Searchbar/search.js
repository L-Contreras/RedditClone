import { useState } from 'react';
import './search.css';

function Search({ onSearch }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (query.trim() === '') return;

        setLoading(true);

        try {
            const res = await fetch(`https://www.reddit.com/r/${query}/best.json`);
            const data = await res.json();
            console.log('API response data:', data);
            const posts = data.data.children.map((child) => {
                const postData = child.data;

                const image = postData.preview?.images?.[0]?.source?.url 
                        ? decodeURIComponent(postData.preview.images[0].source.url.replace(/&amp;/g, "&")) 
                        : (postData.thumbnail && !["self", "default"].includes(postData.thumbnail) 
                            ? postData.thumbnail
                            : null);

                /* returns reddit post data*/
                return {
                    title: postData.title,
                    url: `https://www.reddit.com${postData.permalink}`,
                    subreddit: postData.subreddit,
                    image: image,
                    ups: postData.ups,
                    id: postData.id,
                    permalink: postData.permalink
                };
            });

            onSearch(posts);
        } catch(err) {
            console.error('API Error: ', err);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
            className="searchbar" 
            type="text"
            placeholder='Search communities'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
            <button className="searchbutton" type="submit" disabled={loading}>Search</button>
        </form>
    );
}

export default Search;