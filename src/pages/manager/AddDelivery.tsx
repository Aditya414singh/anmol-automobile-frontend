import {
  useEffect,
  useState,
} from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  webUtilsApi,
} from "../../api/webUtilsApi";

import type {
  Vehicle,
} from "../../types/vehicle";

import {
  useLanguage,
} from "../../context/LanguageContext";

import {
  compressImage,
} from "../../utils/compressImage";


const AddDelivery = () => {
  const {
    language,
  } = useLanguage();

  const navigate =
    useNavigate();

  const isHindi =
    language === "hi";


  // ==========================================================
  // VEHICLES
  // ==========================================================

  const [
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);


  const [
    vehiclesLoading,
    setVehiclesLoading,
  ] = useState(true);


  // ==========================================================
  // FORM
  // ==========================================================

  const [
    vehicle,
    setVehicle,
  ] = useState("");


  const [
    customerName,
    setCustomerName,
  ] = useState("");


  const [
    customerLocation,
    setCustomerLocation,
  ] = useState("");


  const [
    deliveryDate,
    setDeliveryDate,
  ] = useState("");


  const [
    caption,
    setCaption,
  ] = useState("");


  const [
    image,
    setImage,
  ] = useState<File | null>(null);


  const [
    previewUrl,
    setPreviewUrl,
  ] = useState("");


  // ==========================================================
  // UI STATE
  // ==========================================================

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  // ==========================================================
  // LOAD VEHICLES
  // ==========================================================

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setVehiclesLoading(true);

        const data =
          await webUtilsApi.getManagerVehicles();

        setVehicles(data);

      } catch (err) {
        console.error(
          "Failed to load vehicles:",
          err
        );

        setError(
          isHindi
            ? "वाहन लोड नहीं हो सके।"
            : "Unable to load vehicles."
        );

      } finally {
        setVehiclesLoading(false);
      }
    };


    loadVehicles();
  }, [isHindi]);


  // ==========================================================
  // IMAGE SELECT
  // ==========================================================

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    setError("");


    // --------------------------------------------------------
    // TYPE VALIDATION
    // --------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        isHindi
          ? "कृपया JPG, PNG या WEBP इमेज चुनें।"
          : "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";

      return;
    }


    // --------------------------------------------------------
    // 5 MB FRONTEND LIMIT
    // --------------------------------------------------------

    const maxSize =
      5 * 1024 * 1024;


    if (file.size > maxSize) {
      setError(
        isHindi
          ? "इमेज का आकार 5 MB से कम होना चाहिए।"
          : "Image size must be less than 5 MB."
      );

      event.target.value = "";

      return;
    }


    // --------------------------------------------------------
    // CLEAN PREVIOUS PREVIEW
    // --------------------------------------------------------

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }


    setImage(file);


    setPreviewUrl(
      URL.createObjectURL(file)
    );
  };


  // ==========================================================
  // CLEAN PREVIEW
  // ==========================================================

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();


    setError("");
    setSuccess("");


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!vehicle) {
      setError(
        isHindi
          ? "कृपया वाहन चुनें।"
          : "Please select a vehicle."
      );

      return;
    }


    if (!customerName.trim()) {
      setError(
        isHindi
          ? "कृपया ग्राहक का नाम दर्ज करें।"
          : "Please enter the customer name."
      );

      return;
    }


    if (!deliveryDate) {
      setError(
        isHindi
          ? "कृपया डिलीवरी की तारीख चुनें।"
          : "Please select the delivery date."
      );

      return;
    }


    if (!image) {
      setError(
        isHindi
          ? "कृपया डिलीवरी फोटो चुनें।"
          : "Please select the delivery photo."
      );

      return;
    }


    try {
      setLoading(true);


      // ------------------------------------------------------
      // COMPRESS ONLY IF NEEDED
      // ------------------------------------------------------

      const uploadImage =
        await compressImage(image);


      console.log(
        "Original image size:",
        (
          image.size /
          1024 /
          1024
        ).toFixed(2),
        "MB"
      );


      console.log(
        "Upload image size:",
        (
          uploadImage.size /
          1024 /
          1024
        ).toFixed(2),
        "MB"
      );


      // ------------------------------------------------------
      // CREATE DELIVERY
      // ------------------------------------------------------

      await webUtilsApi.createVehicleDelivery(
        {
          vehicle,

          customer_name:
            customerName.trim(),

          customer_location:
            customerLocation.trim(),

          delivery_date:
            deliveryDate,

          caption:
            caption.trim(),

          image:
            uploadImage,
        }
      );


      setSuccess(
        isHindi
          ? "डिलीवरी सफलतापूर्वक जोड़ दी गई। यह अभी प्रकाशित नहीं हुई है।"
          : "Delivery added successfully. It is currently pending publication."
      );


      // ------------------------------------------------------
      // REDIRECT AFTER SHORT DELAY
      // ------------------------------------------------------

      setTimeout(() => {
        navigate(
          "/manager/deliveries"
        );
      }, 1000);

    } catch (err) {
      console.error(
        "Failed to create delivery:",
        err
      );

      setError(
        isHindi
          ? "डिलीवरी जोड़ने में समस्या हुई। कृपया दोबारा कोशिश करें।"
          : "Unable to create delivery. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#F8FAF9]">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-gray-100 bg-[#F4F8F5]">

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            to="/manager/deliveries"
            className="text-sm font-semibold text-[#0F5C4D] hover:underline"
          >
            ←{" "}
            {isHindi
              ? "डिलीवरी पर वापस जाएं"
              : "Back to Deliveries"}
          </Link>


          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
            {isHindi
              ? "मैनेजर पैनल"
              : "Manager Panel"}
          </p>


          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl">
            {isHindi
              ? "नई डिलीवरी जोड़ें"
              : "Add Vehicle Delivery"}
          </h1>


          <p className="mt-3 text-gray-600">
            {isHindi
              ? "ग्राहक को बेचे गए ई-रिक्शा की अंतिम डिलीवरी फोटो जोड़ें।"
              : "Add the final delivery photo of an e-rickshaw sold to a customer."}
          </p>

        </div>

      </section>


      {/* ======================================================
          FORM
      ====================================================== */}

      <section className="py-10 sm:py-14">

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
          >

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

              <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>

            )}


            <div className="grid gap-8 lg:grid-cols-2">

              {/* =================================================
                  LEFT
              ================================================= */}

              <div className="space-y-6">

                {/* VEHICLE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#123C35]">
                    {isHindi
                      ? "वाहन"
                      : "Vehicle"}
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>


                  <select
                    value={vehicle}
                    onChange={(event) =>
                      setVehicle(
                        event.target.value
                      )
                    }
                    disabled={vehiclesLoading}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-[#0F8B6D] focus:ring-2 focus:ring-[#0F8B6D]/10 disabled:bg-gray-50"
                  >

                    <option value="">
                      {vehiclesLoading
                        ? isHindi
                          ? "वाहन लोड हो रहे हैं..."
                          : "Loading vehicles..."
                        : isHindi
                        ? "वाहन चुनें"
                        : "Select vehicle"}
                    </option>


                    {vehicles.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                          {" — "}
                          {item.model}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* CUSTOMER NAME */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#123C35]">
                    {isHindi
                      ? "ग्राहक का नाम"
                      : "Customer Name"}
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>


                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(
                        event.target.value
                      )
                    }
                    placeholder={
                      isHindi
                        ? "ग्राहक का नाम"
                        : "Customer name"
                    }
                    maxLength={150}
                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F8B6D] focus:ring-2 focus:ring-[#0F8B6D]/10"
                  />

                </div>


                {/* LOCATION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#123C35]">
                    {isHindi
                      ? "स्थान"
                      : "Location"}
                  </label>


                  <input
                    type="text"
                    value={customerLocation}
                    onChange={(event) =>
                      setCustomerLocation(
                        event.target.value
                      )
                    }
                    placeholder={
                      isHindi
                        ? "जैसे: Ballia, Uttar Pradesh"
                        : "e.g. Ballia, Uttar Pradesh"
                    }
                    maxLength={150}
                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F8B6D] focus:ring-2 focus:ring-[#0F8B6D]/10"
                  />

                </div>


                {/* DELIVERY DATE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#123C35]">
                    {isHindi
                      ? "डिलीवरी की तारीख"
                      : "Delivery Date"}
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>


                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(event) =>
                      setDeliveryDate(
                        event.target.value
                      )
                    }
                    className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-[#0F8B6D] focus:ring-2 focus:ring-[#0F8B6D]/10"
                  />

                </div>


                {/* CAPTION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#123C35]">
                    {isHindi
                      ? "कैप्शन"
                      : "Caption"}
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      ({isHindi
                        ? "वैकल्पिक"
                        : "optional"})
                    </span>
                  </label>


                  <textarea
                    value={caption}
                    onChange={(event) =>
                      setCaption(
                        event.target.value
                      )
                    }
                    placeholder={
                      isHindi
                        ? "डिलीवरी के बारे में छोटा विवरण..."
                        : "Short description about the delivery..."
                    }
                    maxLength={255}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F8B6D] focus:ring-2 focus:ring-[#0F8B6D]/10"
                  />

                </div>

              </div>


              {/* =================================================
                  RIGHT - IMAGE
              ================================================= */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#123C35]">
                  {isHindi
                    ? "डिलीवरी फोटो"
                    : "Delivery Photo"}
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>


                {/* PREVIEW */}

                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-[#F4F8F5]">

                  <div className="aspect-[4/3]">

                    {previewUrl ? (

                      <img
                        src={previewUrl}
                        alt={
                          isHindi
                            ? "डिलीवरी पूर्वावलोकन"
                            : "Delivery preview"
                        }
                        className="h-full w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-full flex-col items-center justify-center px-6 text-center">

                        <div className="text-6xl">
                          📸
                        </div>


                        <p className="mt-4 font-semibold text-[#123C35]">
                          {isHindi
                            ? "डिलीवरी फोटो चुनें"
                            : "Select delivery photo"}
                        </p>


                        <p className="mt-2 text-sm text-gray-500">
                          {isHindi
                            ? "ग्राहक और ई-रिक्शा दोनों स्पष्ट रूप से दिखाई देने वाली फोटो चुनें।"
                            : "Choose a photo where both the customer and e-rickshaw are clearly visible."}
                        </p>

                      </div>

                    )}

                  </div>


                  {/* FILE INPUT */}

                  <div className="border-t border-gray-200 bg-white p-5">

                    <input
                      id="delivery-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleImageChange
                      }
                      className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-[#E6F3ED] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#0F5C4D] hover:file:bg-[#D9EDE3]"
                    />


                    <p className="mt-3 text-xs leading-5 text-gray-400">
                      {isHindi
                        ? "JPG, PNG या WEBP। अधिकतम 5 MB। बड़ी इमेज अपने आप optimize की जाएगी।"
                        : "JPG, PNG or WEBP. Maximum 5 MB. Larger images are automatically optimized before upload."}
                    </p>

                  </div>

                </div>


                {/* PRIVACY NOTE */}

                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                  <p className="text-sm font-semibold text-amber-800">
                    {isHindi
                      ? "ग्राहक की अनुमति"
                      : "Customer permission"}
                  </p>


                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    {isHindi
                      ? "सुनिश्चित करें कि ग्राहक ने वेबसाइट पर अपनी फोटो प्रकाशित करने की अनुमति दी है।"
                      : "Make sure the customer has given permission for their photo to be published on the website."}
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/manager/deliveries"
                className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 px-6 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                {isHindi
                  ? "रद्द करें"
                  : "Cancel"}
              </Link>


              <button
                type="submit"
                disabled={
                  loading ||
                  vehiclesLoading
                }
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0F5C4D] px-7 text-sm font-semibold text-white transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? isHindi
                    ? "डिलीवरी जोड़ी जा रही है..."
                    : "Adding Delivery..."
                  : isHindi
                  ? "डिलीवरी जोड़ें"
                  : "Add Delivery"}
              </button>

            </div>


            {/* =================================================
                PENDING NOTE
            ================================================= */}

            <div className="mt-5 rounded-2xl bg-[#F8FAF9] p-4">

              <p className="text-xs leading-5 text-gray-500">
                <strong className="text-[#123C35]">
                  {isHindi
                    ? "नोट:"
                    : "Note:"}
                </strong>{" "}
                {isHindi
                  ? "नई डिलीवरी पहले लंबित रहेगी। ग्राहक वेबसाइट पर दिखाई देने से पहले मैनेजर को इसे प्रकाशित करना होगा।"
                  : "New deliveries remain pending. A manager must publish the delivery before it becomes visible on the public website."}
              </p>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
};


export default AddDelivery;