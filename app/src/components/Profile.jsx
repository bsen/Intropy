import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import ImageWithSkeleton from "../tools/ImageWithSkeleton";
import { HiOutlineEye, HiOutlinePhotograph } from "react-icons/hi";
import short from "short-uuid";
import { backend_url } from "../../config";

const Profile = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const translator = short();

  useEffect(() => {
    fetchCollectionProfile();
    setMedia([]);
    setNextCursor(null);
    fetchCollectionMedia(null, true);
  }, [slug]);

  useEffect(() => {
    if (inView) {
      fetchCollectionMedia(nextCursor);
    }
  }, [inView]);

  const fetchCollectionProfile = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/api/collection/${slug}/profile`
      );
      setCollection(response.data);
    } catch (err) {
      console.error("Error fetching collection profile:", err);
      setError("Failed to fetch collection profile.");
    }
  };

  const fetchCollectionMedia = async (cursor = null, reset = false) => {
    if (loading || (!cursor && media.length > 0 && !reset)) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backend_url}/api/collection/${slug}/media${
          cursor ? `?cursor=${cursor}` : ""
        }`
      );
      if (!response.data.media || response.data.media.length === 0) {
        setError("No media available.");
      } else {
        setMedia((prevMedia) =>
          reset ? response.data.media : [...prevMedia, ...response.data.media]
        );
        setNextCursor(response.data.nextCursor);
      }
    } catch (err) {
      console.error("Error fetching collection media:", err);
      setError("Failed to fetch collection media.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      {collection ? (
        <div className="mb-4 p-8">
          <div className="flex flex-col gap-6 md:flex-row items-center">
            <img
              src={collection.imageUrl ? collection.imageUrl : "/xl.png"}
              className="w-44 h-44 border-4 border-red-500 object-cover rounded-full shadow-md  z-10 bg-white"
              fallbackSrc="https://via.placeholder.com/224x224?text=Collection+Image"
            />

            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">
                {collection.title}
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {collection.description}
              </p>
              <div className="flex justify-start text-sm text-gray-600 space-x-6">
                <span className="flex items-center bg-gray-200 rounded-full px-4 py-2">
                  <HiOutlineEye className="mr-2 text-rose-500" size={18} />
                  {(collection.views || 0).toLocaleString()} views
                </span>
                <span className="flex items-center bg-gray-200 rounded-full px-4 py-2">
                  <HiOutlinePhotograph
                    className="mr-2 text-rose-500"
                    size={18}
                  />
                  {collection.totalItems || 0} items
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white">Loading collection...</div>
      )}

      {media.length === 0 && !loading ? (
        <div className="text-center text-white">No media available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {media.map((item) => (
            <Link to={`/media/${translator.fromUUID(item.id)}`} key={item.id}>
              <div
                key={item.id}
                className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
              >
                <ImageWithSkeleton
                  src={item.previewUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackSrc="https://via.placeholder.com/400x400?text=Image+Not+Found"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
      {loading && (
        <div className="text-center text-gray-400 text-xs font-thin mt-2">
          Loading...
        </div>
      )}
      <div ref={ref} style={{ height: "10px" }}></div>
    </div>
  );
};

export default Profile;
