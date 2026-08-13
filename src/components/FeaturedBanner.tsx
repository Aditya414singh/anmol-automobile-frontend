import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  webUtilsApi,
} from "../api/webUtilsApi";

import type {
  FeaturedContent,
} from "../api/webUtilsApi";

import {
  useLanguage,
} from "../context/LanguageContext";


const FeaturedBanner = () => {

  const { t } = useLanguage();


  const [
    featured,
    setFeatured,
  ] = useState<FeaturedContent | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    showContent,
    setShowContent,
  ] = useState(false);


  // ==========================================================
  // LOAD FEATURED CONTENT
  // ==========================================================

  useEffect(() => {

    const loadFeatured =
      async () => {

        try {

          const data =
            await webUtilsApi.getFeaturedContent();

          setFeatured(
            data[0] ?? null
          );

        } catch (error) {

          console.error(
            "Failed to load featured content:",
            error
          );

          setFeatured(null);

        } finally {

          setLoading(false);

        }

      };


    loadFeatured();

  }, []);


  // ==========================================================
  // SHOW CONTENT AFTER 3 SECONDS
  // ==========================================================

  useEffect(() => {

    if (!featured) {
      return;
    }


    setShowContent(false);


    const timer =
      window.setTimeout(() => {

        setShowContent(true);

      }, 3000);


    return () => {

      window.clearTimeout(timer);

    };

  }, [featured]);


  // ==========================================================
  // LOADING / EMPTY
  // ==========================================================

  if (loading || !featured) {
    return null;
  }


  // ==========================================================
  // EXTERNAL URL
  // ==========================================================

  const isExternalUrl =
    featured.button_url.startsWith(
      "http://"
    ) ||
    featured.button_url.startsWith(
      "https://"
    );


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <section className="bg-[#F8FAF9] px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        <div
          className="group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#123C35] shadow-xl sm:min-h-[440px] lg:min-h-[500px]"
          onMouseEnter={() => {
            setShowContent(true);
          }}
        >

          {/* ==================================================
              MEDIA
          ================================================== */}

          <div className="absolute inset-0 z-0">

            {featured.content_type ===
            "VIDEO" ? (

              <video
                src={featured.media_url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

            ) : (

              <img
                src={featured.media_url}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

            )}

          </div>


          {/* ==================================================
              INITIAL LIGHT OVERLAY
          ================================================== */}

          <div
            className={`
              absolute
              inset-0
              z-10
              transition-all
              duration-1000
              ${
                showContent
                  ? "bg-gradient-to-r from-[#123C35]/80 via-[#123C35]/45 to-transparent"
                  : "bg-gradient-to-r from-black/10 via-black/5 to-transparent"
              }
            `}
          />


          {/* ==================================================
              BOTTOM GRADIENT
          ================================================== */}

          <div
            className={`
              absolute
              inset-x-0
              bottom-0
              z-10
              h-40
              transition-opacity
              duration-1000
              ${
                showContent
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          >

            <div className="h-full bg-gradient-to-t from-black/60 to-transparent" />

          </div>


          {/* ==================================================
              CONTENT
          ================================================== */}

          <div
            className={`
              relative
              z-20
              flex
              min-h-[360px]
              items-end
              px-6
              py-10
              transition-all
              duration-1000
              sm:min-h-[440px]
              sm:px-10
              sm:py-14
              lg:min-h-[500px]
              lg:px-16
              lg:py-16
              ${
                showContent
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }
            `}
          >

            <div className="max-w-2xl">

              {/* BADGE */}

              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">

                {t.featured.badge}

              </div>


              {/* TITLE */}

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">

                {featured.title}

              </h2>


              {/* DESCRIPTION */}

              {featured.description && (

                <p className="mt-5 max-w-xl text-base leading-7 text-white/90 drop-shadow-md sm:text-lg">

                  {featured.description}

                </p>

              )}


              {/* BUTTON */}

              {featured.button_text &&
                featured.button_url && (

                  <div className="mt-7">

                    {isExternalUrl ? (

                      <a
                        href={
                          featured.button_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#123C35] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-gray-100"
                      >

                        {
                          featured.button_text
                        }

                        <span className="ml-2">
                          →
                        </span>

                      </a>

                    ) : (

                      <Link
                        to={
                          featured.button_url
                        }
                        className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#123C35] shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-gray-100"
                      >

                        {
                          featured.button_text
                        }

                        <span className="ml-2">
                          →
                        </span>

                      </Link>

                    )}

                  </div>

                )}

            </div>

          </div>


          {/* ==================================================
              HOVER HINT
          ================================================== */}

          {!showContent && (

            <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-medium text-white/80 opacity-100 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-0">

              {t.featured.viewMore}

            </div>

          )}

        </div>

      </div>

    </section>

  );
};


export default FeaturedBanner;