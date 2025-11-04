"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchCategorySlider from "./SearchCategorySlider";
import NetworkInstance from "@/app/api/NetworkInstance";
function getSessionId() {
  let sid = localStorage.getItem("x-session-id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("x-session-id", sid);
  }
  return sid;
}
type Product = {
  _id: string;
  name: string;
  price: number;
  productImages?: { url: string }[];
};

export default function HeadSearchBar() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<{ query: string }[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  const [results, setResults] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const networkInstance = NetworkInstance();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await networkInstance.post(
        `search/log`,
        { q: query, resultsCount: results.length },
        {
          withCredentials: true,
          headers: { "x-session-id": getSessionId() },
        }
      );
      console.log("✅ Search log response:", res?.data);
    } catch (err) {
      console.log("❌ Search log error:", err);
    }

    router.push(`/shop-search?query=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
    setShowRecent(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setResults([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await networkInstance.get(
          `product/search?q=${query}&page=1&limit=8`,
          {
            withCredentials: true,
            headers: { "x-session-id": getSessionId() }, // ✅ Important
          }
        );
        setResults(res?.data?.results || []);
        setShowSuggestions(true);
      } catch (err) {
        console.log(err);
      }
    };

    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchRecent = async () => {
    try {
      const res = await networkInstance.get(`search/recent?limit=5`, {
        withCredentials: true,
        headers: { "x-session-id": getSessionId() }, // ✅ Send same session ID
      });

      setRecent(res?.data?.items || []);
      setShowRecent(true);
      console.log("Recent:", res?.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container">
      {/* Inline CSS */}
      <style>{`
        .search-wrapper {
          position: relative;
          width: 100%;
        }

        .suggestion-box {
          position: absolute;
          top: 100%;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          background: #fff;
          border-radius: 6px;
          border: 1px solid #ddd;
          z-index: 2000;
          margin-top: 6px;
        }
.search-btn-inside {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.search-btn-inside i {
  font-size: 18px;
}
        .suggestion-box li:hover {
          background: #f8f9fa;
          cursor: pointer;
        }
      `}</style>

      <form className="header-item-search" onSubmit={(e) => e.preventDefault()}>
        {/* Search Input */}
        <div className="input-group">
          {/* <Categorydropdown /> */}

          <div className="search-wrapper position-relative">
            <input
              type="search"
              className="form-control pe-5" // add padding-right
              placeholder="Search Product"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowRecent(false);
              }}
              onFocus={() => {
                if (!query) {
                  fetchRecent();
                } else {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() =>
                setTimeout(() => {
                  setShowSuggestions(false);
                  setShowRecent(false);
                }, 150)
              }
            />

            {/* Search Icon inside input */}
            <button
              className="search-btn-inside"
              type="button"
              onClick={handleSearch}
            >
              <i className="iconly-Light-Search" />
            </button>
            {showRecent && !query && recent.length > 0 && (
              <ul className="suggestion-box list-group shadow-sm">
                <li className="list-group-item fw-semibold text-muted">
                  Your recent searches
                </li>

                {recent.map((item, i) => (
                  <li
                    key={i}
                    className="list-group-item"
                    onClick={() => {
                      setQuery(item.query);
                      router.push(
                        `/shop-search?query=${encodeURIComponent(item.query)}`
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {item.query}
                  </li>
                ))}
              </ul>
            )}

            {showSuggestions && !showRecent && results.length > 0 && (
              <ul className="suggestion-box list-group shadow-sm">
                {results.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex align-items-center"
                  >
                    <Link
                      href={`/collections/${null}/${item._id}`}
                      className="d-flex align-items-center text-dark w-100"
                    >
                      <img
                        src={item.productImages?.[0]?.url}
                        width="45"
                        height="45"
                        className="rounded me-2"
                        alt={item.name}
                      />
                      <div>
                        <div className="fw-semibold">{item.name}</div>
                        <small className="text-muted">
                          ₦{item.price?.toLocaleString()}
                        </small>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {showSuggestions && results.length === 0 && (
            <div
              className="rounded bg-white shadow position-absolute w-100  p-3 text-center text-muted"
              style={{ zIndex: 100, fontSize: "14px", marginTop: "60px" }}
            >
              No items match your search
            </div>
          )}
        </div>
      </form>

      {/* Bottom Slider */}
    </div>
  );
}
