import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../../config";

import {
  HiFire,
  HiCollection,
  HiSearch,
  HiMenu,
  HiChevronRight,
  HiLightningBolt,
} from "react-icons/hi";

function Layout({ children }) {
  const navigate = useNavigate();
  const [topModels, setTopModels] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchTopModels();
  }, []);

  const fetchTopModels = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/top-models`);
      console.log(response.data);
      setTopModels(response.data);
    } catch (error) {
      console.error("Error fetching top models:", error);
    }
  };

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-all duration-200 ${
        location.pathname === to
          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
          : "text-gray-600- hover:bg-dark-light hover:text-rose-500"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
      <HiChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </Link>
  );

  return (
    <div className="flex h-screen text-gray-600 bg-white">
      <style>{`
        :root {
          --color-dark: #121212;
          --color-dark-light: #1e1e1e;
          --color-primary: #e91e63;
          --color-primary-light: #f48fb1;
        }
      `}</style>
      <div
        className={`${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out lg:flex lg:flex-col w-60 shadow-xl`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center justify-center py-4">
              <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">
                Xnudes
              </h1>
              <p className="text-xs font-light text-gray-600 mt-1/2">
                Explore the heat
              </p>
            </div>
            <nav className="px-4 space-y-3 mt-2">
              <NavLink to="/hot" icon={HiFire}>
                Hot
              </NavLink>
              <NavLink to="/collections" icon={HiCollection}>
                Collections
              </NavLink>
              <NavLink to="/ai" icon={HiLightningBolt}>
                AI Images
              </NavLink>
              <NavLink to="/search" icon={HiSearch}>
                Search
              </NavLink>
            </nav>
            <div className="mt-4 px-4">
              <h2 className="text-lg font-medium pb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600 border-b border-gray-200 text-center">
                Top Models
              </h2>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto px-4 pt-4 pb-8 no-scrollbar">
            <ul className="space-y-2">
              {topModels.map((model) => (
                <li key={model.id}>
                  <button
                    onClick={() =>
                      navigate(`/collection/${model.slug}`, { replace: true })
                    }
                    className="w-full flex items-center space-x-3 text-gray-600 hover:text-white transition-colors duration-200 group"
                  >
                    <div className="relative">
                      <img
                        src={model.imageUrl || "/api/placeholder/40/40"}
                        alt={model.title}
                        className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-rose-500 transition-colors duration-200"
                      />
                    </div>
                    <span className="group-hover:text-rose-500 transition-colors duration-200">
                      {model.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 lg:hidden flex items-center px-6">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-600- focus:outline-none focus:text-white"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gdark">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
