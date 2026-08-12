import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { webUtilsApi } from "../../api/webUtilsApi";
import type { Vehicle } from "../../types/vehicle";
import { useLanguage } from "../../context/LanguageContext";

const ManagerVehicles = () => {
  const { language } = useLanguage();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(false);

      const data = await webUtilsApi.getManagerVehicles();

      setVehicles(data);
    } catch (error) {
      console.error(
        "Failed to load manager vehicles:",
        error
      );

      setError(true);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (
    vehicle: Vehicle
  ) => {
    const confirmed = window.confirm(
      language === "hi"
        ? `क्या आप "${vehicle.name}" को हटाना चाहते हैं?`
        : `Are you sure you want to delete "${vehicle.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(vehicle.id);

      await webUtilsApi.deleteVehicle(
        vehicle.id
      );

      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (item) => item.id !== vehicle.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete vehicle:",
        error
      );

      window.alert(
        language === "hi"
          ? "वाहन हटाया नहीं जा सका। कृपया दोबारा कोशिश करें।"
          : "Unable to delete the vehicle. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      {/* Header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
                {language === "hi"
                  ? "मैनेजर"
                  : "Manager"}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl">
                {language === "hi"
                  ? "वाहन प्रबंधन"
                  : "Manage Vehicles"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                {language === "hi"
                  ? "अपने ई-रिक्शा मॉडल जोड़ें, अपडेट करें और प्रबंधित करें।"
                  : "Add, update and manage your e-rickshaw models."}
              </p>
            </div>

            <Link
              to="/manager/vehicles/add"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B493D] hover:shadow-md"
            >
              <span className="text-lg leading-none">
                +
              </span>

              {language === "hi"
                ? "वाहन जोड़ें"
                : "Add Vehicle"}
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          {!loading && !error && (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  {language === "hi"
                    ? "कुल वाहन"
                    : "Total Vehicles"}
                </p>

                <p className="mt-2 text-3xl font-bold text-[#123C35]">
                  {vehicles.length}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  {language === "hi"
                    ? "उपलब्ध"
                    : "Available"}
                </p>

                <p className="mt-2 text-3xl font-bold text-[#0F8B6D]">
                  {
                    vehicles.filter(
                      (vehicle) =>
                        vehicle.is_available
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  {language === "hi"
                    ? "अनुपलब्ध"
                    : "Unavailable"}
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-700">
                  {
                    vehicles.filter(
                      (vehicle) =>
                        !vehicle.is_available
                    ).length
                  }
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                    <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                      <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">
                ⚠️
              </div>

              <h2 className="mt-4 text-xl font-bold text-[#123C35]">
                {language === "hi"
                  ? "वाहन लोड नहीं हो सके"
                  : "Unable to load vehicles"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {language === "hi"
                  ? "कृपया दोबारा कोशिश करें।"
                  : "Please try again."}
              </p>

              <button
                type="button"
                onClick={loadVehicles}
                className="mt-6 rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
              >
                {language === "hi"
                  ? "फिर कोशिश करें"
                  : "Try Again"}
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            vehicles.length === 0 && (
              <div className="rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <div className="text-6xl">
                  🛺
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#123C35]">
                  {language === "hi"
                    ? "अभी कोई वाहन नहीं है"
                    : "No vehicles yet"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  {language === "hi"
                    ? "अपना पहला ई-रिक्शा मॉडल जोड़कर शुरुआत करें।"
                    : "Add your first e-rickshaw model to get started."}
                </p>

                <Link
                  to="/manager/vehicles/add"
                  className="mt-6 inline-flex rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
                >
                  {language === "hi"
                    ? "पहला वाहन जोड़ें"
                    : "Add First Vehicle"}
                </Link>
              </div>
            )}

          {/* Vehicle List */}
          {!loading &&
            !error &&
            vehicles.length > 0 && (
              <div className="space-y-5">
                {vehicles.map((vehicle) => {
                  const imageUrl =
                    vehicle.images?.find(
                      (image) =>
                        image.is_primary
                    )?.image_url ??
                    vehicle.images?.[0]
                      ?.image_url;

                  const formattedPrice =
                    Number(
                      vehicle.price
                    ).toLocaleString(
                      "en-IN"
                    );

                  const isDeleting =
                    deletingId ===
                    vehicle.id;

                  return (
                    <article
                      key={vehicle.id}
                      className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="grid lg:grid-cols-[220px_1fr_auto]">
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F8F5] lg:aspect-auto lg:min-h-[210px]">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                vehicle.name
                              }
                              className="h-full w-full object-contain p-6"
                            />
                          ) : (
                            <div className="flex h-full min-h-[210px] items-center justify-center">
                              <div className="text-center">
                                <div className="text-6xl">
                                  🛺
                                </div>

                                <p className="mt-2 text-xs text-gray-500">
                                  Anmol
                                  E-Rickshaw
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Availability */}
                          <div className="absolute left-4 top-4">
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                                vehicle.is_available
                                  ? "bg-white text-[#0F5C4D]"
                                  : "bg-gray-800 text-white"
                              }`}
                            >
                              {vehicle.is_available
                                ? language ===
                                  "hi"
                                  ? "उपलब्ध"
                                  : "Available"
                                : language ===
                                  "hi"
                                ? "अनुपलब्ध"
                                : "Unavailable"}
                            </span>
                          </div>
                        </div>

                        {/* Information */}
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-col gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F8B6D]">
                                {
                                  vehicle.brand
                                }
                              </p>

                              <h2 className="mt-2 text-xl font-bold text-[#123C35] sm:text-2xl">
                                {
                                  vehicle.name
                                }
                              </h2>

                              <p className="mt-1 text-sm text-gray-500">
                                {
                                  vehicle.model
                                }
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                              <div className="rounded-xl bg-[#F8FAF9] p-3">
                                <p className="text-[11px] text-gray-400">
                                  {language ===
                                  "hi"
                                    ? "कीमत"
                                    : "Price"}
                                </p>

                                <p className="mt-1 text-sm font-bold text-[#0F5C4D]">
                                  ₹
                                  {
                                    formattedPrice
                                  }
                                </p>
                              </div>

                              <div className="rounded-xl bg-[#F8FAF9] p-3">
                                <p className="text-[11px] text-gray-400">
                                  {language ===
                                  "hi"
                                    ? "बैटरी"
                                    : "Battery"}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-700">
                                  {
                                    vehicle.battery_capacity ||
                                      "-"
                                  }
                                </p>
                              </div>

                              <div className="rounded-xl bg-[#F8FAF9] p-3">
                                <p className="text-[11px] text-gray-400">
                                  {language ===
                                  "hi"
                                    ? "रेंज"
                                    : "Range"}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-700">
                                  {vehicle.range_km !=
                                  null
                                    ? `${vehicle.range_km} km`
                                    : "-"}
                                </p>
                              </div>

                              <div className="rounded-xl bg-[#F8FAF9] p-3">
                                <p className="text-[11px] text-gray-400">
                                  {language ===
                                  "hi"
                                    ? "सीट"
                                    : "Seating"}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-700">
                                  {vehicle.seating_capacity !=
                                  null
                                    ? vehicle.seating_capacity
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center border-t border-gray-100 p-5 sm:p-6 lg:border-l lg:border-t-0">
                          <div className="flex w-full flex-row gap-3 lg:w-auto lg:flex-col">
                            <Link
                              to={`/manager/vehicles/${vehicle.id}/edit`}
                              className="flex-1 rounded-full border border-[#0F5C4D] px-5 py-2.5 text-center text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#0F5C4D] hover:text-white lg:min-w-[110px]"
                            >
                              {language ===
                              "hi"
                                ? "संपादित करें"
                                : "Edit"}
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  vehicle
                                )
                              }
                              disabled={
                                isDeleting
                              }
                              className="flex-1 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 lg:min-w-[110px]"
                            >
                              {isDeleting
                                ? language ===
                                  "hi"
                                  ? "हटा रहे हैं..."
                                  : "Deleting..."
                                : language ===
                                  "hi"
                                ? "हटाएं"
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default ManagerVehicles;