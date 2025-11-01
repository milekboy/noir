"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NetworkInstance from "@/app/api/NetworkInstance";

// ✅ Persistent frontend session id
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

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [recent, setRecent] = useState<{ query: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

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

  // 🔍 Fetch suggestions on typing
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

  // 🕙 Fetch recent when input focused
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
    <div className="w-100 text-center d-lg-flex justify-content-center d-none ms-5 position-relative">
      <div className="position-relative w-50">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowRecent(false);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowRecent(false);
              setShowSuggestions(false);
            }, 150);
          }}
          onFocus={fetchRecent}
          className="rounded-end p-2 rounded-3 rounded-end-0 w-100 fs-6 border border-black px-3"
          placeholder="Search product, collections or code"
          style={{ fontSize: "14px!important", height: "50px" }}
        />

        <span
          onClick={handleSearch}
          className="rounded-start rounded-start-0 rounded-3 bg-black text-white px-4"
          style={{
            height: "50px",
            padding: "10px",
            cursor: "pointer",
            position: "absolute",
            right: "-55px",
            top: "0",
          }}
        >
          <i className="iconly-Light-Search" />
        </span>

        {showSuggestions && results.length > 0 && !showRecent && (
          <div
            className="rounded bg-white shadow position-absolute w-100 p-3"
            style={{ zIndex: 100 }}
          >
            {results.map((item) => (
              <Link
                key={item._id}
                href={`/collections/${null}/${item._id}`}
                className="d-flex align-items-center gap-2 py-2 border-bottom text-start"
              >
                <img
                  src={item.productImages?.[0]?.url}
                  alt={item.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
                <span style={{ fontSize: "13px" }}>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
        {showRecent && recent.length > 0 && !results.length && (
          <div
            className="rounded bg-white shadow position-absolute w-100 p-3"
            style={{ zIndex: 100 }}
          >
            <div className="fw-bold mb-2" style={{ fontSize: "13px" }}>
              Recent searches
            </div>

            {recent.map((item, idx) => (
              <div
                key={idx}
                className="py-2 border-bottom text-start"
                style={{ cursor: "pointer", fontSize: "13px" }}
                onClick={() => {
                  setQuery(item.query);
                  setShowRecent(false);
                  setShowSuggestions(true);
                }}
              >
                {item.query}
              </div>
            ))}
          </div>
        )}

        {showSuggestions && results.length === 0 && (
          <div
            className="rounded bg-white shadow position-absolute w-100 mt-2 p-3 text-center text-muted"
            style={{ zIndex: 100, fontSize: "14px" }}
          >
            No items match your search
          </div>
        )}
      </div>
    </div>
  );
}
