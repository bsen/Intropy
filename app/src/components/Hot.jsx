import React, { useState, useEffect } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import ImageWithSkeleton from "../tools/ImageWithSkeleton";

const HotContent = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchHotContent = async (cursor = null, reset = false) => {
    if (loading || (!cursor && media.length > 0 && !reset)) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching hot content...");
      const response = await axios.get(
        `http://localhost:3000/api/hot${cursor ? `?cursor=${cursor}` : ""}`
      );
      if (!response.data.media || response.data.media.length === 0) {
        console.log("No content available");
        setError("No content available.");
      } else {
        setMedia((prevMedia) =>
          reset ? response.data.media : [...prevMedia, ...response.data.media]
        );
        setNextCursor(response.data.nextCursor);
      }
    } catch (err) {
      console.error("Error fetching hot content:", err);
      setError(`Failed to fetch hot content. Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotContent(null, true);
  }, []);

  useEffect(() => {
    if (inView && nextCursor) {
      fetchHotContent(nextCursor);
    }
  }, [inView, nextCursor]);

  const getCollectionLink = (item) => {
    if (item.collection && item.collection.slug) {
      return `/collection/${item.collection.slug}`;
    } else {
      console.warn("No suitable ID found for item:", item);
      return "#";
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      {media.length === 0 && !loading ? (
        <div className="text-center text-rose-500">No content available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {media.map((item) => (
            <Link
              key={item.id}
              to={getCollectionLink(item)}
              className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <ImageWithSkeleton
                src={item.previewUrl}
                alt="Media preview"
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                fallbackSrc="https://via.placeholder.com/400x400?text=Image+Not+Found"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center space-x-3">
                {item.collection && item.collection.imageUrl && (
                  <img
                    src={
                      item.collection.imageUrl
                        ? item.collection.imageUrl
                        : "/xs.png"
                    }
                    className="w-8 h-8 rounded-full object-cover border border-white bg-white"
                  />
                )}
                <span className="text-white text-md font-semibold truncate">
                  {item.collection
                    ? item.collection.title
                    : "Untitled Collection"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {loading && (
        <div className="text-center text-gray-400 text-xs font-thin mt-2">
          Loading more...
        </div>
      )}
      <div ref={ref} style={{ height: "10px" }}></div>
    </div>
  );
};

export default HotContent;
