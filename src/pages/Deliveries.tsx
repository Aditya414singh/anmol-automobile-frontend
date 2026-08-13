import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  webUtilsApi,
} from "../api/webUtilsApi";

import type {
  VehicleDelivery,
} from "../api/webUtilsApi";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  getOptimizedCloudinaryUrl,
} from "../utils/cloudinary";


const Deliveries = () => {
  const { language } = useLanguage();

  const isHindi = language === "hi";


  const [
    deliveries,
    setDeliveries,
  ] = useState<VehicleDelivery[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(false);


  // ==========================================================
  // LOAD ALL PUBLISHED DELIVERIES
  // ==========================================================

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(false);

      const data =
        await webUtilsApi.getVehicleDeliveries();

      setDeliveries(data);

    } catch (err) {
      console.error(
        "Failed to load deliveries:",
        err
      );

      setError(true);
      setDeliveries([]);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDeliveries();
  }, []);


  // ==========================================================
  // DATE
  // ==========================================================

  const formatDate = (
    date: string
  ) => {
    if (!date) {
      return "";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      isHindi
        ? "hi-IN"
        : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================================
  // 3D HOVER
  // ==========================================================

  const handleMouseMove = (
    event: MouseEvent<HTMLElement>
  ) => {
    const card = event.currentTarget;

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    const centerX =
      rect.width / 2;

    const centerY =
      rect.height / 2;

    const rotateX =
      ((y - centerY) / centerY) * -4;

    const rotateY =
      ((x - centerX) / centerX) * 4;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-4px)
    `;
  };


  const handleMouseLeave = (
    event: MouseEvent<HTMLElement>
  ) => {
    const card = event.currentTarget;

    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;
  };


  return (
    <main className="min-h-screen bg-[#F8FAF9]">


      {/* HEADER */}

      <section className="bg-[#F4F8F5] py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="text-sm font-semibold text-[#0F5C4D] hover:underline"
          >
            ←{" "}
            {isHindi
              ? "होम पर वापस जाएं"
              : "Back to Home"}
          </Link>


          <div className="mx-auto mt-10 max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
              {isHindi
                ? "हमारी डिलीवरी"
                : "Our Deliveries"}
            </p>


            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#123C35] sm:text-5xl">
              {isHindi
                ? "हमारे ग्राहकों की डिलीवरी"
                : "Our Customer Deliveries"}
            </h1>


            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              {isHindi
                ? "हमारे ग्राहकों को उनके नए ई-रिक्शा की डिलीवरी की तस्वीरें देखें।"
                : "See moments from our e-rickshaw deliveries to customers."}
            </p>

          </div>

        </div>

      </section>


      {/* GALLERY */}

      <section className="py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


          {/* LOADING */}

          {loading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (

                  <div
                    key={item}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >

                    <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                    <div className="space-y-3 p-5">

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

          {!loading &&
            error && (

              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                <div className="text-5xl">
                  ⚠️
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#123C35]">
                  {isHindi
                    ? "डिलीवरी लोड नहीं हो सकीं"
                    : "Unable to load deliveries"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {isHindi
                    ? "कृपया दोबारा कोशिश करें।"
                    : "Please try again."}
                </p>

                <button
                  type="button"
                  onClick={loadDeliveries}
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
            deliveries.length === 0 && (

              <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

                <div className="text-6xl">
                  📸
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#123C35]">
                  {isHindi
                    ? "अभी कोई डिलीवरी उपलब्ध नहीं है"
                    : "No deliveries available yet"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  {isHindi
                    ? "नई डिलीवरी तस्वीरें जल्द ही यहां दिखाई देंगी।"
                    : "New delivery photos will appear here soon."}
                </p>

                <Link
                  to="/"
                  className="mt-6 inline-flex rounded-full border border-[#0F5C4D] px-6 py-3 text-sm font-semibold text-[#0F5C4D]"
                >
                  {isHindi
                    ? "होम पर जाएं"
                    : "Go Home"}
                </Link>

              </div>

            )}


          {/* FULL DELIVERY GRID */}

          {!loading &&
            !error &&
            deliveries.length > 0 && (

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                {deliveries.map(
                  (delivery) => (

                    <article
                      key={delivery.id}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-transform duration-150 ease-out hover:shadow-2xl"
                      style={{
                        transformStyle:
                          "preserve-3d",
                      }}
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F8F5]">

                        <img
                          src={getOptimizedCloudinaryUrl(
                            delivery.image_url,
                            1000
                          )}
                          alt={
                            delivery.caption ||
                            delivery.customer_name ||
                            "Vehicle delivery"
                          }
                          loading="lazy"
                          className="h-full w-full object-contain p-2 transition duration-500 ease-out group-hover:scale-[1.03]"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />

                      </div>


                      {/* CONTENT */}

                      <div
                        className="p-6"
                        style={{
                          transform:
                            "translateZ(20px)",
                        }}
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h2 className="text-lg font-bold text-[#123C35]">
                              {delivery.customer_name ||
                                (isHindi
                                  ? "हमारे ग्राहक"
                                  : "Our Customer")}
                            </h2>


                            {delivery.customer_location && (

                              <p className="mt-1 text-sm text-gray-500">
                                📍{" "}
                                {delivery.customer_location}
                              </p>

                            )}

                          </div>


                          <span className="shrink-0 text-xs font-medium text-gray-400">
                            {formatDate(
                              delivery.delivery_date
                            )}
                          </span>

                        </div>


                        {/* VEHICLE */}

                        {(delivery.vehicle_name ||
                          delivery.vehicle_model) && (

                          <div className="mt-4 rounded-2xl bg-[#F8FAF9] px-4 py-3">

                            <p className="text-xs uppercase tracking-wider text-gray-400">
                              {isHindi
                                ? "वाहन"
                                : "Vehicle"}
                            </p>


                            <p className="mt-1 text-sm font-semibold text-[#123C35]">

                              {delivery.vehicle_name}

                              {delivery.vehicle_model &&
                                ` · ${delivery.vehicle_model}`}

                            </p>

                          </div>

                        )}


                        {/* CAPTION */}

                        {delivery.caption && (

                          <p className="mt-4 text-sm leading-6 text-gray-600">
                            {delivery.caption}
                          </p>

                        )}

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


export default Deliveries;