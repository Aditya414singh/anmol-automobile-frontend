import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

import { webUtilsApi } from "../../api/webUtilsApi";
import type { Vehicle } from "../../types/vehicle";


const ManagerDashboard = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const isHindi = language === "hi";


  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================================
  // FETCH VEHICLES
  // ==========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await webUtilsApi.getManagerVehicles();

        setVehicles(data);

      } catch (err) {
        console.error(
          "Failed to load manager dashboard:",
          err
        );

        setError(
          isHindi
            ? "डैशबोर्ड डेटा लोड नहीं हो सका।"
            : "Unable to load dashboard data."
        );

      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isHindi]);


  // ==========================================================
  // DASHBOARD STATISTICS
  // ==========================================================

  const statistics = useMemo(() => {
    const total = vehicles.length;

    const available = vehicles.filter(
      (vehicle) =>
        vehicle.is_available
    ).length;

    const unavailable =
      total - available;

    const eRickshaws =
      vehicles.filter(
        (vehicle) =>
          vehicle.vehicle_type ===
          "E_RICKSHAW"
      ).length;

    const cargoVehicles =
      vehicles.filter(
        (vehicle) =>
          vehicle.vehicle_type ===
          "CARGO"
      ).length;

    return {
      total,
      available,
      unavailable,
      eRickshaws,
      cargoVehicles,
    };
  }, [vehicles]);


  // ==========================================================
  // RECENT VEHICLES
  // ==========================================================

  const recentVehicles =
    useMemo(() => {
      return [...vehicles]
        .sort(
          (a, b) =>
            new Date(
              b.created_at
            ).getTime() -
            new Date(
              a.created_at
            ).getTime()
        )
        .slice(0, 5);
    }, [vehicles]);


  // ==========================================================
  // FORMAT PRICE
  // ==========================================================

  const formatPrice = (
    price: number | string
  ) => {
    const numericPrice =
      Number(price);

    if (Number.isNaN(numericPrice)) {
      return `₹${price}`;
    }

    return `₹${numericPrice.toLocaleString(
      "en-IN"
    )}`;
  };


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAF9]">

        <section className="border-b border-gray-100 bg-[#F4F8F5]">

          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

            <div className="mt-4 h-10 w-80 max-w-full animate-pulse rounded bg-gray-200" />

            <div className="mt-4 h-5 w-[500px] max-w-full animate-pulse rounded bg-gray-200" />

          </div>

        </section>


        <section className="py-10 sm:py-14">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-3xl bg-white shadow-sm"
                />
              ))}

            </div>

            <div className="mt-8 h-80 animate-pulse rounded-3xl bg-white shadow-sm" />

          </div>

        </section>

      </main>
    );
  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#F8FAF9]">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-gray-100 bg-[#F4F8F5]">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
            {t.manager.panel}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl">
            {t.manager.welcome},{" "}
            {user?.name}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            {t.manager.dashboardDescription}
          </p>

        </div>

      </section>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>

        </section>
      )}


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <section className="py-8 sm:py-10">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* TOTAL */}

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {isHindi
                      ? "कुल वाहन"
                      : "Total Vehicles"}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#123C35]">
                    {statistics.total}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F3ED] text-xl">
                  🛺
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                {isHindi
                  ? "सभी पंजीकृत वाहन"
                  : "All registered vehicles"}
              </p>

            </div>


            {/* AVAILABLE */}

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {isHindi
                      ? "उपलब्ध वाहन"
                      : "Available Vehicles"}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#0F5C4D]">
                    {statistics.available}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F3ED] text-xl">
                  ✓
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                {isHindi
                  ? "वर्तमान में उपलब्ध"
                  : "Currently available"}
              </p>

            </div>


            {/* UNAVAILABLE */}

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {isHindi
                      ? "अनुपलब्ध वाहन"
                      : "Unavailable Vehicles"}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-gray-700">
                    {statistics.unavailable}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl">
                  —
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                {isHindi
                  ? "वर्तमान में उपलब्ध नहीं"
                  : "Currently unavailable"}
              </p>

            </div>


            {/* VEHICLE TYPES */}

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    {isHindi
                      ? "कुल प्रकार"
                      : "Vehicle Types"}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#123C35]">

                    {[
                      statistics.eRickshaws > 0
                        ? 1
                        : 0,

                      statistics.cargoVehicles > 0
                        ? 1
                        : 0,

                    ].reduce(
                      (sum, value) =>
                        sum + value,
                      0
                    )}

                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F3ED] text-xl">
                  📊
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                {isHindi
                  ? "ई-रिक्शा और कार्गो"
                  : "E-Rickshaw & Cargo"}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}

      <section className="pb-8 sm:pb-10">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* ADD VEHICLE */}

            <Link
              to="/manager/vehicles/add"
              className="group flex items-center justify-between rounded-3xl bg-[#0F5C4D] p-6 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-[#0B493D] hover:shadow-lg sm:p-7"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  +
                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    {isHindi
                      ? "नया वाहन जोड़ें"
                      : "Add New Vehicle"}
                  </h2>

                  <p className="mt-1 text-sm text-white/70">
                    {isHindi
                      ? "इन्वेंट्री में नया वाहन जोड़ें।"
                      : "Add a new vehicle to your inventory."}
                  </p>

                </div>

              </div>

              <span className="text-xl transition group-hover:translate-x-1">
                →
              </span>

            </Link>


            {/* MANAGE VEHICLES */}

            <Link
              to="/manager/vehicles"
              className="group flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F3ED] text-2xl">
                  🛺
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#123C35]">
                    {isHindi
                      ? "वाहन मैनेज करें"
                      : "Manage Vehicles"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {isHindi
                      ? "वाहन जोड़ें, एडिट करें या हटाएं।"
                      : "Add, edit or delete vehicles."}
                  </p>

                </div>

              </div>

              <span className="text-xl text-[#0F5C4D] transition group-hover:translate-x-1">
                →
              </span>

            </Link>


            {/* MANAGE TESTIMONIALS */}

            <Link
              to="/manager/testimonials"
              className="group flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F3ED] text-2xl">
                  💬
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#123C35]">
                    {isHindi
                      ? "प्रतिक्रिया मैनेज करें"
                      : "Manage Testimonials"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {isHindi
                      ? "ग्राहकों की समीक्षा देखें और स्वीकृत करें।"
                      : "Review and approve customer feedback."}
                  </p>

                </div>

              </div>

              <span className="text-xl text-[#0F5C4D] transition group-hover:translate-x-1">
                →
              </span>

            </Link>


            {/* FEATURED CONTENT */}

            <Link
              to="/manager/featured"
              className="group flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F3ED] text-2xl">
                  📢
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#123C35]">
                    {t.manager.dashboard.featured.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {t.manager.dashboard.featured.description}
                  </p>

                </div>

              </div>

              <span className="text-xl text-[#0F5C4D] transition group-hover:translate-x-1">
                →
              </span>

            </Link>

          </div>

        </div>

      </section>


      {/* ======================================================
          DELIVERY GALLERY
      ====================================================== */}

      <section className="pb-8 sm:pb-10">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <Link
            to="/manager/deliveries"
            className="group flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F3ED] text-2xl">
                📸
              </div>

              <div>

                <h2 className="text-lg font-bold text-[#123C35]">
                  {isHindi
                    ? "डिलीवरी गैलरी"
                    : "Delivery Gallery"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {isHindi
                    ? "बेचे गए ई-रिक्शा की ग्राहक डिलीवरी तस्वीरें प्रबंधित करें।"
                    : "Manage customer delivery photos of sold e-rickshaws."}
                </p>

              </div>

            </div>

            <span className="text-xl text-[#0F5C4D] transition group-hover:translate-x-1">
              →
            </span>

          </Link>

        </div>

      </section>


      {/* ======================================================
          VEHICLE BREAKDOWN
      ====================================================== */}

      <section className="pb-10 sm:pb-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0F8B6D]">
                  {isHindi
                    ? "इन्वेंट्री"
                    : "Inventory"}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#123C35]">
                  {isHindi
                    ? "वाहन प्रकार"
                    : "Vehicle Types"}
                </h2>

              </div>

              <Link
                to="/manager/vehicles"
                className="text-sm font-semibold text-[#0F5C4D] hover:underline"
              >
                {isHindi
                  ? "सभी वाहन देखें"
                  : "View all vehicles"}{" "}
                →
              </Link>

            </div>


            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* E-RICKSHAW */}

              <div className="rounded-2xl bg-[#F4F8F5] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-[#123C35]">
                      {isHindi
                        ? "ई-रिक्शा"
                        : "E-Rickshaw"}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#0F5C4D]">
                      {statistics.eRickshaws}
                    </p>

                  </div>

                  <span className="text-3xl">
                    🛺
                  </span>

                </div>

              </div>


              {/* CARGO */}

              <div className="rounded-2xl bg-[#F4F8F5] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-semibold text-[#123C35]">
                      {isHindi
                        ? "कार्गो ई-रिक्शा"
                        : "Cargo E-Rickshaw"}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#0F5C4D]">
                      {statistics.cargoVehicles}
                    </p>

                  </div>

                  <span className="text-3xl">
                    🚚
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          RECENT VEHICLES
      ====================================================== */}

      <section className="pb-16 sm:pb-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">

            {/* HEADER */}

            <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#0F8B6D]">
                  {isHindi
                    ? "हाल की गतिविधि"
                    : "Recent Activity"}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#123C35]">
                  {isHindi
                    ? "हाल में जोड़े गए वाहन"
                    : "Recently Added Vehicles"}
                </h2>

              </div>

              <Link
                to="/manager/vehicles"
                className="text-sm font-semibold text-[#0F5C4D] hover:underline"
              >
                {isHindi
                  ? "सभी देखें"
                  : "View All"}{" "}
                →
              </Link>

            </div>


            {/* EMPTY */}

            {recentVehicles.length === 0 && (
              <div className="p-10 text-center sm:p-14">

                <div className="text-5xl">
                  🛺
                </div>

                <p className="mt-4 text-base font-semibold text-gray-600">
                  {isHindi
                    ? "अभी कोई वाहन नहीं है।"
                    : "No vehicles available yet."}
                </p>

                <Link
                  to="/manager/vehicles/add"
                  className="mt-5 inline-flex rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
                >
                  {isHindi
                    ? "पहला वाहन जोड़ें"
                    : "Add First Vehicle"}
                </Link>

              </div>
            )}


            {/* DESKTOP TABLE */}

            {recentVehicles.length > 0 && (
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[700px]">

                  <thead>

                    <tr className="border-b border-gray-100 bg-[#F8FAF9] text-left">

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {isHindi
                          ? "वाहन"
                          : "Vehicle"}
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {isHindi
                          ? "ब्रांड"
                          : "Brand"}
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {isHindi
                          ? "कीमत"
                          : "Price"}
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {isHindi
                          ? "स्थिति"
                          : "Status"}
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {isHindi
                          ? "एक्शन"
                          : "Action"}
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {recentVehicles.map(
                      (vehicle) => (

                        <tr
                          key={vehicle.id}
                          className="border-b border-gray-50 last:border-0"
                        >

                          {/* VEHICLE */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              <div className="flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F4F8F5]">

                                {vehicle.images?.length > 0 ? (

                                  <img
                                    src={
                                      vehicle.images.find(
                                        (image) =>
                                          image.is_primary
                                      )?.image_url ??
                                      vehicle.images[0]?.image_url
                                    }
                                    alt={vehicle.name}
                                    className="h-full w-full object-contain p-1"
                                  />

                                ) : (

                                  <span className="text-2xl">
                                    🛺
                                  </span>

                                )}

                              </div>


                              <div>

                                <p className="font-semibold text-[#123C35]">
                                  {vehicle.name}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  {vehicle.model}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* BRAND */}

                          <td className="px-6 py-5 text-sm font-medium text-gray-600">
                            {vehicle.brand}
                          </td>


                          {/* PRICE */}

                          <td className="px-6 py-5 text-sm font-semibold text-[#0F5C4D]">
                            {formatPrice(
                              vehicle.price
                            )}
                          </td>


                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                                vehicle.is_available
                                  ? "bg-[#E6F3ED] text-[#0F5C4D]"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {vehicle.is_available
                                ? isHindi
                                  ? "उपलब्ध"
                                  : "Available"
                                : isHindi
                                  ? "अनुपलब्ध"
                                  : "Unavailable"}
                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="px-6 py-5">

                            <Link
                              to={`/manager/vehicles/${vehicle.id}/edit`}
                              className="text-sm font-semibold text-[#0F5C4D] hover:underline"
                            >
                              {isHindi
                                ? "एडिट"
                                : "Edit"}
                            </Link>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}


            {/* MOBILE LIST */}

            {recentVehicles.length > 0 && (
              <div className="divide-y divide-gray-100 md:hidden">

                {recentVehicles.map(
                  (vehicle) => (

                    <div
                      key={vehicle.id}
                      className="p-5"
                    >

                      <div className="flex gap-4">

                        {/* IMAGE */}

                        <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F4F8F5]">

                          {vehicle.images?.length > 0 ? (

                            <img
                              src={
                                vehicle.images.find(
                                  (image) =>
                                    image.is_primary
                                )?.image_url ??
                                vehicle.images[0]?.image_url
                              }
                              alt={vehicle.name}
                              className="h-full w-full object-contain p-2"
                            />

                          ) : (

                            <span className="text-3xl">
                              🛺
                            </span>

                          )}

                        </div>


                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <h3 className="truncate font-bold text-[#123C35]">
                                {vehicle.name}
                              </h3>

                              <p className="mt-1 text-xs text-gray-400">
                                {vehicle.brand}{" "}
                                •{" "}
                                {vehicle.model}
                              </p>

                            </div>


                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                vehicle.is_available
                                  ? "bg-[#E6F3ED] text-[#0F5C4D]"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {vehicle.is_available
                                ? isHindi
                                  ? "उपलब्ध"
                                  : "Available"
                                : isHindi
                                  ? "अनुपलब्ध"
                                  : "Unavailable"}
                            </span>

                          </div>


                          <p className="mt-3 text-sm font-bold text-[#0F5C4D]">
                            {formatPrice(
                              vehicle.price
                            )}
                          </p>

                        </div>

                      </div>


                      <Link
                        to={`/manager/vehicles/${vehicle.id}/edit`}
                        className="mt-4 block rounded-full border border-gray-200 py-2.5 text-center text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#F4F8F5]"
                      >
                        {isHindi
                          ? "वाहन एडिट करें"
                          : "Edit Vehicle"}
                      </Link>

                    </div>

                  )
                )}

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
};


export default ManagerDashboard;