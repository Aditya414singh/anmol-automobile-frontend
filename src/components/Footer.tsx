import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useLanguage,
} from "../context/LanguageContext";

const Footer = () => {
  const {
    language,
  } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();

  const currentYear =
    new Date().getFullYear();

  // ==========================================================
  // HOME
  // ==========================================================

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    navigate("/");
  };

  // ==========================================================
  // ENQUIRY
  // ==========================================================

  const handleEnquiryClick = () => {
    // Already on Home
    if (location.pathname === "/") {
      scrollToEnquiry();
      return;
    }

    // Go to Home first.
    // The query parameter tells Home that we want
    // to scroll to the enquiry section.
    navigate("/?scroll=enquiry");
  };

  // ==========================================================
  // SCROLL TO ENQUIRY
  // ==========================================================

  const scrollToEnquiry = () => {
    const enquirySection =
      document.getElementById("contact");

    if (!enquirySection) {
      return;
    }

    enquirySection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <footer className="bg-[#123C35] text-white">

      {/* ==================================================
          MAIN FOOTER
      ================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ==================================================
              BRAND
          ================================================== */}

          <div className="sm:col-span-2 lg:col-span-1">

            <button
              type="button"
              onClick={handleHomeClick}
              className="inline-flex items-center text-left"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <span className="text-sm font-bold text-[#0F5C4D]">
                  AA
                </span>
              </div>

              <div className="ml-3">

                <h2 className="text-lg font-bold leading-none">
                  ANMOL
                </h2>

                <p className="mt-1 text-[9px] font-medium tracking-[0.25em] text-gray-300">
                  AUTOMOBILES
                </p>

              </div>

            </button>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-300">

              {language === "hi"
                ? "भरोसेमंद और किफायती इलेक्ट्रिक ई-रिक्शा के साथ बेहतर और आसान यात्रा।"
                : "Reliable and affordable electric e-rickshaws designed for everyday journeys and business."}

            </p>

            <a
              href="tel:+918299498824"
              className="mt-6 inline-flex items-center gap-3 text-sm font-medium text-gray-200 transition hover:text-[#7AD6B7]"
            >

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                ☎
              </span>

              +91 82994 98824

            </a>

          </div>

          {/* ==================================================
              QUICK LINKS
          ================================================== */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#7AD6B7]">
              {language === "hi"
                ? "त्वरित लिंक"
                : "Quick Links"}
            </h3>

            <nav className="mt-5 flex flex-col gap-3">

              {/* Home */}

              <button
                type="button"
                onClick={handleHomeClick}
                className="text-left text-sm text-gray-300 transition hover:text-white"
              >
                {language === "hi"
                  ? "होम"
                  : "Home"}
              </button>

              {/* E-Rickshaws */}

              <Link
                to="/vehicles"
                className="text-left text-sm text-gray-300 transition hover:text-white"
              >
                {language === "hi"
                  ? "ई-रिक्शा"
                  : "E-Rickshaws"}
              </Link>

              {/* Our Models */}

              <Link
                to="/vehicles"
                className="text-left text-sm text-gray-300 transition hover:text-white"
              >
                {language === "hi"
                  ? "हमारे मॉडल"
                  : "Our Models"}
              </Link>

              {/* Enquiry */}

              <button
                type="button"
                onClick={handleEnquiryClick}
                className="text-left text-sm text-gray-300 transition hover:text-white"
              >
                {language === "hi"
                  ? "पूछताछ"
                  : "Enquiry"}
              </button>

            </nav>

          </div>

          {/* ==================================================
              CONTACT
          ================================================== */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#7AD6B7]">
              {language === "hi"
                ? "संपर्क"
                : "Contact"}
            </h3>

            <div className="mt-5 space-y-4">

              <a
                href="tel:+918299498824"
                className="flex items-start gap-3 text-sm text-gray-300 transition hover:text-white"
              >
                <span className="mt-0.5">
                  ☎
                </span>

                <span>
                  +91 82994 98824
                </span>
              </a>

              <a
                href="mailto:anmolautomobile07@gmail.com"
                className="flex items-start gap-3 text-sm text-gray-300 transition hover:text-white"
              >
                <span className="mt-0.5">
                  ✉
                </span>

                <span className="break-all">
                  anmolautomobile07@gmail.com
                </span>
              </a>

              <div className="flex items-start gap-3 text-sm leading-6 text-gray-300">

                <span className="mt-0.5">
                  📍
                </span>

                <span>
                  Devraj Bramh Mod,
                  <br />
                  Bairiya, Ballia,
                  <br />
                  Uttar Pradesh
                </span>

              </div>

            </div>

          </div>

          {/* ==================================================
              ABOUT
          ================================================== */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#7AD6B7]">
              {language === "hi"
                ? "हमारे बारे में"
                : "About Us"}
            </h3>

            <p className="mt-5 text-sm leading-6 text-gray-300">

              {language === "hi"
                ? "अनमोल ऑटोमोबाइल्स का उद्देश्य ग्राहकों को भरोसेमंद, किफायती और उपयोगी इलेक्ट्रिक वाहन उपलब्ध कराना है।"
                : "Anmol Automobiles is focused on providing reliable, practical, and affordable electric vehicles for everyday transportation and business needs."}

            </p>

            <button
              type="button"
              onClick={handleEnquiryClick}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0F8B6D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#159A75]"
            >

              {language === "hi"
                ? "हमसे संपर्क करें"
                : "Contact Us"}

              <span>
                →
              </span>

            </button>

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM BAR
      ================================================== */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

          <p className="text-xs text-gray-400">

            © {currentYear} Anmol Automobiles.{" "}

            {language === "hi"
              ? "सर्वाधिकार सुरक्षित।"
              : "All rights reserved."}

          </p>

          <div className="flex items-center gap-5">

            <button
              type="button"
              onClick={handleEnquiryClick}
              className="text-xs text-gray-400 transition hover:text-white"
            >
              {language === "hi"
                ? "संपर्क करें"
                : "Contact"}
            </button>

            <Link
              to="/vehicles"
              className="text-xs text-gray-400 transition hover:text-white"
            >
              {language === "hi"
                ? "वाहन देखें"
                : "View Vehicles"}
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;