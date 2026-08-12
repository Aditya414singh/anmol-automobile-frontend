import { useLanguage } from "../context/LanguageContext";
import heroVehicle from "../assets/hero-rickshaw.png";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#F4F8F5]">
      {/* Decorative Background */}
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#DDEFE7] opacity-60 blur-3xl" />

      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#E4F1EB] opacity-60 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">

        {/* Content */}
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#159A75]" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F5C4D]">
              {t.hero.badge}
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[#123C35] sm:text-6xl lg:text-7xl">
            {t.hero.title}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            {t.hero.description}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/vehicles"
              className="rounded-full bg-[#0F5C4D] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#0B493D] hover:shadow-lg"
            >
              {t.hero.explore}
            </a>

            <a
              href="#enquiry"
              className="rounded-full border border-[#0F5C4D] bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#0F5C4D] hover:text-white"
            >
              {t.hero.quote}
            </a>
          </div>

          {/* Benefits */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-gray-200 pt-7">
            <div>
              <p className="text-xl font-bold text-[#123C35]">
                100%
              </p>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {t.hero.electric}
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-[#123C35]">
                Low
              </p>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {t.hero.lowCost}
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-[#123C35]">
                Reliable
              </p>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {t.hero.reliable}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
            <div className="relative flex min-h-[350px] items-center justify-center lg:min-h-[550px]">
            {/* Background glow */}
            <div className="absolute h-[260px] w-[260px] rounded-full bg-[#D7EDE3] blur-sm sm:h-[380px] sm:w-[380px] lg:h-[480px] lg:w-[480px]" />

            {/* Vehicle */}
            <div className="relative z-10 flex w-full items-center justify-center">
                <img
                src={heroVehicle}
                alt="Anmol Electric E-Rickshaw"
                className="
                    w-[90%]
                    max-w-[520px]
                    object-contain
                    drop-shadow-2xl
                    transition-transform
                    duration-500
                    hover:scale-105
                    sm:w-[85%]
                    lg:w-full
                "
                />
            </div>
            </div>
      </div>
    </section>
  );
};

export default Hero;