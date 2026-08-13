import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  webUtilsApi,
} from "../../api/webUtilsApi";

import type {
  VehicleDelivery,
} from "../../api/webUtilsApi";

import {
  useLanguage,
} from "../../context/LanguageContext";

import {
  getOptimizedCloudinaryUrl,
} from "../../utils/cloudinary";


const ManagerDeliveries = () => {
  const {
    language,
  } = useLanguage();

  const isHindi =
    language === "hi";


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


  const [
    actionLoading,
    setActionLoading,
  ] = useState<string | null>(null);


  // ==========================================================
  // LOAD DELIVERIES
  // ==========================================================

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(false);

      const data =
        await webUtilsApi.getManagerVehicleDeliveries();

      setDeliveries(data);

    } catch (err) {
      console.error(
        "Failed to load vehicle deliveries:",
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
  // APPROVE / PUBLISH
  // ==========================================================

  const handleApprove = async (
    deliveryId: string
  ) => {
    const confirmed =
      window.confirm(
        isHindi
          ? "क्या आप इस डिलीवरी फोटो को प्रकाशित करना चाहते हैं?"
          : "Do you want to publish this delivery photo?"
      );

    if (!confirmed) {
      return;
    }


    try {
      setActionLoading(deliveryId);


      const updated =
        await webUtilsApi.approveVehicleDelivery(
          deliveryId
        );


      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === deliveryId
            ? updated
            : delivery
        )
      );

    } catch (err) {
      console.error(
        "Failed to publish delivery:",
        err
      );

      window.alert(
        isHindi
          ? "डिलीवरी प्रकाशित नहीं हो सकी। कृपया दोबारा कोशिश करें।"
          : "Unable to publish the delivery. Please try again."
      );

    } finally {
      setActionLoading(null);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    deliveryId: string
  ) => {
    const confirmed =
      window.confirm(
        isHindi
          ? "क्या आप इस डिलीवरी को स्थायी रूप से हटाना चाहते हैं?"
          : "Are you sure you want to permanently delete this delivery?"
      );

    if (!confirmed) {
      return;
    }


    try {
      setActionLoading(deliveryId);


      await webUtilsApi.deleteVehicleDelivery(
        deliveryId
      );


      setDeliveries((current) =>
        current.filter(
          (delivery) =>
            delivery.id !== deliveryId
        )
      );

    } catch (err) {
      console.error(
        "Failed to delete delivery:",
        err
      );

      window.alert(
        isHindi
          ? "डिलीवरी हटाई नहीं जा सकी। कृपया दोबारा कोशिश करें।"
          : "Unable to delete the delivery. Please try again."
      );

    } finally {
      setActionLoading(null);
    }
  };


  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (
    date: string
  ) => {
    if (!date) {
      return "-";
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
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#F8FAF9]">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-gray-100 bg-[#F4F8F5]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            to="/manager/dashboard"
            className="text-sm font-semibold text-[#0F5C4D] hover:underline"
          >
            ←{" "}
            {isHindi
              ? "डैशबोर्ड पर वापस जाएं"
              : "Back to Dashboard"}
          </Link>


          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
                {isHindi
                  ? "मैनेजर पैनल"
                  : "Manager Panel"}
              </p>


              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl">
                {isHindi
                  ? "वाहन डिलीवरी"
                  : "Vehicle Deliveries"}
              </h1>


              <p className="mt-3 max-w-2xl text-gray-600">
                {isHindi
                  ? "बेचे गए ई-रिक्शा की ग्राहक डिलीवरी तस्वीरों को प्रबंधित करें।"
                  : "Manage delivery photos of e-rickshaws sold to customers."}
              </p>

            </div>


            <Link
              to="/manager/deliveries/add"
              className="inline-flex items-center justify-center rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
            >
              +{" "}
              {isHindi
                ? "डिलीवरी जोड़ें"
                : "Add Delivery"}
            </Link>

          </div>

        </div>

      </section>


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="py-10 sm:py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


          {/* LOADING */}

          {loading && (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >

                    <div className="aspect-[4/3] animate-pulse bg-gray-200" />

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

            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

              <div className="text-4xl">
                ⚠️
              </div>


              <h2 className="mt-4 text-xl font-bold text-[#123C35]">
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
                  🚚
                </div>


                <h2 className="mt-5 text-xl font-bold text-[#123C35]">
                  {isHindi
                    ? "अभी कोई डिलीवरी नहीं है"
                    : "No deliveries yet"}
                </h2>


                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  {isHindi
                    ? "पहली डिलीवरी फोटो जोड़कर अपनी बिक्री गैलरी बनाना शुरू करें।"
                    : "Add your first delivery photo to start building your delivery gallery."}
                </p>


                <Link
                  to="/manager/deliveries/add"
                  className="mt-6 inline-flex rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white"
                >
                  +{" "}
                  {isHindi
                    ? "डिलीवरी जोड़ें"
                    : "Add Delivery"}
                </Link>

              </div>

            )}


          {/* DELIVERY GRID */}

          {!loading &&
            !error &&
            deliveries.length > 0 && (

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {deliveries.map(
                  (delivery) => {

                    const isBusy =
                      actionLoading ===
                      delivery.id;


                    return (
                      <article
                        key={delivery.id}
                        className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
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
                            className="h-full w-full object-cover"
                          />


                          {/* STATUS */}

                          <div className="absolute left-4 top-4">

                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${
                                delivery.is_published
                                  ? "bg-white/95 text-[#0F5C4D]"
                                  : "bg-yellow-100/95 text-yellow-700"
                              }`}
                            >
                              {delivery.is_published
                                ? isHindi
                                  ? "प्रकाशित"
                                  : "Published"
                                : isHindi
                                ? "लंबित"
                                : "Pending"}
                            </span>

                          </div>

                        </div>


                        {/* CONTENT */}

                        <div className="p-6">

                          {/* CUSTOMER */}

                          <h2 className="text-lg font-bold text-[#123C35]">
                            {delivery.customer_name ||
                              (isHindi
                                ? "ग्राहक"
                                : "Customer")}
                          </h2>


                          {/* LOCATION */}

                          {delivery.customer_location && (

                            <p className="mt-1 text-sm text-gray-500">
                              📍{" "}
                              {delivery.customer_location}
                            </p>

                          )}


                          {/* VEHICLE */}

                          {(delivery.vehicle_name ||
                            delivery.vehicle_model) && (

                            <div className="mt-4 rounded-2xl bg-[#F8FAF9] p-4">

                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                {isHindi
                                  ? "वाहन"
                                  : "Vehicle"}
                              </p>


                              <p className="mt-1 font-semibold text-[#123C35]">
                                {delivery.vehicle_name ||
                                  "-"}
                              </p>


                              {delivery.vehicle_model && (

                                <p className="mt-1 text-xs text-gray-500">
                                  {delivery.vehicle_model}
                                </p>

                              )}

                            </div>

                          )}


                          {/* DATE */}

                          <div className="mt-4 flex items-center justify-between text-sm">

                            <span className="text-gray-400">
                              {isHindi
                                ? "डिलीवरी"
                                : "Delivered"}
                            </span>


                            <span className="font-semibold text-gray-700">
                              {formatDate(
                                delivery.delivery_date
                              )}
                            </span>

                          </div>


                          {/* CAPTION */}

                          {delivery.caption && (

                            <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-600">
                              {delivery.caption}
                            </p>

                          )}


                          {/* ACTIONS */}

                          <div className="mt-5 flex gap-3">

                            {!delivery.is_published && (

                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleApprove(
                                    delivery.id
                                  )
                                }
                                className="flex-1 rounded-full bg-[#0F5C4D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isBusy
                                  ? isHindi
                                    ? "प्रोसेस..."
                                    : "Processing..."
                                  : isHindi
                                  ? "प्रकाशित करें"
                                  : "Publish"}
                              </button>

                            )}


                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                handleDelete(
                                  delivery.id
                                )
                              }
                              className={`rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 ${
                                delivery.is_published
                                  ? "flex-1"
                                  : ""
                              }`}
                            >
                              {isHindi
                                ? "हटाएं"
                                : "Delete"}
                            </button>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

        </div>

      </section>

    </main>
  );
};


export default ManagerDeliveries;