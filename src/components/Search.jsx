// Copyright (c) Pascal Brand
// MIT License

// https://react-icons.github.io/react-icons/
import { FaMagnifyingGlass } from "react-icons/fa6";

function Search({searchTerm, setSearchTerm}) {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  }


  return (
    <div className="search-bar">
        <FaMagnifyingGlass className="search-bar__icon" />
        <input className="search-bar__input" type="text" value={searchTerm} onChange={handleChange} />
    </div>
  );
}

export default Search
