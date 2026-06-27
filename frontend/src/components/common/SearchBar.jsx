import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchData();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const searchData = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await axios.get(
        `http://127.0.0.1:8000/api/search/?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(res.data);
      setShowDropdown(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full max-w-md">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search products, customers..."
        className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Results */}

      {showDropdown && results.length > 0 && (

        <div className="absolute mt-2 w-full rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden z-50">

          {results.map((item) => (

            <button
              key={item.id}
              className="w-full text-left px-4 py-3 hover:bg-slate-100 transition"
            >
              <p className="font-medium text-slate-800">

                {item.name}

              </p>

              <p className="text-xs text-slate-500">

                {item.type}

              </p>
            </button>

          ))}

        </div>

      )}

    </div>
  );
}