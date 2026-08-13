import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { webUtilsApi } from "../api/webUtilsApi";
import type { Vehicle } from "../types/vehicle";
import { useLanguage } from "../context/LanguageContext";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;

    const loadVehicle = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await webUtilsApi.getVehicleById(id);

        if (!cancelled) {
          setVehicle(data);
          setSelectedImage(0);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load vehicle:", err);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVehicle();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAF9]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded bg-gray-200" />

            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div>
                <div className="aspect-[4/3] rounded-3xl bg-gray-200" />

                <div className="mt-4 flex gap-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-20 w-20 rounded-xl bg-gray-200"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-10 w-3/4 rounded bg-gray-200" />
                <div className="h-6 w-32 rounded bg-gray-200" />
                <div className="h-10 w-40 rounded bg-gray-200" />
                <div className="h-32 rounded-2xl bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error / not found
  if (error || !vehicle) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8FAF9] px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">🛺</div>

          <h1 className="mt-5 text-2xl font-bold text-[#123C35]">
            {language === "hi"
              ? "वाहन नहीं मिला"
              : "Vehicle Not Found"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {language === "hi"
              ? "यह वाहन उपलब्ध नहीं है।"
              : "This vehicle could not be found."}
          </p>

          <Link
            to="/vehicles"
            className="mt-6 inline-flex rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
          >
            {language === "hi"
              ? "सभी वाहन देखें"
              : "View All Vehicles"}
          </Link>
        </div>
      </main>
    );
  }

  const images = vehicle.images ?? [];

  const activeImage = images[selectedImage]?.image_url;

  const formattedPrice = Number(vehicle.price).toLocaleString("en-IN");

  return (
    <main className="min-h-screen bg-[#F8FAF9]">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-gray-400 transition hover:text-[#0F5C4D]"
            >
              {language === "hi" ? "होम" : "Home"}
            </Link>

            <span className="text-gray-300">/</span>

            <Link
              to="/vehicles"
              className="text-gray-400 transition hover:text-[#0F5C4D]"
            >
              {language === "hi"
                ? "ई-रिक्शा"
                : "E-Rickshaws"}
            </Link>

            <span className="text-gray-300">/</span>

            <span className="truncate font-medium text-[#123C35]">
              {vehicle.model}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

            {/* ================= IMAGE SECTION ================= */}
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-sm">

                {activeImage ? (
                  <img
                    src={getOptimizedCloudinaryUrl(activeImage,1200)}
                      alt={vehicle.name}
                      className="h-full w-full object-contain p-6 sm:p-10"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl">🛺</div>

                      <p className="mt-4 text-sm text-gray-500">
                        Anmol E-Rickshaw
                      </p>
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="absolute left-5 top-5">
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm ${
                      vehicle.is_available
                        ? "bg-white text-[#0F5C4D]"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {vehicle.is_available
                      ? language === "hi"
                        ? "उपलब्ध"
                        : "Available"
                      : language === "hi"
                      ? "उपलब्ध नहीं"
                      : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Image thumbnails */}
              {images.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition ${
                        selectedImage === index
                          ? "border-[#0F5C4D]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={getOptimizedCloudinaryUrl(
                            image.image_url,
                            200
                          )}
                          alt={`${vehicle.name} ${index + 1}`}
                          loading="lazy"
                          className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================= VEHICLE INFORMATION ================= */}
            <div className="flex flex-col justify-center">

              {/* Brand */}
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
                {vehicle.brand}
              </p>

              {/* Name */}
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#123C35] sm:text-5xl">
                {vehicle.name}
              </h1>

              {/* Model */}
              <p className="mt-3 text-lg text-gray-500">
                {vehicle.model}
              </p>

              {/* Price */}
              <div className="mt-7">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {language === "hi" ? "कीमत" : "Price"}
                </p>

                <p className="mt-1 text-3xl font-bold text-[#0F5C4D]">
                  ₹{formattedPrice}
                </p>
              </div>

              {/* Description */}
              {vehicle.description && (
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {vehicle.description}
                </p>
              )}

              {/* Quick specifications */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">

                <InfoBox
                  label={
                    language === "hi"
                      ? "बैटरी"
                      : "Battery"
                  }
                  value={vehicle.battery_capacity}
                  icon="🔋"
                />

                <InfoBox
                  label={
                    language === "hi"
                      ? "रेंज"
                      : "Range"
                  }
                  value={`${vehicle.range_km} km`}
                  icon="🛣️"
                />

                <InfoBox
                  label={
                    language === "hi"
                      ? "चार्जिंग"
                      : "Charging"
                  }
                  value={vehicle.charging_time}
                  icon="⚡"
                />

                <InfoBox
                  label={
                    language === "hi"
                      ? "सीट"
                      : "Seating"
                  }
                  value={vehicle.seating_capacity ?? "N/A"}
                  icon="👥"
                />

                <InfoBox
                  label={
                    language === "hi"
                      ? "पेलोड"
                      : "Payload"
                  }
                  value={vehicle.payload_capacity}
                  icon="📦"
                />

                <InfoBox
                  label={
                    language === "hi"
                      ? "अधिकतम गति"
                      : "Top Speed"
                  }
                  value={`${vehicle.top_speed} km/h`}
                  icon="🚀"
                />

              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/#enquiry"
                  className="flex-1 rounded-full bg-[#0F5C4D] px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#0B493D]"
                >
                  {language === "hi"
                    ? "जानकारी के लिए संपर्क करें"
                    : "Get a Quote"}
                </Link>

                <Link
                  to="/vehicles"
                  className="rounded-full border border-[#0F5C4D] px-7 py-4 text-center text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#0F5C4D] hover:text-white"
                >
                  {language === "hi"
                    ? "सभी वाहन"
                    : "All Vehicles"}
                </Link>
              </div>
            </div>
          </div>

          {/* ================= FULL SPECIFICATIONS ================= */}
          <div className="mt-16 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:mt-20">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
              {language === "hi"
                ? "विवरण"
                : "Specifications"}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#123C35] sm:text-3xl">
              {language === "hi"
                ? "वाहन की पूरी जानकारी"
                : "Vehicle Specifications"}
            </h2>

            <div className="mt-8 divide-y divide-gray-100">

              <SpecificationRow
                label={language === "hi" ? "ब्रांड" : "Brand"}
                value={vehicle.brand}
              />

              <SpecificationRow
                label={language === "hi" ? "मॉडल" : "Model"}
                value={vehicle.model}
              />

              <SpecificationRow
                label={
                  language === "hi"
                    ? "वाहन प्रकार"
                    : "Vehicle Type"
                }
                value={vehicle.vehicle_type.replace(/_/g, " ")}
              />

              <SpecificationRow
                label={
                  language === "hi"
                    ? "बैटरी क्षमता"
                    : "Battery Capacity"
                }
                value={vehicle.battery_capacity}
              />

              <SpecificationRow
                label={language === "hi" ? "रेंज" : "Range"}
                value={`${vehicle.range_km} km`}
              />

              <SpecificationRow
                label={
                  language === "hi"
                    ? "चार्जिंग समय"
                    : "Charging Time"
                }
                value={vehicle.charging_time}
              />

              <SpecificationRow
                label={
                  language === "hi"
                    ? "सीट क्षमता"
                    : "Seating Capacity"
                }
                value={vehicle.seating_capacity ?? "N/A"}
              />

              <SpecificationRow
                label={
                  language === "hi"
                    ? "पेलोड क्षमता"
                    : "Payload Capacity"
                }
                value={vehicle.payload_capacity}
              />

              <SpecificationRow
                label={
                  language === "hi"
                    ? "अधिकतम गति"
                    : "Top Speed"
                }
                value={`${vehicle.top_speed} km/h`}
              />

              {/* Dynamic specifications */}
              {Object.entries(vehicle.specifications ?? {}).map(
                ([key, value]) => (
                  <SpecificationRow
                    key={key}
                    label={key}
                    value={
                        typeof value === "string" ||
                        typeof value === "number"
                            ? value
                            : JSON.stringify(value)
                        }
                  />
                )
              )}

            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

interface InfoBoxProps {
  label: string;
  value: string | number;
  icon: string;
}

const InfoBox = ({
  label,
  value,
  icon,
}: InfoBoxProps) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="text-lg">{icon}</div>

      <p className="mt-2 text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#123C35]">
        {value}
      </p>
    </div>
  );
};

interface SpecificationRowProps {
  label: string;
  value: string | number;
}

const SpecificationRow = ({
  label,
  value,
}: SpecificationRowProps) => {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#123C35] sm:text-right">
        {value}
      </span>
    </div>
  );
};

export default VehicleDetails;