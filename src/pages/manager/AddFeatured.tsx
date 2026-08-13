import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  webUtilsApi,
} from "../../api/webUtilsApi";

import {
  useLanguage,
} from "../../context/LanguageContext";


const AddFeatured = () => {
  const {
    language,
    t,
  } = useLanguage();

  const navigate = useNavigate();

  const isHindi = language === "hi";


  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [contentType, setContentType] =
    useState<"IMAGE" | "VIDEO">("IMAGE");

  const [media, setMedia] =
    useState<File | null>(null);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [buttonText, setButtonText] =
    useState("");

  const [buttonUrl, setButtonUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [previewUrl, setPreviewUrl] =
    useState("");


  // ==========================================================
  // MEDIA CHANGE
  // ==========================================================

  const handleMediaChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setMedia(null);
      setPreviewUrl("");
      return;
    }

    const isImage =
      file.type.startsWith("image/");

    const isVideo =
      file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError(t.featured.invalidMedia);
      setMedia(null);
      setPreviewUrl("");
      return;
    }

    if (
      contentType === "IMAGE" &&
      !isImage
    ) {
      setError(t.featured.invalidMedia);
      return;
    }

    if (
      contentType === "VIDEO" &&
      !isVideo
    ) {
      setError(t.featured.invalidMedia);
      return;
    }

    setError("");
    setMedia(file);

    const url =
      URL.createObjectURL(file);

    setPreviewUrl(url);
  };


  // ==========================================================
  // CONTENT TYPE CHANGE
  // ==========================================================

  const handleContentTypeChange = (
    type: "IMAGE" | "VIDEO"
  ) => {
    setContentType(type);
    setMedia(null);
    setPreviewUrl("");
  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError(t.featured.titleRequired);
      return;
    }

    if (!media) {
      setError(t.featured.mediaRequired);
      return;
    }

    if (!startDate) {
      setError(t.featured.startDateRequired);
      return;
    }

    if (!endDate) {
      setError(t.featured.endDateRequired);
      return;
    }

    if (
      new Date(endDate) <=
      new Date(startDate)
    ) {
      setError(t.featured.endDateInvalid);
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "content_type",
        contentType
      );

      formData.append(
        "media",
        media
      );

      formData.append(
        "start_date",
        new Date(startDate).toISOString()
      );

      formData.append(
        "end_date",
        new Date(endDate).toISOString()
      );

      if (buttonText.trim()) {
        formData.append(
          "button_text",
          buttonText.trim()
        );
      }

      if (buttonUrl.trim()) {
        formData.append(
          "button_url",
          buttonUrl.trim()
        );
      }

      await webUtilsApi.createFeaturedContent(
        formData
      );

      navigate(
        "/manager/featured"
      );

    } catch (err) {
      console.error(
        "Failed to create featured content:",
        err
      );

      setError(
        t.featured.createError
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-[#F8FAF9]">

      {/* HEADER */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/manager/featured"
            className="text-sm font-semibold text-[#0F5C4D] hover:underline"
          >
            ←{" "}
            {isHindi
              ? "Featured पर वापस जाएं"
              : "Back to Featured"}
          </Link>

          <h1 className="mt-5 text-3xl font-bold text-[#123C35]">
            {t.featured.add}
          </h1>

        </div>

      </section>


      {/* FORM */}

      <section className="py-10">

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}


            {/* TITLE */}

            <div>
              <label className="text-sm font-semibold text-[#123C35]">
                {t.featured.titleLabel}
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder={
                  isHindi
                    ? "जैसे: स्वतंत्रता दिवस की शुभकामनाएं"
                    : "e.g. Happy Independence Day"
                }
                className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F8B6D] focus:ring-2 focus:ring-[#0F8B6D]/10"
              />
            </div>


            {/* DESCRIPTION */}

            <div className="mt-6">

              <label className="text-sm font-semibold text-[#123C35]">
                {t.featured.descriptionLabel}
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={4}
                placeholder={
                  isHindi
                    ? "अपने कैंपेन के बारे में बताएं..."
                    : "Tell customers about your campaign..."
                }
                className="mt-2 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm outline-none transition focus:border-[#0F8B6D] focus:ring-2 focus:ring-[#0F8B6D]/10"
              />

            </div>


            {/* CONTENT TYPE */}

            <div className="mt-6">

              <label className="text-sm font-semibold text-[#123C35]">
                {t.featured.contentType}
              </label>

              <div className="mt-3 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    handleContentTypeChange(
                      "IMAGE"
                    )
                  }
                  className={`rounded-2xl border px-5 py-4 text-sm font-semibold transition ${
                    contentType === "IMAGE"
                      ? "border-[#0F5C4D] bg-[#F0F8F5] text-[#0F5C4D]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🖼️ {t.featured.image}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleContentTypeChange(
                      "VIDEO"
                    )
                  }
                  className={`rounded-2xl border px-5 py-4 text-sm font-semibold transition ${
                    contentType === "VIDEO"
                      ? "border-[#0F5C4D] bg-[#F0F8F5] text-[#0F5C4D]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🎥 {t.featured.video}
                </button>

              </div>

            </div>


            {/* MEDIA */}

            <div className="mt-6">

              <label className="text-sm font-semibold text-[#123C35]">
                {t.featured.mediaLabel}
              </label>

              <input
                key={contentType}
                type="file"
                accept={
                  contentType === "IMAGE"
                    ? "image/*"
                    : "video/*"
                }
                onChange={
                  handleMediaChange
                }
                className="mt-2 block w-full rounded-2xl border border-gray-200 p-3 text-sm"
              />

              <p className="mt-2 text-xs text-gray-400">
                {t.featured.uploadHelp}
              </p>

            </div>


            {/* PREVIEW */}

            {previewUrl && (
              <div className="mt-6 overflow-hidden rounded-3xl bg-[#F4F8F5]">

                {contentType === "VIDEO" ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-[400px] w-full object-contain"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[400px] w-full object-contain"
                  />
                )}

              </div>
            )}


            {/* DATES */}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>

                <label className="text-sm font-semibold text-[#123C35]">
                  {t.featured.startDate}
                </label>

                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F8B6D]"
                />

              </div>


              <div>

                <label className="text-sm font-semibold text-[#123C35]">
                  {t.featured.endDate}
                </label>

                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F8B6D]"
                />

              </div>

            </div>


            {/* CTA */}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>

                <label className="text-sm font-semibold text-[#123C35]">
                  {t.featured.buttonText}{" "}
                  <span className="font-normal text-gray-400">
                    {t.featured.optional}
                  </span>
                </label>

                <input
                  type="text"
                  value={buttonText}
                  onChange={(event) =>
                    setButtonText(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "जैसे: ई-रिक्शा देखें"
                      : "e.g. Explore E-Rickshaws"
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F8B6D]"
                />

              </div>


              <div>

                <label className="text-sm font-semibold text-[#123C35]">
                  {t.featured.buttonUrl}{" "}
                  <span className="font-normal text-gray-400">
                    {t.featured.optional}
                  </span>
                </label>

                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(event) =>
                    setButtonUrl(
                      event.target.value
                    )
                  }
                  placeholder="/vehicles"
                  className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F8B6D]"
                />

              </div>

            </div>


            {/* ACTIONS */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link
                to="/manager/featured"
                className="rounded-full border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {t.featured.cancel}
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : t.featured.save}
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
};


export default AddFeatured;