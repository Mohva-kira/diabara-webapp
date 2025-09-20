import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Searchbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  const hanldleInput = (e) => {
    setSearchTerm(e.target.value);
  };

  

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="px-2 w-full text-gray-400 focus-within:text-gray-600">
      <label htmlFor="search-field" className="sr-only">
        Search all longs
      </label>
      <div className="flex w-full flex-row justify-start items-center">
        <FiSearch className="w-5 h-5 ml-4 shadow-orange-300 shadow-sm rounded-lg" />
        <input
          name="search-field"
          autoComplete="off"
          id="search-field"
          placeholder="Recherche"
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="flex-1 ml-2 shadow-sm rounded-xl shadow-orange-300 w-full bg-transparent border-none outline-none placeholder-gray-500 text-base text-white p-4"
        />
      </div>
    </form>
  );
};

export default Searchbar;
