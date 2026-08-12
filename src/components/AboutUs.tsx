import { useLanguage } from "../context/LanguageContext";

const AboutUs = () => {
  const { language } = useLanguage();

  return (
    <section
      id="about"
      className="scroll-mt-24 bg-[#F4F8F5] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left - Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
              {language === "hi"
                ? "हमारे बारे में"
                : "About Us"}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl lg:text-5xl">
              {language === "hi"
                ? "अनमोल ऑटोमोबाइल्स"
                : "Anmol Automobiles"}
            </h2>

            <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
              {language === "hi"
                ? "हमारा उद्देश्य भरोसेमंद और किफायती इलेक्ट्रिक ई-रिक्शा उपलब्ध कराना है, जो रोज़मर्रा की यात्रा और व्यावसायिक जरूरतों के लिए उपयोगी हों।"
                : "At Anmol Automobiles, our goal is to provide reliable and affordable electric e-rickshaws designed for everyday transportation and business needs."}
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              {language === "hi"
                ? "हम अपने ग्राहकों को सही वाहन चुनने में मदद करने और बेहतर खरीदारी अनुभव देने पर ध्यान देते हैं।"
                : "We focus on helping our customers choose the right vehicle while providing a simple and trustworthy buying experience."}
            </p>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-2xl font-bold text-[#0F5C4D]">
                  ⚡
                </p>

                <p className="mt-3 text-sm font-semibold text-[#123C35]">
                  {language === "hi"
                    ? "इलेक्ट्रिक वाहन"
                    : "Electric Vehicles"}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {language === "hi"
                    ? "आधुनिक और उपयोगी ई-रिक्शा"
                    : "Practical electric mobility solutions"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-2xl font-bold text-[#0F5C4D]">
                  🤝
                </p>

                <p className="mt-3 text-sm font-semibold text-[#123C35]">
                  {language === "hi"
                    ? "ग्राहक सेवा"
                    : "Customer Focus"}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {language === "hi"
                    ? "सही वाहन चुनने में सहायता"
                    : "Helping you choose the right vehicle"}
                </p>
              </div>

            </div>

          </div>

          {/* Right - Visual */}
          <div className="relative">

            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#D7EDE3] blur-2xl" />

            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-[#DDEFE7] blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl bg-[#123C35] p-8 shadow-xl sm:p-10">

              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">

                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                  <span className="text-4xl">
                    🛺
                  </span>
                </div>

                <h3 className="mt-7 text-2xl font-bold text-white sm:text-3xl">
                  {language === "hi"
                    ? "बेहतर इलेक्ट्रिक मोबिलिटी"
                    : "Better Electric Mobility"}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:text-base">
                  {language === "hi"
                    ? "रोज़मर्रा की जरूरतों के लिए भरोसेमंद इलेक्ट्रिक ई-रिक्शा।"
                    : "Reliable electric rickshaws built around everyday transportation and business requirements."}
                </p>

                <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl">
                      🔋
                    </p>

                    <p className="mt-2 text-xs font-medium text-gray-300">
                      {language === "hi"
                        ? "बैटरी"
                        : "Battery"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl">
                      🛺
                    </p>

                    <p className="mt-2 text-xs font-medium text-gray-300">
                      {language === "hi"
                        ? "ई-रिक्शा"
                        : "E-Rickshaw"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl">
                      ₹
                    </p>

                    <p className="mt-2 text-xs font-medium text-gray-300">
                      {language === "hi"
                        ? "किफायती"
                        : "Affordable"}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;