import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ImageWithSkeleton from "../tools/ImageWithSkeleton";
import {
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineZoomIn,
} from "react-icons/hi";

const FullScreenModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative w-full h-full">
        <img
          src={imageUrl}
          alt="Full screen view"
          className="w-full h-full object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
          aria-label="Close full screen view"
        >
          <HiOutlineX size={24} />
        </button>
      </div>
    </div>
  );
};

const Media = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchMediaDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/media/${id}`
        );
        console.log("Media data ----?>?>>>>>", response.data);
        setMedia(response.data);
      } catch (err) {
        console.error("Error fetching media detail:", err);
        setError("Failed to fetch media detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetail();
  }, [id]);

  const handleScroll = (direction) => {
    const container = document.getElementById("additional-media-container");
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading media...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Media not found
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="relative">
          <ImageWithSkeleton
            src={media.mediaUrl}
            alt="Media"
            className="w-full h-[80vh] object-contain rounded-xl shadow-2xl"
            fallbackSrc="https://via.placeholder.com/800x600?text=Media+Not+Found"
          />
          <button
            onClick={() => setIsFullScreen(true)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            aria-label="View full screen"
          >
            <HiOutlineZoomIn size={20} />
          </button>
        </div>
        <div className="mt-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
          <HiOutlineEye className="mr-2" />
          <span>{media.views}</span>
        </div>
      </div>

      {media.additionalMedia && media.additionalMedia.length > 0 && (
        <div className="mt-4 relative">
          <h2 className="text-white text-xl mb-4">
            {media.collectionTitle
              ? `More from ${media.collectionTitle}`
              : "More from this collection"}
          </h2>
          <div className="relative">
            <button
              onClick={() => handleScroll("left")}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white rounded-full p-2 z-10"
              aria-label="Scroll left"
            >
              <HiOutlineChevronLeft size={24} />
            </button>
            <div
              id="additional-media-container"
              className="flex overflow-x-auto space-x-4 no-scrollbar"
              style={{ scrollBehavior: "smooth" }}
            >
              {media.additionalMedia.map((item) => (
                <Link
                  to={`/media/${item.id}`}
                  key={item.id}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <ImageWithSkeleton
                      src={item.previewUrl}
                      alt="Additional media"
                      className="w-56 h-56 object-cover rounded-lg hover:opacity-75 transition-opacity shadow-md"
                      fallbackSrc="https://via.placeholder.com/160x160?text=Preview"
                    />
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 text-white rounded-full p-2 z-10"
              aria-label="Scroll right"
            >
              <HiOutlineChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      <FullScreenModal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        imageUrl={media.mediaUrl}
      />
    </div>
  );
};

export default Media;
