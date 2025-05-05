import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { searchContent } from "../services/api";
import { Guide, Post } from "../interfaces/interface";
import { Link } from "react-router-dom";

// Utility function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const Search: React.FC = () => {
  const [results, setResults] = useState<(Guide | Post)[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await searchContent(term);
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Guides & Posts</h1>
      <input
        type="text"
        placeholder="Search guides (title, description) or posts (title, content, tags)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {results.map((item) => (
          <li
            key={`${item.type}-${item.id}`}
            className="p-4 bg-white rounded-md shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600">
                  {truncateText(
                    item.type === "guide" ? item.description : item.content,
                    100,
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {item.type === "guide" ? "Guide" : "Post"}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link
                to={
                  item.type === "guide"
                    ? `/guides/${item.id}`
                    : `/posts/${item.id}`
                }
                className="text-blue-500 hover:underline"
              >
                View
              </Link>
            </div>
          </li>
        ))}
        {results.length === 0 && !loading && !error && searchTerm && (
          <p className="text-gray-500">No results found.</p>
        )}
      </ul>
    </div>
  );
};

export default Search;
