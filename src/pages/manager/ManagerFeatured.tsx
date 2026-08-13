import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { webUtilsApi } from "../../api/webUtilsApi";
import type { FeaturedContent } from "../../api/webUtilsApi";

import { useLanguage } from "../../context/LanguageContext";


const ManagerFeatured = () => {
  const { language } = useLanguage();

  const isHindi = language === "hi";

  const [featured, setFeatured] = useState<
    FeaturedContent[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const [actionId, setActionId] = useState<string | null>(
    null
  );


  // ==========================================================
  // LOAD FEATURED CONTENT
  // ==========================================================

  const loadFeatured = async () => {
    try {
      setLoading(true);
      setError(false);

      const data =
        await webUtilsApi.getManagerFeaturedContent();

      setFeatured(data);

    } catch (err) {
      console.error(
        "Failed to load featured content:",
        err
      );

      setError(true);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadFeatured();
  }, []);


  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (date: string) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      isHindi ? "hi-IN" : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================================
  // PUBLISH
  // ==========================================================

  const handlePublish = async (
    featuredId: string
  ) => {
    try {
      setActionId(featuredId);

      await webUtilsApi.publishFeaturedContent(
        featuredId
      );

      await loadFeatured();

    } catch (err) {
      console.error(
        "Failed to publish featured content:",
        err
      );

      alert(
        isHindi
          ? "कंटेंट प्रकाशित नहीं किया जा सका।"
          : "Unable to publish featured content."
      );

    } finally {
      setActionId(null);
    }
  };


  // ==========================================================
  // UNPUBLISH
  // ==========================================================

  const handleUnpublish = async (
    featuredId: string
  ) => {
    try {
      setActionId(featuredId);

      await webUtilsApi.unpublishFeaturedContent(
        featuredId
      );

      await loadFeatured();

    } catch (err) {
      console.error(
        "Failed to unpublish featured content:",
        err
      );

      alert(
        isHindi
          ? "कंटेंट को अप्रकाशित नहीं किया जा सका।"
          : "Unable to unpublish featured content."
      );

    } finally {
      setActionId(null);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    featuredId: string
  ) => {

    const confirmed = window.confirm(
      isHindi
        ? "क्या आप इस featured content को हटाना चाहते हैं?"
        : "Are you sure you want to delete this featured content?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(featuredId);

      await webUtilsApi.deleteFeaturedContent(
        featuredId
      );

      setFeatured((current) =>
        current.filter(
          (item) => item.id !== featuredId
        )
      );

    } catch (err) {
      console.error(
        "Failed to delete featured content:",
        err
      );

      alert(
        isHindi
          ? "कंटेंट हटाया नहीं जा सका।"
          : "Unable to delete featured content."
      );

    } finally {
      setActionId(null);
    }
  };


  return (
    <main className="min-h-screen bg-[#F8FAF9]">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
                {isHindi
                  ? "मैनेजर पैनल"
                  : "Manager Panel"}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#123C35]">
                {isHindi
                  ? "Featured Content"
                  : "Featured Content"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                {isHindi
                  ? "ऑफर, त्योहार, घोषणाएं और प्रचार सामग्री प्रबंधित करें।"
                  : "Manage offers, festivals, announcements and promotional content."}
              </p>

            </div>


            <Link
              to="/manager/featured/add"
              className="inline-flex items-center justify-center rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
            >
              +{" "}
              {isHindi
                ? "Featured जोड़ें"
                : "Add Featured"}
            </Link>

          </div>

        </div>

      </section>


      {/* ====================================================
          CONTENT
      ==================================================== */}

      <section className="py-10">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


          {/* LOADING */}

          {loading && (

            <div className="grid gap-6 md:grid-cols-2">

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >

                    <div className="aspect-[16/8] animate-pulse bg-gray-200" />

                    <div className="space-y-4 p-6">

                      <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />

                      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                      <div className="h-10 animate-pulse rounded bg-gray-100" />

                    </div>

                  </div>

                )
              )}

            </div>

          )}


          {/* ERROR */}

          {!loading && error && (

            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                ⚠️
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#123C35]">
                {isHindi
                  ? "Featured Content लोड नहीं हो सका"
                  : "Unable to load featured content"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {isHindi
                  ? "कृपया दोबारा कोशिश करें।"
                  : "Please try again."}
              </p>

              <button
                type="button"
                onClick={loadFeatured}
                className="mt-5 rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white"
              >
                {isHindi
                  ? "फिर कोशिश करें"
                  : "Try Again"}
              </button>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            featured.length === 0 && (

              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                <div className="text-6xl">
                  📢
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#123C35]">
                  {isHindi
                    ? "अभी कोई Featured Content नहीं है"
                    : "No featured content yet"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  {isHindi
                    ? "अपना पहला offer या announcement जोड़ें।"
                    : "Create your first offer, announcement or campaign."}
                </p>

                <Link
                  to="/manager/featured/add"
                  className="mt-6 inline-flex rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white"
                >
                  +{" "}
                  {isHindi
                    ? "Featured जोड़ें"
                    : "Add Featured"}
                </Link>

              </div>

            )}


          {/* ==================================================
              FEATURED CARDS
          ================================================== */}

          {!loading &&
            !error &&
            featured.length > 0 && (

              <div className="grid gap-6 md:grid-cols-2">

                {featured.map(
                  (item) => (

                    <article
                      key={item.id}
                      className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                    >

                      {/* MEDIA */}

                      <div className="relative aspect-[16/8] overflow-hidden bg-[#F4F8F5]">

                        {item.content_type ===
                        "VIDEO" ? (

                          <video
                            src={item.media_url}
                            muted
                            controls
                            preload="metadata"
                            className="h-full w-full object-contain"
                          />

                        ) : (

                          <img
                            src={item.media_url}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-contain"
                          />

                        )}


                        {/* STATUS */}

                        <div className="absolute left-4 top-4">

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              item.is_published
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-900/80 text-white"
                            }`}
                          >
                            {item.is_published
                              ? isHindi
                                ? "प्रकाशित"
                                : "Published"
                              : isHindi
                              ? "ड्राफ्ट"
                              : "Draft"}
                          </span>

                        </div>

                      </div>


                      {/* DETAILS */}

                      <div className="p-6">

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h2 className="text-xl font-bold text-[#123C35]">
                              {item.title}
                            </h2>

                            {item.description && (

                              <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                                {item.description}
                              </p>

                            )}

                          </div>


                          <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            {item.content_type}
                          </span>

                        </div>


                        {/* DATES */}

                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <div className="rounded-2xl bg-[#F8FAF9] p-3">

                            <p className="text-xs text-gray-400">
                              {isHindi
                                ? "शुरू"
                                : "Starts"}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#123C35]">
                              {formatDate(
                                item.start_date
                              )}
                            </p>

                          </div>


                          <div className="rounded-2xl bg-[#F8FAF9] p-3">

                            <p className="text-xs text-gray-400">
                              {isHindi
                                ? "समाप्त"
                                : "Ends"}
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#123C35]">
                              {formatDate(
                                item.end_date
                              )}
                            </p>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="mt-6 flex flex-wrap gap-3">

                          {item.is_published ? (

                            <button
                              type="button"
                              disabled={
                                actionId === item.id
                              }
                              onClick={() =>
                                handleUnpublish(
                                  item.id
                                )
                              }
                              className="rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {actionId === item.id
                                ? "..."
                                : isHindi
                                ? "अप्रकाशित करें"
                                : "Unpublish"}
                            </button>

                          ) : (

                            <button
                              type="button"
                              disabled={
                                actionId === item.id
                              }
                              onClick={() =>
                                handlePublish(
                                  item.id
                                )
                              }
                              className="rounded-full bg-[#0F5C4D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {actionId === item.id
                                ? "..."
                                : isHindi
                                ? "प्रकाशित करें"
                                : "Publish"}
                            </button>

                          )}


                          <Link
                            to={`/manager/featured/${item.id}/edit`}
                            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            {isHindi
                              ? "संपादित करें"
                              : "Edit"}
                          </Link>


                          <button
                            type="button"
                            disabled={
                              actionId === item.id
                            }
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isHindi
                              ? "हटाएं"
                              : "Delete"}
                          </button>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

        </div>

      </section>

    </main>
  );
};


export default ManagerFeatured;