// Copyright (c) Pascal Brand
// MIT License

function Search({searchTerm, setSearchTerm}) {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  }


  return (
      <input type="text" value={searchTerm} onChange={handleChange} />
  );
}

export default Search
