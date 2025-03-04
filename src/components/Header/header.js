import Search from '../Searchbar/search';
import './header.css';

function Header({ onSearch }) {
    return (
        <div className="header">
            <p className="logo">NoCreddit</p>
            <Search className="searchBar" onSearch={onSearch} />
        </div>
    )
}

export default Header;