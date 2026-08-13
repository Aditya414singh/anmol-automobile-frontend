import {
  useEffect,
  useState,
} from "react";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import type { Testimonial } from "../../api/webUtilsApi";

import {
  webUtilsApi,
} from "../../api/webUtilsApi";

import {
  useLanguage,
} from "../../context/LanguageContext";


const ManagerTestimonials = () => {
  const { t } = useLanguage();

  const [testimonials, setTestimonials] =
    useState<Testimonial[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processingId, setProcessingId] =
    useState<string | null>(null);


  // ==========================================================
  // LOAD TESTIMONIALS
  // ==========================================================

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await webUtilsApi.getManagerTestimonials();

      setTestimonials(data);
    } catch (error) {
      console.error(
        "Failed to load testimonials:",
        error
      );

      setError(
        "Unable to load testimonials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTestimonials();
  }, []);


  // ==========================================================
  // APPROVE
  // ==========================================================

  const handleApprove = async (
    testimonialId: string
  ) => {
    try {
      setProcessingId(testimonialId);

      await webUtilsApi.approveTestimonial(
        testimonialId,
        false
      );

      await loadTestimonials();
    } catch (error) {
      console.error(
        "Failed to approve testimonial:",
        error
      );

      setError(
        "Unable to approve testimonial. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };


  // ==========================================================
  // FEATURE / UNFEATURE
  // ==========================================================

  const handleToggleFeatured = async (
    testimonial: Testimonial
  ) => {
    try {
      setProcessingId(testimonial.id);

      await webUtilsApi.updateTestimonial(
        testimonial.id,
        {
          is_featured:
            !testimonial.is_featured,
        }
      );

      await loadTestimonials();
    } catch (error) {
      console.error(
        "Failed to update featured status:",
        error
      );

      setError(
        "Unable to update featured status. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    testimonial: Testimonial
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the testimonial from ${testimonial.customer_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(testimonial.id);

      await webUtilsApi.deleteTestimonial(
        testimonial.id
      );

      setTestimonials((current) =>
        current.filter(
          (item) =>
            item.id !== testimonial.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete testimonial:",
        error
      );

      setError(
        "Unable to delete testimonial. Please try again."
      );
    } finally {
      setProcessingId(null);
    }
  };


  // ==========================================================
  // COUNTS
  // ==========================================================

  const pendingTestimonials =
    testimonials.filter(
      (testimonial) =>
        !testimonial.is_published
    );

  const publishedTestimonials =
    testimonials.filter(
      (testimonial) =>
        testimonial.is_published
    );


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>


          <div className="grid gap-6 md:grid-cols-2">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}

          </div>

        </div>

      </main>
    );
  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                {t.manager.panel}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                Manage Testimonials
              </h1>

              <p className="mt-2 text-gray-600">
                Review customer feedback, approve testimonials and manage featured reviews.
              </p>

            </div>


            <button
              type="button"
              onClick={loadTestimonials}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Refresh
            </button>

          </div>


          {/* ==================================================
              STATS
          ================================================== */}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Total
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {testimonials.length}
              </p>

            </div>


            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="mt-1 text-3xl font-bold text-orange-600">
                {pendingTestimonials.length}
              </p>

            </div>


            <div className="rounded-xl bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Published
              </p>

              <p className="mt-1 text-3xl font-bold text-green-600">
                {publishedTestimonials.length}
              </p>

            </div>

          </div>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-semibold"
            >
              ×
            </button>

          </div>
        )}


        {/* ==================================================
            PENDING
        ================================================== */}

        <section>

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Pending Testimonials
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These reviews need to be approved before appearing publicly.
              </p>

            </div>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {pendingTestimonials.length}
            </span>

          </div>


          {pendingTestimonials.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

              <p className="font-medium text-gray-900">
                No pending testimonials
              </p>

              <p className="mt-1 text-sm text-gray-500">
                New customer reviews will appear here.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 lg:grid-cols-2">

              {pendingTestimonials.map(
                (testimonial) => (

                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    processing={
                      processingId === testimonial.id
                    }
                    onApprove={() =>
                      handleApprove(
                        testimonial.id
                      )
                    }
                    onToggleFeatured={() =>
                      handleToggleFeatured(
                        testimonial
                      )
                    }
                    onDelete={() =>
                      handleDelete(
                        testimonial
                      )
                    }
                  />

                )
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            PUBLISHED
        ================================================== */}

        <section className="mt-14">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Published Testimonials
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Reviews currently visible to website visitors.
              </p>

            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {publishedTestimonials.length}
            </span>

          </div>


          {publishedTestimonials.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

              <p className="font-medium text-gray-900">
                No published testimonials
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Approve a customer testimonial to publish it.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 lg:grid-cols-2">

              {publishedTestimonials.map(
                (testimonial) => (

                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    processing={
                      processingId === testimonial.id
                    }
                    onApprove={() => {}}
                    onToggleFeatured={() =>
                      handleToggleFeatured(
                        testimonial
                      )
                    }
                    onDelete={() =>
                      handleDelete(
                        testimonial
                      )
                    }
                  />

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
};


// ==========================================================
// TESTIMONIAL CARD
// ==========================================================

interface TestimonialCardProps {
  testimonial: Testimonial;
  processing: boolean;
  onApprove: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}


const TestimonialCard = ({
  testimonial,
  processing,
  onApprove,
  onToggleFeatured,
  onDelete,
}: TestimonialCardProps) => {

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

      <div className="p-6">

        {/* ==================================================
            CUSTOMER
        ================================================== */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            {testimonial.customer_image_url ? (

              <img
                  src={getOptimizedCloudinaryUrl(
                    testimonial.customer_image_url,
                    150
                  )}
                  alt={testimonial.customer_name}
                  loading="lazy"
                  className="h-14 w-14 rounded-full object-cover"
                />

            ) : (

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-700">
                {testimonial.customer_name
                  .charAt(0)
                  .toUpperCase()}
              </div>

            )}


            <div>

              <h3 className="font-semibold text-gray-900">
                {testimonial.customer_name}
              </h3>

              {testimonial.customer_location && (
                <p className="text-sm text-gray-500">
                  {testimonial.customer_location}
                </p>
              )}

            </div>

          </div>


          {/* ==================================================
              STATUS
          ================================================== */}

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              testimonial.is_published
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {testimonial.is_published
              ? "Published"
              : "Pending"}
          </span>

        </div>


        {/* ==================================================
            RATING
        ================================================== */}

        <div className="mt-5 flex items-center gap-1">

          {[1, 2, 3, 4, 5].map(
            (star) => (
              <span
                key={star}
                className={
                  star <= testimonial.rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              >
                ★
              </span>
            )
          )}

          <span className="ml-2 text-sm text-gray-500">
            {testimonial.rating}/5
          </span>

        </div>


        {/* ==================================================
            REVIEW
        ================================================== */}

        <p className="mt-4 leading-7 text-gray-700">
          "{testimonial.review}"
        </p>


        {/* ==================================================
            VEHICLE
        ================================================== */}

        {testimonial.vehicle && (
          <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Vehicle ID:{" "}
            <span className="font-medium text-gray-900">
              {testimonial.vehicle}
            </span>
          </div>
        )}


        {/* ==================================================
            FEATURED
        ================================================== */}

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

          <div>

            <p className="text-sm font-medium text-gray-700">
              Featured testimonial
            </p>

            <p className="text-xs text-gray-500">
              Featured reviews can be highlighted on the website.
            </p>

          </div>


          <button
            type="button"
            onClick={onToggleFeatured}
            disabled={processing}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              testimonial.is_featured
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {testimonial.is_featured
              ? "★ Featured"
              : "☆ Feature"}
          </button>

        </div>

      </div>


      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="flex flex-wrap gap-3 border-t border-gray-100 bg-gray-50 p-4">

        {!testimonial.is_published && (
          <button
            type="button"
            onClick={onApprove}
            disabled={processing}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing
              ? "Processing..."
              : "✓ Approve"}
          </button>
        )}


        <button
          type="button"
          onClick={onDelete}
          disabled={processing}
          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>

      </div>

    </article>
  );
};


export default ManagerTestimonials;