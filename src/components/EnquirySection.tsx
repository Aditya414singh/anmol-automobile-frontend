import {
  useState,
} from "react";
import type {
  FormEvent,
} from "react";

import axios from "axios";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  webUtilsApi,
} from "../api/webUtilsApi";


const EnquirySection = () => {

  const {
    language,
  } = useLanguage();


  const isHindi =
    language === "hi";


  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [
    name,
    setName,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    vehicle,
    setVehicle,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");


  // ==========================================================
  // UI STATE
  // ==========================================================

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    // Don't allow another submission
    // while current request is running.

    if (submitting) {
      return;
    }


    setSuccess(false);
    setError("");


    // ========================================================
    // CLEAN VALUES
    // ========================================================

    const trimmedName =
      name.trim();

    const trimmedPhone =
      phone.trim();

    const trimmedVehicle =
      vehicle.trim();

    const trimmedMessage =
      message.trim();


    // ========================================================
    // FRONTEND VALIDATION
    // ========================================================

    if (trimmedName.length < 2) {

      setError(
        isHindi
          ? "कृपया अपना सही नाम दर्ज करें।"
          : "Please enter a valid name."
      );

      return;
    }


    if (
      !/^[0-9]{10}$/.test(
        trimmedPhone
      )
    ) {

      setError(
        isHindi
          ? "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit phone number."
      );

      return;
    }


    if (trimmedMessage.length < 5) {

      setError(
        isHindi
          ? "कृपया अपनी जानकारी या सवाल लिखें।"
          : "Please enter a meaningful message."
      );

      return;
    }


    // ========================================================
    // SEND REQUEST
    // ========================================================

    try {

      setSubmitting(true);


      const response =
        await webUtilsApi.submitEnquiry({

          customer_name:
            trimmedName,

          phone:
            trimmedPhone,

          vehicle:
            trimmedVehicle,

          message:
            trimmedMessage,

        });


      // ======================================================
      // BACKEND FAILURE
      // ======================================================

      if (!response.success) {

        throw new Error(
          response.message ||
          "Unable to submit enquiry."
        );
      }


      // ======================================================
      // SUCCESS
      // ======================================================

      setSuccess(true);

      setName("");
      setPhone("");
      setVehicle("");
      setMessage("");


    } catch (err) {

      console.error(
        "Failed to submit enquiry:",
        err
      );


      // ======================================================
      // AXIOS ERROR
      // ======================================================

      if (
        axios.isAxiosError(err)
      ) {

        const statusCode =
          err.response?.status;

        const backendMessage =
          err.response?.data?.message;


        // ----------------------------------------------------
        // RATE LIMIT
        // ----------------------------------------------------

        if (
          statusCode === 429
        ) {

          setError(
            backendMessage ||
            (
              isHindi
                ? "आपने enquiry की अधिकतम सीमा पूरी कर ली है। कृपया बाद में फिर कोशिश करें।"
                : "You have reached the enquiry limit. Please try again later."
            )
          );

          return;
        }


        // ----------------------------------------------------
        // VALIDATION ERROR
        // ----------------------------------------------------

        if (
          statusCode === 400
        ) {

          setError(
            backendMessage ||
            (
              isHindi
                ? "कृपया अपनी जानकारी सही से भरें।"
                : "Please check your information and try again."
            )
          );

          return;
        }


        // ----------------------------------------------------
        // SERVER ERROR
        // ----------------------------------------------------

        if (
          statusCode &&
          statusCode >= 500
        ) {

          setError(
            isHindi
              ? "सर्वर में समस्या है। कृपया थोड़ी देर बाद फिर कोशिश करें।"
              : "There is a server problem. Please try again later."
          );

          return;
        }


        // ----------------------------------------------------
        // OTHER API ERROR
        // ----------------------------------------------------

        setError(
          backendMessage ||
          (
            isHindi
              ? "आपकी enquiry भेजी नहीं जा सकी। कृपया फिर कोशिश करें।"
              : "We couldn't submit your enquiry. Please try again."
          )
        );

        return;
      }


      // ======================================================
      // UNKNOWN ERROR
      // ======================================================

      setError(
        isHindi
          ? "कुछ गलत हो गया। कृपया बाद में फिर कोशिश करें।"
          : "Something went wrong. Please try again later."
      );

    } finally {

      setSubmitting(false);

    }

  };


  return (

    <section
      id="contact"
      className="bg-[#123C35] px-4 py-20 sm:px-6 lg:px-8"
    >

      <div
        className="mx-auto max-w-7xl"
      >

        <div
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >

          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <div
            className="max-w-xl"
          >

            {/* BADGE */}

            <div
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2"
            >

              <span
                className="h-2 w-2 rounded-full bg-[#5AD6B1]"
              />

              <span
                className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80"
              >
                {isHindi
                  ? "संपर्क करें"
                  : "Get In Touch"}
              </span>

            </div>


            {/* TITLE */}

            <h2
              className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            >

              {isHindi
                ? "ई-रिक्शा खरीदने की सोच रहे हैं?"
                : "Looking for the right e-rickshaw?"}

            </h2>


            {/* DESCRIPTION */}

            <p
              className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg"
            >

              {isHindi
                ? "अपनी जरूरत बताएं। हमारी टीम आपसे संपर्क करके सही मॉडल और कीमत की जानकारी देगी।"
                : "Tell us what you need. Our team will get in touch with you and help you choose the right model and pricing."}

            </p>


            {/* INFO */}

            <div
              className="mt-8 space-y-4"
            >

              {/* CONTACT */}

              <div
                className="flex items-center gap-3"
              >

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"
                >
                  📞
                </div>


                <div>

                  <p
                    className="text-xs text-white/50"
                  >
                    {isHindi
                      ? "त्वरित संपर्क"
                      : "Quick Contact"}
                  </p>

                  <p
                    className="mt-0.5 text-sm font-semibold text-white"
                  >
                    {isHindi
                      ? "हमारी टीम जल्द संपर्क करेगी"
                      : "Our team will contact you soon"}
                  </p>

                </div>

              </div>


              {/* VEHICLE */}

              <div
                className="flex items-center gap-3"
              >

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10"
                >
                  🛺
                </div>


                <div>

                  <p
                    className="text-xs text-white/50"
                  >
                    {isHindi
                      ? "मॉडल की जानकारी"
                      : "Model Information"}
                  </p>

                  <p
                    className="mt-0.5 text-sm font-semibold text-white"
                  >
                    {isHindi
                      ? "कीमत और फीचर्स की जानकारी पाएं"
                      : "Get pricing and vehicle details"}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              FORM CARD
          ================================================== */}

          <div
            className="rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
          >

            {/* HEADER */}

            <div>

              <h3
                className="text-2xl font-bold text-[#123C35]"
              >
                {isHindi
                  ? "अपनी जानकारी भेजें"
                  : "Send Your Enquiry"}
              </h3>


              <p
                className="mt-2 text-sm text-gray-500"
              >
                {isHindi
                  ? "हमारी टीम आपसे जल्द संपर्क करेगी।"
                  : "Our team will get back to you soon."}
              </p>

            </div>


            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {success && (

              <div
                className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4"
              >

                <div
                  className="flex gap-3"
                >

                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700"
                  >
                    ✓
                  </div>


                  <div>

                    <p
                      className="font-semibold text-green-800"
                    >
                      {isHindi
                        ? "जानकारी सफलतापूर्वक भेजी गई!"
                        : "Enquiry submitted successfully!"}
                    </p>


                    <p
                      className="mt-1 text-sm leading-6 text-green-700"
                    >
                      {isHindi
                        ? "धन्यवाद! हमारी टीम जल्द ही आपसे संपर्क करेगी।"
                        : "Thank you! Our team will contact you shortly."}
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (

              <div
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4"
              >

                <div
                  className="flex gap-3"
                >

                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-700"
                  >
                    !
                  </div>


                  <p
                    className="text-sm leading-6 text-red-700"
                  >
                    {error}
                  </p>

                </div>

              </div>

            )}


            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="enquiry-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >

                  {isHindi
                    ? "आपका नाम"
                    : "Your Name"}

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>


                <input
                  id="enquiry-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "अपना नाम दर्ज करें"
                      : "Enter your name"
                  }
                  disabled={submitting}
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

              </div>


              {/* PHONE */}

              <div>

                <label
                  htmlFor="enquiry-phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >

                  {isHindi
                    ? "मोबाइल नंबर"
                    : "Phone Number"}

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>


                <input
                  id="enquiry-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => {

                    const value =
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                    setPhone(value);

                  }}
                  placeholder="9876543210"
                  disabled={submitting}
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

              </div>


              {/* VEHICLE */}

              <div>

                <label
                  htmlFor="enquiry-vehicle"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >

                  {isHindi
                    ? "वाहन"
                    : "Vehicle"}

                  <span
                    className="ml-1 text-xs font-normal text-gray-400"
                  >
                    (
                    {isHindi
                      ? "वैकल्पिक"
                      : "optional"}
                    )
                  </span>

                </label>


                <input
                  id="enquiry-vehicle"
                  type="text"
                  value={vehicle}
                  onChange={(event) =>
                    setVehicle(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "किस मॉडल में रुचि है?"
                      : "Which model are you interested in?"
                  }
                  disabled={submitting}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

              </div>


              {/* MESSAGE */}

              <div>

                <label
                  htmlFor="enquiry-message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >

                  {isHindi
                    ? "आपका सवाल"
                    : "Your Message"}

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>


                <textarea
                  id="enquiry-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "आप किस जानकारी की तलाश में हैं?"
                      : "What would you like to know?"
                  }
                  disabled={submitting}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F5C4D] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B493D] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >

                {submitting ? (

                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    />

                    {isHindi
                      ? "भेजा जा रहा है..."
                      : "Submitting..."}
                  </>

                ) : (

                  <>
                    {isHindi
                      ? "जानकारी भेजें"
                      : "Send Enquiry"}

                    <span>
                      →
                    </span>
                  </>

                )}

              </button>


              {/* PRIVACY */}

              <p
                className="text-center text-xs leading-5 text-gray-400"
              >
                {isHindi
                  ? "आपकी जानकारी केवल आपकी enquiry का जवाब देने के लिए उपयोग की जाएगी।"
                  : "Your information will only be used to respond to your enquiry."}
              </p>

            </form>

          </div>

        </div>

      </div>

    </section>

  );
};


export default EnquirySection;