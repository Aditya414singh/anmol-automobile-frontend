import { Link, useNavigate } from "react-router-dom";
import type { Vehicle } from "../types/vehicle";
import { useLanguage } from "../context/LanguageContext";
import { getOptimizedCloudinaryUrl } from "../utils/cloudinary";


interface VehicleCardProps {
  vehicle: Vehicle;
}


const VehicleCard = ({
  vehicle,
}: VehicleCardProps) => {
  const { language, t } = useLanguage();

  const navigate = useNavigate();


  const imageUrl =
    vehicle.images?.find(
      (image) => image.is_primary
    )?.image_url ??
    vehicle.images?.[0]?.image_url;


  const optimizedImageUrl =
    imageUrl
      ? getOptimizedCloudinaryUrl(
          imageUrl,
          800
        )
      : undefined;


  const formattedPrice =
    Number(vehicle.price).toLocaleString(
      "en-IN"
    );


  const handleCardClick = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };


  return (
    <article
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          handleCardClick();
        }
      }}
      className="group flex min-w-0 w-full h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F8B6D] focus:ring-offset-2 sm:rounded-3xl"
    >

      {/* ==================================================
          IMAGE
      ================================================== */}

      <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F8F5]">

        {optimizedImageUrl ? (
          <img
            src={optimizedImageUrl}
            alt={vehicle.name}
            loading="lazy"
            className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105 sm:p-7"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">

              <div className="text-6xl">
                🛺
              </div>

              <p className="mt-3 text-sm text-gray-500">
                {language === "hi"
                  ? "अनमोल ई-रिक्शा"
                  : "Anmol E-Rickshaw"}
              </p>

            </div>
          </div>
        )}


        {/* ==================================================
            AVAILABILITY
        ================================================== */}

        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur ${
              vehicle.is_available
                ? "bg-white/95 text-[#0F5C4D]"
                : "bg-gray-900/90 text-white"
            }`}
          >

            <span
              className={`h-1.5 w-1.5 rounded-full ${
                vehicle.is_available
                  ? "bg-[#159A75]"
                  : "bg-gray-400"
              }`}
            />

            {vehicle.is_available
              ? t.vehicles.available
              : t.vehicles.unavailable}

          </span>
        </div>


        {/* ==================================================
            VEHICLE TYPE
        ================================================== */}

        <div className="absolute right-4 top-4">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm backdrop-blur">
            {vehicle.vehicle_type.replaceAll(
              "_",
              " "
            )}
          </span>
        </div>

      </div>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* Brand */}

        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0F8B6D]">
          {vehicle.brand}
        </p>


        {/* Name */}

        <h3 className="mt-2 min-h-[3.5rem] line-clamp-2 text-xl font-bold leading-7 text-[#123C35]">
          {vehicle.name}
        </h3>


        {/* Model */}

        <p className="mt-1 text-sm text-gray-500">
          {vehicle.model}
        </p>


        {/* ==================================================
            SPECIFICATIONS
        ================================================== */}

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-gray-100 py-4">

          {/* Battery */}

          <div>
            <p className="text-xs text-gray-400">
              {language === "hi"
                ? "बैटरी"
                : "Battery"}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-gray-700">
              {vehicle.battery_capacity}
            </p>
          </div>


          {/* Range */}

          <div>
            <p className="text-xs text-gray-400">
              {language === "hi"
                ? "रेंज"
                : "Range"}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {vehicle.range_km} km
            </p>
          </div>


          {/* Seating */}

          <div>
            <p className="text-xs text-gray-400">
              {language === "hi"
                ? "सीट क्षमता"
                : "Seating"}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {vehicle.seating_capacity}
            </p>
          </div>


          {/* Speed */}

          <div>
            <p className="text-xs text-gray-400">
              {language === "hi"
                ? "अधिकतम गति"
                : "Top Speed"}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {vehicle.top_speed} km/h
            </p>
          </div>

        </div>


        {/* ==================================================
            PRICE + CTA
        ================================================== */}

        <div className="mt-auto pt-5">

          <div className="flex items-end justify-between gap-4">

            {/* Price */}

            <div>

              <p className="text-xs text-gray-400">
                {t.vehicles.startingFrom}
              </p>

              <p className="mt-1 text-xl font-bold text-[#0F5C4D]">
                ₹{formattedPrice}
              </p>

            </div>


            {/* Details */}

            <Link
              to={`/vehicles/${vehicle.id}`}
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F5C4D] px-4 py-2.5 text-xs font-semibold text-white transition duration-300 hover:bg-[#0B493D] sm:px-5 sm:text-sm"
            >

              {t.vehicles.viewDetails}

              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>

            </Link>

          </div>

        </div>

      </div>

    </article>
  );
};


export default VehicleCard;