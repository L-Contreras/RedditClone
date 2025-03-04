import './communities.css';

function Communities({ onCommunityClick }) {
    const subreddits = ['AskReddit', 'Cooking', 'confessions', 'GlobalOffensive', 'leagueoflegends', 'nosleep', 'pics'];
    return (
        <div className="communities-container">
            <h3>Communities</h3>
            {subreddits.map((subreddit) => 
            <div
                key={subreddit}
                className='communities-info'
                onClick={() => onCommunityClick(subreddit)}
            >
                <p>r/{subreddit}</p>
            </div>
            )}
        </div>
    );
};

export default Communities;