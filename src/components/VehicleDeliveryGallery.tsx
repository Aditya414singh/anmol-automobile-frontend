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


const VehicleDeliveryGallery = () => {

  const { language } =
    useLanguage();


  const [
    deliveries,
    setDeliveries,
  ] = useState<VehicleDelivery[]>(
    []
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const isHindi =
    language === "hi";


  // ==========================================================
  // LOAD LATEST 6 DELIVERIES
  // ==========================================================

  useEffect(() => {

    const loadDeliveries =
      async () => {

        try {

          setLoading(true);


          const data =
            await webUtilsApi
              .getVehicleDeliveries(6);


          setDeliveries(data);

        } catch (error) {

          console.error(
            "Failed to load vehicle deliveries:",
            error
          );

        } finally {

          setLoading(false);

        }

      };


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

    const card =
      event.currentTarget;


    const rect =
      card.getBoundingClientRect();


    const x =
      event.clientX -
      rect.left;


    const y =
      event.clientY -
      rect.top;


    const centerX =
      rect.width / 2;


    const centerY =
      rect.height / 2;


    const rotateX =
      ((y - centerY) /
        centerY) *
      -4;


    const rotateY =
      ((x - centerX) /
        centerX) *
      4;


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

    const card =
      event.currentTarget;


    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
    `;

  };


  // ==========================================================
  // HIDE IF EMPTY
  // ==========================================================

  if (
    !loading &&
    deliveries.length === 0
  ) {

    return null;

  }


  return (

    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">

            {isHindi
              ? "हमारी डिलीवरी"
              : "Our Deliveries"}

          </p>


          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl">

            {isHindi
              ? "हमारे ग्राहकों के साथ हमारी डिलीवरी"
              : "Deliveries We're Proud Of"}

          </h2>


          <p className="mt-4 text-base leading-7 text-gray-600">

            {isHindi
              ? "हमारे ग्राहकों को उनके नए ई-रिक्शा की डिलीवरी की कुछ यादगार तस्वीरें।"
              : "A look at some memorable deliveries of new e-rickshaws to our customers."}

          </p>

        </div>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div
            className="
              mt-10
              grid
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                >

                  {/* IMAGE SKELETON */}

                  <div className="aspect-[4/3] animate-pulse bg-gray-200" />


                  {/* CONTENT SKELETON */}

                  <div className="space-y-4 p-5">

                    <div className="flex items-center justify-between gap-4">

                      <div className="space-y-2">

                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

                        <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />

                      </div>


                      <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />

                    </div>


                    <div className="rounded-2xl bg-gray-50 px-4 py-3">

                      <div className="h-3 w-14 animate-pulse rounded bg-gray-200" />

                      <div className="mt-2 h-4 w-36 animate-pulse rounded bg-gray-200" />

                    </div>


                    <div className="space-y-2">

                      <div className="h-3 w-full animate-pulse rounded bg-gray-100" />

                      <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}


        {/* ==================================================
            DELIVERY CARDS
        ================================================== */}

        {!loading &&
          deliveries.length > 0 && (

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {deliveries.map(
                (delivery) => (

                  <article
                    key={delivery.id}
                    onMouseMove={
                      handleMouseMove
                    }
                    onMouseLeave={
                      handleMouseLeave
                    }
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
                          800
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
                      className="p-5"
                      style={{
                        transform:
                          "translateZ(20px)",
                      }}
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="font-bold text-[#123C35]">

                            {delivery.customer_name ||
                              (isHindi
                                ? "हमारे ग्राहक"
                                : "Our Customer")}

                          </h3>


                          {delivery.customer_location && (

                            <p className="mt-1 text-sm text-gray-500">

                              📍{" "}

                              {
                                delivery.customer_location
                              }

                            </p>

                          )}

                        </div>


                        <p className="shrink-0 text-xs font-medium text-gray-400">

                          {formatDate(
                            delivery.delivery_date
                          )}

                        </p>

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

                            {
                              delivery.vehicle_name
                            }

                            {delivery.vehicle_model &&
                              ` · ${delivery.vehicle_model}`}

                          </p>

                        </div>

                      )}


                      {/* CAPTION */}

                      {delivery.caption && (

                        <p className="mt-4 text-sm leading-6 text-gray-600">

                          {
                            delivery.caption
                          }

                        </p>

                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          )}


        {/* ==================================================
            VIEW ALL
        ================================================== */}

        {!loading &&
          deliveries.length > 0 && (

            <div className="mt-10 text-center">

              <Link
                to="/deliveries"
                className="inline-flex items-center gap-2 rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#0B493D]"
              >

                {isHindi
                  ? "सभी डिलीवरी देखें"
                  : "View All Deliveries"}

                <span>
                  →
                </span>

              </Link>

            </div>

          )}

      </div>

    </section>

  );

};


export default VehicleDeliveryGallery;