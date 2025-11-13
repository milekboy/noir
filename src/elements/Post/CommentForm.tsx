"use client";
import { useState } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";
import { toast } from "react-toastify";

export default function CommentForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || comment.trim() === "") {
      toast.warning("Please provide a rating and a comment", {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const network = NetworkInstance();
      await network.post(`/product/${productId}/rate`, {
        rating,
        comment,
      });

      toast.success(" Review submitted successfully!", {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 2000,
      });

      setComment("");
      setRating(0);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit review. Try again.", {
        theme: "dark",
        hideProgressBar: true,
        position: "bottom-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="comments_form" className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form-rating mb-3">
        <p className="mb-2">Your Rating:</p>
        <div className="d-flex gap-2 fs-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#facc15" : "#d1d5db",
                transition: "transform 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <p className="comment-form-comment mt-3">
        <textarea
          id="comments"
          placeholder="Type Comment Here"
          className="form-control4"
          name="comment"
          cols={45}
          rows={3}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </p>

      <p className="form-submit mt-3">
        <button
          id="submit"
          type="submit"
          disabled={loading}
          className="submit btn btn-secondary btnhover3 filled"
        >
          {loading ? "Submitting..." : "Submit Now"}
        </button>
      </p>
    </form>
  );
}
