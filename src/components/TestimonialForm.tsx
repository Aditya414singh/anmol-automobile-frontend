import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import type { Vehicle } from "../types/vehicle";

import {
  webUtilsApi,
} from "../api/webUtilsApi";

import {
  useLanguage,
} from "../context/LanguageContext";


const TestimonialForm = () => {
  const { t } = useLanguage();

  const [customerName, setCustomerName] =
    useState("");

  const [customerLocation, setCustomerLocation] =
    useState("");

  const [review, setReview] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [vehicleId, setVehicleId] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [loadingVehicles, setLoadingVehicles] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");


  // ==========================================================
  // LOAD VEHICLES
  // ==========================================================

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data =
          await webUtilsApi.getVehicles();

        setVehicles(data);
      } catch (error) {
        console.error(
          "Failed to load vehicles:",
          error
        );
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, []);


  // ==========================================================
  // IMAGE CHANGE
  // ==========================================================

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setImage(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage(
        t.testimonials.invalidImage
      );

      setImage(null);
      return;
    }

    // Maximum 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage(
        t.testimonials.imageTooLarge
      );

      setImage(null);
      return;
    }

    setErrorMessage("");
    setImage(selectedFile);
  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");


    if (!customerName.trim()) {
      setErrorMessage(
        t.testimonials.nameRequired
      );

      return;
    }


    if (!review.trim()) {
      setErrorMessage(
        t.testimonials.reviewRequired
      );

      return;
    }


    if (rating < 1 || rating > 5) {
      setErrorMessage(
        t.testimonials.ratingRequired
      );

      return;
    }


    try {
      setSubmitting(true);

      await webUtilsApi.submitTestimonial({
        customer_name:
          customerName.trim(),

        customer_location:
          customerLocation.trim(),

        review:
          review.trim(),

        rating,

        vehicle:
          vehicleId || undefined,

        customer_image:
          image,
      });


      // Clear form
      setCustomerName("");
      setCustomerLocation("");
      setReview("");
      setRating(5);
      setVehicleId("");
      setImage(null);


      setSuccessMessage(
        t.testimonials.success
      );

    } catch (error: any) {
      console.error(
        "Failed to submit testimonial:",
        error
      );


      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        t.testimonials.submitError;


      setErrorMessage(message);

    } finally {
      setSubmitting(false);
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section
      id="share-experience"
      className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8"
    >

      <div className="mx-auto max-w-3xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-10 text-center">

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            {t.testimonials.shareBadge}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t.testimonials.shareTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            {t.testimonials.shareDescription}
          </p>

        </div>


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >

          {/* ==================================================
              NAME + LOCATION
          ================================================== */}

          <div className="grid gap-5 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t.testimonials.name} *
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(
                    event.target.value
                  )
                }
                placeholder={t.testimonials.name}
                maxLength={150}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t.testimonials.location}
              </label>

              <input
                type="text"
                value={customerLocation}
                onChange={(event) =>
                  setCustomerLocation(
                    event.target.value
                  )
                }
                placeholder={t.testimonials.location}
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />

            </div>

          </div>


          {/* ==================================================
              VEHICLE
          ================================================== */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t.testimonials.vehicle}
            </label>

            <select
              value={vehicleId}
              onChange={(event) =>
                setVehicleId(
                  event.target.value
                )
              }
              disabled={loadingVehicles}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
            >

              <option value="">
                {t.testimonials.generalExperience}
              </option>

              {vehicles.map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.name}
                </option>
              ))}

            </select>

            {loadingVehicles && (
              <p className="mt-1 text-xs text-gray-400">
                {t.testimonials.loadingVehicles}
              </p>
            )}

          </div>


          {/* ==================================================
              RATING
          ================================================== */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t.testimonials.rating} *
            </label>

            <div className="flex gap-1">

              {[1, 2, 3, 4, 5].map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setRating(value)
                    }
                    className={`text-3xl transition ${
                      value <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    aria-label={`${t.testimonials.rating} ${value}`}
                  >
                    ★
                  </button>
                )
              )}

            </div>

          </div>


          {/* ==================================================
              REVIEW
          ================================================== */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t.testimonials.review} *
            </label>

            <textarea
              value={review}
              onChange={(event) =>
                setReview(
                  event.target.value
                )
              }
              placeholder={
                t.testimonials.reviewPlaceholder
              }
              rows={5}
              maxLength={1000}
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {review.length}/1000
            </p>

          </div>


          {/* ==================================================
              IMAGE
          ================================================== */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-gray-700">

              {t.testimonials.photo}

              <span className="ml-1 font-normal text-gray-400">
                {t.testimonials.optional}
              </span>

            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
            />

            <p className="mt-1 text-xs text-gray-400">
              {t.testimonials.photoHelp}
            </p>


            {image && (
              <p className="mt-2 text-sm text-gray-600">
                {t.testimonials.selected}:{" "}
                {image.name}
              </p>
            )}

          </div>


          {/* ==================================================
              ERROR
          ================================================== */}

          {errorMessage && (
            <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}


          {/* ==================================================
              SUCCESS
          ================================================== */}

          {successMessage && (
            <div className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}


          {/* ==================================================
              SUBMIT
          ================================================== */}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? t.testimonials.submitting
              : t.testimonials.submit}
          </button>

        </form>

      </div>

    </section>
  );
};


export default TestimonialForm;