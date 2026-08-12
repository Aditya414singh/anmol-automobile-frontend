import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

interface EnquirySectionProps {
  vehicleName?: string;
}

const EnquirySection = ({
  vehicleName = "",
}: EnquirySectionProps) => {
  const { language } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState(vehicleName);
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Backend API will be connected here later.
    console.log({
      name,
      phone,
      vehicle,
      message,
    });

    setSubmitted(true);
  };

  return (
    <section
      id="enquiry"
      className="bg-[#F4F8F5] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
            {language === "hi"
              ? "संपर्क करें"
              : "Get In Touch"}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl lg:text-5xl">
            {language === "hi"
              ? "अपने लिए सही ई-रिक्शा चुनें"
              : "Find the Right E-Rickshaw for You"}
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            {language === "hi"
              ? "अपने सवाल या आवश्यकता हमारे साथ साझा करें। हमारी टीम आपसे जल्द संपर्क करेगी।"
              : "Tell us what you are looking for and our team will get in touch with you shortly."}
          </p>
        </div>

        {/* Enquiry Card */}
        <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl bg-white shadow-sm">

          <div className="grid lg:grid-cols-5">

            {/* ================================
                LEFT CONTACT INFORMATION
            ================================= */}
            <div className="bg-[#123C35] p-7 text-white sm:p-10 lg:col-span-2">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7AD6B7]">
                {language === "hi"
                  ? "अनमोल ऑटोमोबाइल्स"
                  : "Anmol Automobiles"}
              </p>

              <h3 className="mt-4 text-2xl font-bold sm:text-3xl">
                {language === "hi"
                  ? "हम आपकी मदद करने के लिए तैयार हैं।"
                  : "We're here to help you."}
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-300 sm:text-base">
                {language === "hi"
                  ? "वाहन की कीमत, रेंज, बैटरी या किसी अन्य जानकारी के लिए हमसे संपर्क करें।"
                  : "Contact us for vehicle pricing, range, battery details, availability, or any other information."}
              </p>

              {/* Contact Details */}
              <div className="mt-10 space-y-6">

                {/* Phone */}
                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                    ☎
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      {language === "hi"
                        ? "फोन"
                        : "Phone"}
                    </p>

                    <a
                      href="tel:+918299498824"
                      className="mt-1 block text-sm font-semibold transition hover:text-[#7AD6B7]"
                    >
                      +91 82994 98824
                    </a>
                  </div>

                </div>

                {/* Email */}
                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                    ✉
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">
                      {language === "hi"
                        ? "ईमेल"
                        : "Email"}
                    </p>

                    <a
                      href="mailto:anmolautomobile07@gmail.com"
                      className="mt-1 block break-all text-sm font-semibold transition hover:text-[#7AD6B7]"
                    >
                      anmolautomobile07@gmail.com
                    </a>
                  </div>

                </div>

                {/* Location */}
                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                    📍
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      {language === "hi"
                        ? "स्थान"
                        : "Location"}
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6">
                      Devraj Bramh Mod,
                      <br />
                      Bairiya, Ballia,
                      <br />
                      Uttar Pradesh
                    </p>
                  </div>

                </div>

              </div>

              {/* Bottom Note */}
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">

                <p className="text-xs leading-5 text-gray-300">
                  {language === "hi"
                    ? "हमारी टीम आपके वाहन से संबंधित सवालों और आवश्यकताओं में आपकी सहायता करेगी।"
                    : "Our team will help you with vehicle selection, pricing, availability, and other requirements."}
                </p>

              </div>

            </div>

            {/* ================================
                RIGHT ENQUIRY FORM
            ================================= */}
            <div className="p-7 sm:p-10 lg:col-span-3">

              {submitted ? (

                /* SUCCESS STATE */
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F3ED] text-2xl font-bold text-[#0F5C4D]">
                    ✓
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-[#123C35]">
                    {language === "hi"
                      ? "धन्यवाद!"
                      : "Thank You!"}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    {language === "hi"
                      ? "आपकी पूछताछ प्राप्त हो गई है। हमारी टीम जल्द ही आपसे संपर्क करेगी।"
                      : "Your enquiry has been received. Our team will contact you shortly."}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setVehicle(vehicleName);
                      setMessage("");
                    }}
                    className="mt-6 rounded-full border border-[#0F5C4D] px-6 py-3 text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#0F5C4D] hover:text-white"
                  >
                    {language === "hi"
                      ? "नई पूछताछ"
                      : "New Enquiry"}
                  </button>

                </div>

              ) : (

                /* FORM */
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* Name */}
                  <div>

                    <label
                      htmlFor="enquiry-name"
                      className="mb-2 block text-sm font-semibold text-[#123C35]"
                    >
                      {language === "hi"
                        ? "नाम"
                        : "Name"}
                    </label>

                    <input
                      id="enquiry-name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      required
                      placeholder={
                        language === "hi"
                          ? "अपना नाम दर्ज करें"
                          : "Enter your name"
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                    />

                  </div>

                  {/* Phone */}
                  <div>

                    <label
                      htmlFor="enquiry-phone"
                      className="mb-2 block text-sm font-semibold text-[#123C35]"
                    >
                      {language === "hi"
                        ? "मोबाइल नंबर"
                        : "Phone Number"}
                    </label>

                    <input
                      id="enquiry-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder={
                        language === "hi"
                          ? "10 अंकों का मोबाइल नंबर"
                          : "Enter your 10-digit phone number"
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                      {language === "hi"
                        ? "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।"
                        : "Please enter a valid 10-digit mobile number."}
                    </p>

                  </div>

                  {/* Vehicle */}
                  <div>

                    <label
                      htmlFor="enquiry-vehicle"
                      className="mb-2 block text-sm font-semibold text-[#123C35]"
                    >
                      {language === "hi"
                        ? "वाहन"
                        : "Vehicle"}
                    </label>

                    <input
                      id="enquiry-vehicle"
                      type="text"
                      value={vehicle}
                      onChange={(event) =>
                        setVehicle(event.target.value)
                      }
                      placeholder={
                        language === "hi"
                          ? "आप किस वाहन में रुचि रखते हैं?"
                          : "Which vehicle are you interested in?"
                      }
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                    />

                  </div>

                  {/* Message */}
                  <div>

                    <label
                      htmlFor="enquiry-message"
                      className="mb-2 block text-sm font-semibold text-[#123C35]"
                    >
                      {language === "hi"
                        ? "संदेश"
                        : "Message"}
                    </label>

                    <textarea
                      id="enquiry-message"
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      rows={4}
                      placeholder={
                        language === "hi"
                          ? "अपनी आवश्यकता या सवाल लिखें..."
                          : "Tell us about your requirement..."
                      }
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                    />

                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#0F5C4D] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B493D] hover:shadow-md"
                  >
                    {language === "hi"
                      ? "पूछताछ भेजें"
                      : "Send Enquiry"}
                  </button>

                  <p className="text-center text-xs leading-5 text-gray-400">
                    {language === "hi"
                      ? "अपनी जानकारी साझा करके आप हमसे संपर्क करने की अनुमति देते हैं।"
                      : "By submitting this form, you agree to be contacted by our team regarding your enquiry."}
                  </p>

                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquirySection;