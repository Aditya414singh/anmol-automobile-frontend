import { useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { language, toggleLanguage, t } = useLanguage();

  const {
    isAuthenticated,
    isManager,
    logout,
  } = useAuth();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ============================= */}
        {/* LOGO */}
        {/* ============================= */}

        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center"
        >
          <img
            src={logo}
            alt="Anmol Automobiles"
            className="h-14 w-auto object-contain sm:h-16"
          />

          <div className="ml-3">
            <h1 className="text-lg font-bold leading-none text-[#123C35]">
              ANMOL
            </h1>

            <p className="mt-1 text-[9px] font-medium tracking-[0.25em] text-gray-500">
              AUTOMOBILES
            </p>
          </div>
        </Link>

        {/* ============================= */}
        {/* DESKTOP NAVIGATION */}
        {/* ============================= */}

        <nav className="hidden items-center gap-7 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-[#123C35] transition hover:text-[#0F8B6D]"
          >
            {t.navbar.home}
          </Link>

          <Link
            to="/vehicles"
            className="text-sm font-medium text-gray-600 transition hover:text-[#0F8B6D]"
          >
            {t.navbar.vehicles}
          </Link>

          <Link
            to="/vehicles"
            className="text-sm font-medium text-gray-600 transition hover:text-[#0F8B6D]"
          >
            {t.navbar.models}
          </Link>

          <a
            href="/#about"
            className="text-sm font-medium text-gray-600 transition hover:text-[#0F8B6D]"
          >
            {t.navbar.about}
          </a>

          <a
            href="/#contact"
            className="text-sm font-medium text-gray-600 transition hover:text-[#0F8B6D]"
          >
            {t.navbar.contact}
          </a>

          {/* Manager */}
          {isManager && (
            <Link
              to="/manager/dashboard"
              className="text-sm font-semibold text-[#0F5C4D] transition hover:text-[#0B493D]"
            >
              Manager
            </Link>
          )}

        </nav>

        {/* ============================= */}
        {/* DESKTOP ACTIONS */}
        {/* ============================= */}

        <div className="hidden items-center gap-3 md:flex">

          {/* Language */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-[#123C35] transition hover:border-[#0F5C4D] hover:bg-[#F2F8F5]"
            aria-label="Change language"
          >
            {language === "en" ? "हिन्दी" : "English"}
          </button>

          {/* ============================= */}
          {/* LOGGED OUT */}
          {/* ============================= */}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[#0F5C4D] px-5 py-2.5 text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#0F5C4D] hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-[#0F5C4D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B493D] hover:shadow-md"
              >
                {t.navbar.quote}
              </Link>
            </>
          )}

          {/* ============================= */}
          {/* LOGGED IN */}
          {/* ============================= */}

          {isAuthenticated && (
            <>
              {isManager ? (
                <Link
                  to="/manager/dashboard"
                  className="rounded-full bg-[#0F5C4D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B493D]"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/account"
                  className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-[#123C35] transition hover:border-[#0F5C4D] hover:bg-[#F2F8F5]"
                >
                  Account
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </>
          )}

        </div>

        {/* ============================= */}
        {/* MOBILE ACTIONS */}
        {/* ============================= */}

        <div className="flex items-center gap-2 md:hidden">

          {/* Language */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-[#123C35]"
            aria-label="Change language"
          >
            {language === "en" ? "हिन्दी" : "EN"}
          </button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(
                (previous) => !previous
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#123C35] hover:bg-gray-100"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* ============================= */}
      {/* MOBILE MENU */}
      {/* ============================= */}

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">

          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">

            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-[#123C35] hover:bg-gray-50"
            >
              {t.navbar.home}
            </Link>

            <Link
              to="/vehicles"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t.navbar.vehicles}
            </Link>

            <Link
              to="/vehicles"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t.navbar.models}
            </Link>

            <a
              href="/#about"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t.navbar.about}
            </a>

            <a
              href="/#contact"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t.navbar.contact}
            </a>

            {/* Manager */}
            {isManager && (
              <Link
                to="/manager/dashboard"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-[#0F5C4D] hover:bg-[#F2F8F5]"
              >
                Manager Dashboard
              </Link>
            )}

            {/* ============================= */}
            {/* MOBILE LOGGED OUT */}
            {/* ============================= */}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="mt-2 rounded-full border border-[#0F5C4D] px-5 py-3 text-center text-sm font-semibold text-[#0F5C4D]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mt-2 rounded-full bg-[#0F5C4D] px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  {t.navbar.quote}
                </Link>
              </>
            )}

            {/* ============================= */}
            {/* MOBILE LOGGED IN */}
            {/* ============================= */}

            {isAuthenticated && (
              <>
                {!isManager && (
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="mt-2 rounded-lg px-4 py-3 text-sm font-medium text-[#123C35] hover:bg-gray-50"
                  >
                    Account
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 rounded-full border border-red-200 px-5 py-3 text-center text-sm font-semibold text-red-600"
                >
                  Logout
                </button>
              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;