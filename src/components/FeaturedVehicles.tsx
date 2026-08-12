import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { webUtilsApi } from "../api/webUtilsApi";
import type { Vehicle } from "../types/vehicle";
import VehicleCard from "./VehicleCard";

const FeaturedVehicles = () => {
  const { language, t } = useLanguage();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadVehicles = async () => {
      try {
        setLoading(true);
        setError(false);

        const vehicleList = await webUtilsApi.getVehicles();

        if (cancelled) {
          return;
        }

        const availableVehicles = vehicleList.filter(
          (vehicle) => vehicle.is_available
        );

        const featuredVehicles =
          availableVehicles.length > 0
            ? availableVehicles
            : vehicleList;

        setVehicles(featuredVehicles.slice(0, 4));
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load featured vehicles:",
            error
          );

          setError(true);
          setVehicles([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-[#F8FAF9] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#159A75]" />

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
                {language === "hi"
                  ? "हमारे मॉडल"
                  : "Our Models"}
              </p>
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl lg:text-5xl">
              {t.vehicles.title}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              {t.vehicles.description}
            </p>
          </div>

          <a
            href="/vehicles"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#0F5C4D] px-5 py-2.5 text-sm font-semibold text-[#0F5C4D] transition duration-300 hover:bg-[#0F5C4D] hover:text-white"
          >
            {language === "hi"
              ? "सभी ई-रिक्शा देखें"
              : "View All E-Rickshaws"}

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Image */}
                <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                {/* Content */}
                <div className="space-y-4 p-5 sm:p-6">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

                  <div className="h-6 w-4/5 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 animate-pulse rounded bg-gray-100" />
                    <div className="h-12 animate-pulse rounded bg-gray-100" />
                    <div className="h-12 animate-pulse rounded bg-gray-100" />
                    <div className="h-12 animate-pulse rounded bg-gray-100" />
                  </div>

                  <div className="h-10 animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-12 rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
              !
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#123C35]">
              {language === "hi"
                ? "ई-रिक्शा की जानकारी लोड नहीं हो सकी"
                : "Unable to load vehicles"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {language === "hi"
                ? "कृपया थोड़ी देर बाद फिर कोशिश करें।"
                : "Please try again in a moment."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
            >
              {language === "hi"
                ? "फिर कोशिश करें"
                : "Try Again"}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="mt-12 rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F3ED] text-3xl">
              🛺
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#123C35]">
              {language === "hi"
                ? "अभी कोई ई-रिक्शा उपलब्ध नहीं है।"
                : "No vehicles available right now."}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {language === "hi"
                ? "कृपया बाद में फिर देखें।"
                : "Please check back later."}
            </p>
          </div>
        )}

        {/* Vehicle Grid */}
        {!loading && !error && vehicles.length > 0 && (
          <>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-gray-500">
                {language === "hi"
                  ? "अपने लिए सही ई-रिक्शा खोजें"
                  : "Find the right e-rickshaw for your needs"}
              </p>

              <a
                href="/vehicles"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0F5C4D] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#0B493D] hover:shadow-lg"
              >
                {language === "hi"
                  ? "सभी मॉडल देखें"
                  : "Explore All Models"}

                <span>→</span>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;