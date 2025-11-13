"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CommentForm from "./CommentForm";

interface CommentType {
  id: number;
  image: string;
  name: string;
  content: string;
  replies?: CommentType[];
}

const CommentBlog: React.FC<CommentType> = ({
  image,
  name,
  content,
  replies,
}) => {
  return (
    <div className="comment-body">
      <div className="comment-author vcard">
        <Image
          src={image}
          alt={name}
          width={50}
          height={50}
          className="avatar rounded-full"
        />
        <cite className="fn ml-2">{name}</cite>
      </div>

      <div className="comment-content dz-page-text mt-2">
        <p>{content}</p>
      </div>

      <div className="reply">
        <Link href={"#"} rel="nofollow" className="comment-reply-link">
          Reply
        </Link>
      </div>

      {replies && replies.length > 0 && (
        <ol className="children ml-8">
          {replies.map((reply) => (
            <li key={reply.id} className="comment">
              <CommentBlog {...reply} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default function Comments({ productId }: { productId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Replace with your real API endpoint
        const res = await fetch("https://your-api.com/comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="post-comments comments-area style-1 clearfix">
      <div className="default-form comment-respond style-1 mt-6" id="respond">
        <h4 className="comment-reply-title mb-2" id="reply-title">
          Share Your Review
        </h4>
        <p className="dz-title-text">
          Share your thoughts and feedback to help us improve.
        </p>
        <div className="clearfix">
          <CommentForm productId={productId} />
        </div>
      </div>
    </div>
  );
}
