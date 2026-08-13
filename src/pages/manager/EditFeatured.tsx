import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  webUtilsApi,
} from "../../api/webUtilsApi";

import type {
  FeaturedContent,
} from "../../api/webUtilsApi";

import {
  useLanguage,
} from "../../context/LanguageContext";


const EditFeatured = () => {
  const {
    language,
    t,
  } = useLanguage();

  const isHindi = language === "hi";

  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();


  const [
    featured,
    setFeatured,
  ] = useState<FeaturedContent | null>(
    null
  );


  const [
    title,
    setTitle,
  ] = useState("");


  const [
    description,
    setDescription,
  ] = useState("");


  const [
    contentType,
    setContentType,
  ] = useState<"IMAGE" | "VIDEO">(
    "IMAGE"
  );


  const [
    media,
    setMedia,
  ] = useState<File | null>(null);


  const [
    startDate,
    setStartDate,
  ] = useState("");


  const [
    endDate,
    setEndDate,
  ] = useState("");


  const [
    buttonText,
    setButtonText,
  ] = useState("");


  const [
    buttonUrl,
    setButtonUrl,
  ] = useState("");


  const [
    previewUrl,
    setPreviewUrl,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // LOAD
  // ==========================================================

  useEffect(() => {

    const loadFeatured = async () => {

      if (!id) {
        setError(
          "Invalid featured content."
        );
        setLoading(false);
        return;
      }

      try {

        const data =
          await webUtilsApi.getManagerFeaturedContent();

        const item =
          data.find(
            (content) =>
              content.id === id
          );

        if (!item) {
          setError(
            "Featured content not found."
          );
          return;
        }

        setFeatured(item);

        setTitle(item.title);

        setDescription(
          item.description || ""
        );

        setContentType(
          item.content_type
        );

        setButtonText(
          item.button_text || ""
        );

        setButtonUrl(
          item.button_url || ""
        );

        setStartDate(
          toDateTimeLocal(
            item.start_date
          )
        );

        setEndDate(
          toDateTimeLocal(
            item.end_date
          )
        );

        setPreviewUrl(
          item.media_url
        );

      } catch (err) {

        console.error(
          "Failed to load featured content:",
          err
        );

        setError(
          isHindi
            ? "Featured Content लोड नहीं हो सका।"
            : "Unable to load featured content."
        );

      } finally {

        setLoading(false);

      }

    };

    loadFeatured();

  }, [id]);


  // ==========================================================
  // DATE CONVERTER
  // ==========================================================

  const toDateTimeLocal = (
    value: string
  ) => {

    const date =
      new Date(value);

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    const hours =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


  // ==========================================================
  // MEDIA
  // ==========================================================

  const handleMediaChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const isImage =
      file.type.startsWith("image/");

    const isVideo =
      file.type.startsWith("video/");

    if (
      contentType === "IMAGE" &&
      !isImage
    ) {
      setError(
        t.featured.invalidMedia
      );
      return;
    }

    if (
      contentType === "VIDEO" &&
      !isVideo
    ) {
      setError(
        t.featured.invalidMedia
      );
      return;
    }

    setError("");
    setMedia(file);

    setPreviewUrl(
      URL.createObjectURL(file)
    );
  };


  // ==========================================================
  // TYPE
  // ==========================================================

  const handleContentTypeChange = (
    type: "IMAGE" | "VIDEO"
  ) => {

    setContentType(type);

    setMedia(null);

    if (featured) {
      setPreviewUrl(
        type === featured.content_type
          ? featured.media_url
          : ""
      );
    }

  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    if (!id) {
      return;
    }

    setError("");

    if (!title.trim()) {
      setError(
        t.featured.titleRequired
      );
      return;
    }

    if (!startDate) {
      setError(
        t.featured.startDateRequired
      );
      return;
    }

    if (!endDate) {
      setError(
        t.featured.endDateRequired
      );
      return;
    }

    if (
      new Date(endDate) <=
      new Date(startDate)
    ) {
      setError(
        t.featured.endDateInvalid
      );
      return;
    }

    try {

      setSaving(true);

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
        "start_date",
        new Date(
          startDate
        ).toISOString()
      );

      formData.append(
        "end_date",
        new Date(
          endDate
        ).toISOString()
      );

      formData.append(
        "button_text",
        buttonText.trim()
      );

      formData.append(
        "button_url",
        buttonUrl.trim()
      );

      if (media) {
        formData.append(
          "media",
          media
        );
      }

      await webUtilsApi.updateFeaturedContent(
        id,
        formData
      );

      navigate(
        "/manager/featured"
      );

    } catch (err) {

      console.error(
        "Failed to update featured content:",
        err
      );

      setError(
        t.featured.updateError
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <main className="min-h-screen bg-[#F8FAF9]">

        <div className="mx-auto max-w-4xl px-4 py-16 text-center">

          <div className="text-sm text-gray-500">
            {t.featured.loading}
          </div>

        </div>

      </main>
    );

  }


  // ==========================================================
  // ERROR / NOT FOUND
  // ==========================================================

  if (error && !featured) {

    return (
      <main className="min-h-screen bg-[#F8FAF9]">

        <div className="mx-auto max-w-4xl px-4 py-16">

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              ⚠️
            </div>

            <h1 className="mt-5 text-xl font-bold text-[#123C35]">
              {error}
            </h1>

            <Link
              to="/manager/featured"
              className="mt-6 inline-flex rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white"
            >
              {isHindi
                ? "वापस जाएं"
                : "Go Back"}
            </Link>

          </div>

        </div>

      </main>
    );

  }


  return (
    <main className="min-h-screen bg-[#F8FAF9]">

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
            {t.featured.edit}
          </h1>

        </div>

      </section>


      <section className="py-10">

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >

            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
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
                  setTitle(
                    event.target.value
                  )
                }
                className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F8B6D]"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="mt-6">

              <label className="text-sm font-semibold text-[#123C35]">
                {t.featured.descriptionLabel}
              </label>

              <textarea
                rows={4}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                className="mt-2 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm outline-none focus:border-[#0F8B6D]"
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
                  className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
                    contentType === "IMAGE"
                      ? "border-[#0F5C4D] bg-[#F0F8F5] text-[#0F5C4D]"
                      : "border-gray-200 text-gray-600"
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
                  className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
                    contentType === "VIDEO"
                      ? "border-[#0F5C4D] bg-[#F0F8F5] text-[#0F5C4D]"
                      : "border-gray-200 text-gray-600"
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
                    alt={title}
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
                  {t.featured.buttonText}
                </label>

                <input
                  type="text"
                  value={buttonText}
                  onChange={(event) =>
                    setButtonText(
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F8B6D]"
                />

              </div>


              <div>

                <label className="text-sm font-semibold text-[#123C35]">
                  {t.featured.buttonUrl}
                </label>

                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(event) =>
                    setButtonUrl(
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F8B6D]"
                />

              </div>

            </div>


            {/* ACTIONS */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <Link
                to="/manager/featured"
                className="rounded-full border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-700"
              >
                {t.featured.cancel}
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? "..."
                  : t.featured.update}
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
};


export default EditFeatured;