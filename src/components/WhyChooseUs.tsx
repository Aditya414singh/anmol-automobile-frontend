import { useLanguage } from "../context/LanguageContext";

const WhyChooseUs = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: "⚡",
      title: t.whyChooseUs.performance.title,
      description: t.whyChooseUs.performance.description,
    },
    {
      icon: "🔋",
      title: t.whyChooseUs.range.title,
      description: t.whyChooseUs.range.description,
    },
    {
      icon: "₹",
      title: t.whyChooseUs.cost.title,
      description: t.whyChooseUs.cost.description,
    },
    {
      icon: "🛠️",
      title: t.whyChooseUs.support.title,
      description: t.whyChooseUs.support.description,
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
            {t.whyChooseUs.badge}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl lg:text-5xl">
            {t.whyChooseUs.title}
            <br />

            <span className="text-[#0F8B6D]">
              {t.whyChooseUs.titleHighlight}
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
            {t.whyChooseUs.description}
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F3ED] text-2xl transition group-hover:bg-[#0F5C4D]">
                <span className="transition group-hover:scale-110">
                  {benefit.icon}
                </span>
              </div>

              {/* Text */}
              <h3 className="mt-6 text-lg font-bold text-[#123C35]">
                {benefit.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Highlight */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-[#123C35]">
          <div className="grid items-center gap-8 px-7 py-10 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7AD6B7]">
                {t.whyChooseUs.highlightBadge}
              </p>

              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                {t.whyChooseUs.highlightTitle}
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                {t.whyChooseUs.highlightDescription}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5">
              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur sm:p-6">
                <p className="text-2xl sm:text-3xl">
                  ⚡
                </p>

                <p className="mt-2 text-xs font-medium text-gray-300 sm:text-sm">
                  {t.whyChooseUs.electric}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur sm:p-6">
                <p className="text-2xl sm:text-3xl">
                  🔋
                </p>

                <p className="mt-2 text-xs font-medium text-gray-300 sm:text-sm">
                  {t.whyChooseUs.efficient}
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur sm:p-6">
                <p className="text-2xl sm:text-3xl">
                  🛺
                </p>

                <p className="mt-2 text-xs font-medium text-gray-300 sm:text-sm">
                  {t.whyChooseUs.dependable}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;