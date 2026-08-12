import {
  useEffect,
  useState,
} from "react";

import {
  webUtilsApi,
} from "../api/webUtilsApi";

import type {
  Testimonial,
} from "../api/webUtilsApi";

import {
  useLanguage,
} from "../context/LanguageContext";


const MAX_TESTIMONIALS = 6;


const Testimonials = () => {
  const { t } = useLanguage();

  const [testimonials, setTestimonials] =
    useState<Testimonial[]>([]);

  const [loading, setLoading] =
    useState(true);


  // ==========================================================
  // LOAD TESTIMONIALS
  // ==========================================================

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);

        const data =
          await webUtilsApi.getTestimonials();

        /*
         * Public API should already return published
         * testimonials, but we filter here as an
         * additional safety layer.
         */

        const publishedTestimonials =
          data.filter(
            (testimonial) =>
              testimonial.is_published
          );


        /*
         * Featured testimonials first.
         *
         * Inside each group, latest testimonials
         * appear first.
         */

        const sortedTestimonials =
          [...publishedTestimonials].sort(
            (a, b) => {

              // Featured first
              if (
                a.is_featured !==
                b.is_featured
              ) {
                return a.is_featured
                  ? -1
                  : 1;
              }


              // Latest first
              return (
                new Date(
                  b.created_at
                ).getTime() -
                new Date(
                  a.created_at
                ).getTime()
              );
            }
          );


        /*
         * Show maximum 6 testimonials
         * on the homepage.
         */

        setTestimonials(
          sortedTestimonials.slice(
            0,
            MAX_TESTIMONIALS
          )
        );

      } catch (error) {
        console.error(
          "Failed to load testimonials:",
          error
        );

      } finally {
        setLoading(false);
      }
    };


    loadTestimonials();

  }, []);


  // ==========================================================
  // HIDE SECTION IF NO APPROVED REVIEWS
  // ==========================================================

  if (
    !loading &&
    testimonials.length === 0
  ) {
    return null;
  }


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-10 text-center">

          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            {t.testimonials.badge}
          </p>


          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {t.testimonials.title}
          </h2>


          <p className="mx-auto mt-3 max-w-xl text-gray-600">
            {t.testimonials.description}
          </p>

        </div>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl bg-gray-200"
                />

              )
            )}

          </div>

        ) : (

          /* ==================================================
             TESTIMONIAL CARDS
             ================================================== */

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {testimonials.map(
              (testimonial) => (

                <article
                  key={testimonial.id}
                  className="relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >

                  {/* ==================================================
                      FEATURED BADGE
                  ================================================== */}

                  {testimonial.is_featured && (

                    <div className="absolute right-5 top-5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                      ★{" "}
                      {t.testimonials.featured}
                    </div>

                  )}


                  {/* ==================================================
                      RATING
                  ================================================== */}

                  <div
                    className="flex gap-1 text-lg"
                    aria-label={`${testimonial.rating} ${t.testimonials.rating}`}
                  >

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <span
                          key={star}
                          className={
                            star <=
                            testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>

                      )
                    )}

                  </div>


                  {/* ==================================================
                      REVIEW
                  ================================================== */}

                  <p className="mt-4 flex-1 leading-7 text-gray-700">
                    "{testimonial.review}"
                  </p>


                  {/* ==================================================
                      CUSTOMER
                  ================================================== */}

                  <div className="mt-6 flex items-center gap-3">

                    {testimonial.customer_image_url ? (

                      <img
                        src={
                          testimonial.customer_image_url
                        }
                        alt={
                          testimonial.customer_name
                        }
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />

                    ) : (

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
                        {testimonial.customer_name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                    )}


                    <div className="min-w-0">

                      <p className="truncate font-semibold text-gray-900">
                        {
                          testimonial.customer_name
                        }
                      </p>


                      {testimonial.customer_location && (

                        <p className="truncate text-sm text-gray-500">
                          {
                            testimonial.customer_location
                          }
                        </p>

                      )}

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
};


export default Testimonials;