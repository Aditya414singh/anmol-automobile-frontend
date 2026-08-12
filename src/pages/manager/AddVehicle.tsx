import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  webUtilsApi,
  type CreateVehiclePayload,
} from "../../api/webUtilsApi";

import { useLanguage } from "../../context/LanguageContext";

interface SelectedImage {
  id: string;
  file: File;
  preview: string;
}

const AddVehicle = () => {
  const navigate = useNavigate();

  const { t, language } =
    useLanguage();

  const isHindi = language === "hi";

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // BASIC VEHICLE INFORMATION
  // ==========================================

  const [name, setName] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [model, setModel] =
    useState("");

  const [vehicleType, setVehicleType] =
    useState("E_RICKSHAW");

  const [price, setPrice] =
    useState("");

  const [batteryCapacity, setBatteryCapacity] =
    useState("");

  const [rangeKm, setRangeKm] =
    useState("");

  const [chargingTime, setChargingTime] =
    useState("");

  const [seatingCapacity, setSeatingCapacity] =
    useState("");

  const [payloadCapacity, setPayloadCapacity] =
    useState("");

  const [topSpeed, setTopSpeed] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [isAvailable, setIsAvailable] =
    useState(true);

  // ==========================================
  // SPECIFICATIONS
  // ==========================================

  const [specificationKey, setSpecificationKey] =
    useState("");

  const [specificationValue, setSpecificationValue] =
    useState("");

  const [specifications, setSpecifications] =
    useState<Record<string, string>>({});

  // ==========================================
  // IMAGES
  // ==========================================

  const [selectedImages, setSelectedImages] =
    useState<SelectedImage[]>([]);

  const [primaryImageId, setPrimaryImageId] =
    useState<string | null>(null);

  // ==========================================
  // CLEANUP IMAGE PREVIEWS
  // ==========================================

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [selectedImages]);

  // ==========================================
  // ADD SPECIFICATION
  // ==========================================

  const addSpecification = () => {
    const key =
      specificationKey.trim();

    const value =
      specificationValue.trim();

    if (!key || !value) {
      return;
    }

    setSpecifications(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

    setSpecificationKey("");
    setSpecificationValue("");
  };

  // ==========================================
  // REMOVE SPECIFICATION
  // ==========================================

  const removeSpecification = (
    key: string
  ) => {
    setSpecifications(
      (current) => {
        const updated = {
          ...current,
        };

        delete updated[key];

        return updated;
      }
    );
  };

  // ==========================================
  // IMAGE SELECTION
  // ==========================================

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        event.target.files ?? []
      );

    if (files.length === 0) {
      return;
    }

    setError("");

    const imageFiles =
      files.filter((file) =>
        file.type.startsWith("image/")
      );

    if (
      imageFiles.length !==
      files.length
    ) {
      setError(
        isHindi
          ? "कृपया केवल इमेज फाइल चुनें।"
          : "Please select only image files."
      );
    }

    const newImages: SelectedImage[] =
      imageFiles.map(
        (file) => ({
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          file,
          preview:
            URL.createObjectURL(file),
        })
      );

    setSelectedImages(
      (current) => {
        const updated = [
          ...current,
          ...newImages,
        ];

        if (
          primaryImageId === null &&
          updated.length > 0
        ) {
          setPrimaryImageId(
            updated[0].id
          );
        }

        return updated;
      }
    );

    // Allow selecting the same file again.
    event.target.value = "";
  };

  // ==========================================
  // REMOVE SELECTED IMAGE
  // ==========================================

  const removeSelectedImage = (
    imageId: string
  ) => {
    const image =
      selectedImages.find(
        (item) =>
          item.id === imageId
      );

    if (image) {
      URL.revokeObjectURL(
        image.preview
      );
    }

    setSelectedImages(
      (current) =>
        current.filter(
          (item) =>
            item.id !== imageId
        )
    );

    if (
      primaryImageId === imageId
    ) {
      const remaining =
        selectedImages.filter(
          (item) =>
            item.id !== imageId
        );

      setPrimaryImageId(
        remaining.length > 0
          ? remaining[0].id
          : null
      );
    }
  };

  // ==========================================
  // SET PRIMARY IMAGE
  // ==========================================

  const setPrimaryImage = (
    imageId: string
  ) => {
    setPrimaryImageId(imageId);
  };

  // ==========================================
  // UPLOAD IMAGES
  // ==========================================

  const uploadImages = async (
    vehicleId: string
  ) => {
    if (
      selectedImages.length === 0
    ) {
      return;
    }

    for (
      const image of selectedImages
    ) {
      await webUtilsApi.uploadVehicleImage(
        vehicleId,
        image.file,
        image.id === primaryImageId
      );
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!name.trim()) {
      setError(
        isHindi
          ? "वाहन का नाम आवश्यक है।"
          : "Vehicle name is required."
      );

      return;
    }

    if (!brand.trim()) {
      setError(
        isHindi
          ? "ब्रांड आवश्यक है।"
          : "Brand is required."
      );

      return;
    }

    if (!model.trim()) {
      setError(
        isHindi
          ? "मॉडल आवश्यक है।"
          : "Model is required."
      );

      return;
    }

    if (
      !price ||
      Number(price) < 0
    ) {
      setError(
        isHindi
          ? "कृपया सही कीमत दर्ज करें।"
          : "Please enter a valid price."
      );

      return;
    }

    // ----------------------------------------
    // CREATE PAYLOAD
    // ----------------------------------------

    const payload: CreateVehiclePayload =
      {
        name: name.trim(),

        brand: brand.trim(),

        model: model.trim(),

        vehicle_type: vehicleType,

        price: Number(price),

        battery_capacity:
          batteryCapacity.trim(),

        range_km: rangeKm
          ? Number(rangeKm)
          : null,

        charging_time:
          chargingTime.trim(),

        seating_capacity:
          seatingCapacity
            ? Number(seatingCapacity)
            : null,

        payload_capacity:
          payloadCapacity.trim(),

        top_speed: topSpeed
          ? Number(topSpeed)
          : null,

        description:
          description.trim(),

        specifications,

        is_available: isAvailable,
      };

    try {
      setLoading(true);

      // --------------------------------------
      // STEP 1: CREATE VEHICLE
      // --------------------------------------

      const createdVehicle =
        await webUtilsApi.createVehicle(
          payload
        );

      // --------------------------------------
      // STEP 2: UPLOAD IMAGES
      // --------------------------------------

      if (
        selectedImages.length > 0
      ) {
        try {
          await uploadImages(
            createdVehicle.id
          );
        } catch (imageError) {
          console.error(
            "Vehicle created but image upload failed:",
            imageError
          );

          setError(
            isHindi
              ? "वाहन बन गया है, लेकिन कुछ इमेज अपलोड नहीं हो सकीं। कृपया वाहन को एडिट करके दोबारा इमेज अपलोड करें।"
              : "Vehicle was created, but some images could not be uploaded. Please edit the vehicle and upload the images again."
          );

          setLoading(false);

          return;
        }
      }

      // --------------------------------------
      // STEP 3: SUCCESS
      // --------------------------------------

      navigate(
        "/manager/vehicles"
      );
    } catch (err) {
      console.error(
        "Failed to create vehicle:",
        err
      );

      setError(
        isHindi
          ? "वाहन बनाया नहीं जा सका। कृपया दोबारा कोशिश करें।"
          : "Unable to create vehicle. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      {/* ======================================
          HEADER
      ====================================== */}

      <section className="border-b border-gray-100 bg-[#F4F8F5]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/manager/vehicles"
            className="text-sm font-semibold text-[#0F5C4D] hover:underline"
          >
            ←{" "}
            {isHindi
              ? "वाहनों पर वापस जाएं"
              : "Back to Vehicles"}
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
            {t.manager.panel}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl">
            {t.manager.vehiclesPage.addVehicle}
          </h1>

          <p className="mt-3 text-gray-600">
            {isHindi
              ? "अपने कैटलॉग में नया ई-रिक्शा जोड़ें।"
              : "Add a new e-rickshaw to your vehicle catalogue."}
          </p>
        </div>
      </section>

      {/* ======================================
          FORM
      ====================================== */}

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
          >
            {/* =================================
                ERROR
            ================================= */}

            {error && (
              <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium leading-6 text-red-700">
                {error}
              </div>
            )}

            {/* =================================
                BASIC INFORMATION
            ================================= */}

            <div>
              <h2 className="text-xl font-bold text-[#123C35]">
                {isHindi
                  ? "मूल जानकारी"
                  : "Basic Information"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isHindi
                  ? "वाहन की मुख्य जानकारी दर्ज करें।"
                  : "Enter the basic information about the vehicle."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {isHindi
                    ? "वाहन का नाम"
                    : "Vehicle Name"}
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "उदाहरण: Anmol Electric Plus"
                      : "Example: Anmol Electric Plus"
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                />
              </div>

              {/* BRAND */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {isHindi
                    ? "ब्रांड"
                    : "Brand"}
                </label>

                <input
                  type="text"
                  value={brand}
                  onChange={(event) =>
                    setBrand(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "उदाहरण: Anmol"
                      : "Example: Anmol"
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                />
              </div>

              {/* MODEL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {isHindi
                    ? "मॉडल"
                    : "Model"}
                </label>

                <input
                  type="text"
                  value={model}
                  onChange={(event) =>
                    setModel(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "उदाहरण: A1"
                      : "Example: A1"
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                />
              </div>

              {/* VEHICLE TYPE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {isHindi
                    ? "वाहन प्रकार"
                    : "Vehicle Type"}
                </label>

                <select
                  value={vehicleType}
                  onChange={(event) =>
                    setVehicleType(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                >
                  <option value="E_RICKSHAW">
                    {isHindi
                      ? "ई-रिक्शा"
                      : "E-Rickshaw"}
                  </option>

                  <option value="CARGO">
                    {isHindi
                      ? "कार्गो ई-रिक्शा"
                      : "Cargo E-Rickshaw"}
                  </option>
                </select>
              </div>

              {/* PRICE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {isHindi
                    ? "कीमत"
                    : "Price"}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    placeholder="150000"
                    className="h-12 w-full rounded-xl border border-gray-200 pl-9 pr-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                  />
                </div>
              </div>

              {/* AVAILABILITY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {isHindi
                    ? "उपलब्धता"
                    : "Availability"}
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setIsAvailable(
                      (current) =>
                        !current
                    )
                  }
                  className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 text-sm font-semibold transition ${
                    isAvailable
                      ? "border-[#B8DDCE] bg-[#F1FAF6] text-[#0F5C4D]"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  <span>
                    {isAvailable
                      ? isHindi
                        ? "उपलब्ध"
                        : "Available"
                      : isHindi
                      ? "अनुपलब्ध"
                      : "Unavailable"}
                  </span>

                  <span
                    className={`h-3 w-3 rounded-full ${
                      isAvailable
                        ? "bg-[#0F8B6D]"
                        : "bg-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* =================================
                TECHNICAL INFORMATION
            ================================= */}

            <div className="mt-12 border-t border-gray-100 pt-10">
              <h2 className="text-xl font-bold text-[#123C35]">
                {isHindi
                  ? "तकनीकी जानकारी"
                  : "Technical Information"}
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* BATTERY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isHindi
                      ? "बैटरी क्षमता"
                      : "Battery Capacity"}
                  </label>

                  <input
                    type="text"
                    value={batteryCapacity}
                    onChange={(event) =>
                      setBatteryCapacity(
                        event.target.value
                      )
                    }
                    placeholder="48V 100Ah"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D]"
                  />
                </div>

                {/* RANGE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isHindi
                      ? "रेंज"
                      : "Range"}
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={rangeKm}
                      onChange={(event) =>
                        setRangeKm(
                          event.target.value
                        )
                      }
                      placeholder="120"
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-14 text-sm outline-none transition focus:border-[#0F5C4D]"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      km
                    </span>
                  </div>
                </div>

                {/* CHARGING */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isHindi
                      ? "चार्जिंग समय"
                      : "Charging Time"}
                  </label>

                  <input
                    type="text"
                    value={chargingTime}
                    onChange={(event) =>
                      setChargingTime(
                        event.target.value
                      )
                    }
                    placeholder="6-8 hours"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D]"
                  />
                </div>

                {/* SEATING */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isHindi
                      ? "सीट क्षमता"
                      : "Seating Capacity"}
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={seatingCapacity}
                    onChange={(event) =>
                      setSeatingCapacity(
                        event.target.value
                      )
                    }
                    placeholder="4"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D]"
                  />
                </div>

                {/* PAYLOAD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isHindi
                      ? "पेलोड क्षमता"
                      : "Payload Capacity"}
                  </label>

                  <input
                    type="text"
                    value={payloadCapacity}
                    onChange={(event) =>
                      setPayloadCapacity(
                        event.target.value
                      )
                    }
                    placeholder="500 kg"
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D]"
                  />
                </div>

                {/* TOP SPEED */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isHindi
                      ? "अधिकतम गति"
                      : "Top Speed"}
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={topSpeed}
                      onChange={(event) =>
                        setTopSpeed(
                          event.target.value
                        )
                      }
                      placeholder="45"
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-16 text-sm outline-none transition focus:border-[#0F5C4D]"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      km/h
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================
                DESCRIPTION
            ================================= */}

            <div className="mt-12 border-t border-gray-100 pt-10">
              <h2 className="text-xl font-bold text-[#123C35]">
                {isHindi
                  ? "विवरण"
                  : "Description"}
              </h2>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={5}
                placeholder={
                  isHindi
                    ? "वाहन के बारे में जानकारी..."
                    : "Describe the vehicle..."
                }
                className="mt-5 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
              />
            </div>

            {/* =================================
                ADDITIONAL SPECIFICATIONS
            ================================= */}

            <div className="mt-12 border-t border-gray-100 pt-10">
              <h2 className="text-xl font-bold text-[#123C35]">
                {isHindi
                  ? "अतिरिक्त स्पेसिफिकेशन"
                  : "Additional Specifications"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isHindi
                  ? "जरूरत के अनुसार अतिरिक्त जानकारी जोड़ें।"
                  : "Add additional vehicle specifications if needed."}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="text"
                  value={specificationKey}
                  onChange={(event) =>
                    setSpecificationKey(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "नाम"
                      : "Name"
                  }
                  className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F5C4D]"
                />

                <input
                  type="text"
                  value={specificationValue}
                  onChange={(event) =>
                    setSpecificationValue(
                      event.target.value
                    )
                  }
                  placeholder={
                    isHindi
                      ? "मान"
                      : "Value"
                  }
                  className="h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#0F5C4D]"
                />

                <button
                  type="button"
                  onClick={
                    addSpecification
                  }
                  className="h-11 rounded-xl bg-[#E6F3ED] px-5 text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#D5EDE3]"
                >
                  +{" "}
                  {isHindi
                    ? "जोड़ें"
                    : "Add"}
                </button>
              </div>

              {Object.keys(
                specifications
              ).length > 0 && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-gray-100">
                  {Object.entries(
                    specifications
                  ).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#123C35]">
                            {key}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {value}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeSpecification(
                              key
                            )
                          }
                          className="shrink-0 text-xs font-semibold text-red-500 hover:underline"
                        >
                          {isHindi
                            ? "हटाएं"
                            : "Remove"}
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* =================================
                VEHICLE IMAGES
            ================================= */}

            <div className="mt-12 border-t border-gray-100 pt-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#123C35]">
                    {isHindi
                      ? "वाहन की तस्वीरें"
                      : "Vehicle Images"}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {isHindi
                      ? "एक या एक से अधिक तस्वीरें अपलोड करें। आप किसी भी तस्वीर को मुख्य तस्वीर बना सकते हैं।"
                      : "Upload one or more images. You can choose any image as the primary image."}
                  </p>
                </div>

                {selectedImages.length >
                  0 && (
                  <p className="text-sm font-semibold text-[#0F5C4D]">
                    {selectedImages.length}{" "}
                    {isHindi
                      ? "तस्वीरें चुनी गईं"
                      : selectedImages.length ===
                        1
                      ? "image selected"
                      : "images selected"}
                  </p>
                )}
              </div>

              {/* UPLOAD BOX */}

              <label
                htmlFor="vehicle-images"
                className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#B8DDCE] bg-[#F4FAF7] px-6 py-10 text-center transition hover:border-[#0F8B6D] hover:bg-[#EDF8F3]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F3ED] text-2xl">
                  📷
                </div>

                <p className="mt-4 text-sm font-bold text-[#123C35]">
                  {isHindi
                    ? "तस्वीरें चुनें"
                    : "Choose Images"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {isHindi
                    ? "PNG, JPG, JPEG या WEBP"
                    : "PNG, JPG, JPEG or WEBP"}
                </p>

                <span className="mt-4 rounded-full bg-[#0F5C4D] px-5 py-2.5 text-xs font-semibold text-white">
                  {isHindi
                    ? "तस्वीरें अपलोड करें"
                    : "Select Images"}
                </span>

                <input
                  id="vehicle-images"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  onChange={
                    handleImageSelect
                  }
                  className="hidden"
                />
              </label>

              {/* IMAGE PREVIEWS */}

              {selectedImages.length >
                0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {selectedImages.map(
                    (image) => {
                      const isPrimary =
                        image.id ===
                        primaryImageId;

                      return (
                        <div
                          key={image.id}
                          className={`group relative overflow-hidden rounded-2xl border-2 bg-white transition ${
                            isPrimary
                              ? "border-[#0F5C4D] shadow-md"
                              : "border-gray-100"
                          }`}
                        >
                          {/* IMAGE */}

                          <div className="aspect-square bg-[#F4F8F5]">
                            <img
                              src={
                                image.preview
                              }
                              alt={
                                image.file.name
                              }
                              className="h-full w-full object-contain p-2"
                            />
                          </div>

                          {/* PRIMARY BADGE */}

                          {isPrimary && (
                            <div className="absolute left-2 top-2 rounded-full bg-[#0F5C4D] px-2.5 py-1 text-[10px] font-bold text-white">
                              {isHindi
                                ? "मुख्य"
                                : "Primary"}
                            </div>
                          )}

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeSelectedImage(
                                image.id
                              )
                            }
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-red-500 shadow-sm transition hover:bg-red-50"
                            aria-label={
                              isHindi
                                ? "तस्वीर हटाएं"
                                : "Remove image"
                            }
                          >
                            ×
                          </button>

                          {/* FOOTER */}

                          <div className="p-3">
                            <p className="truncate text-xs font-medium text-gray-600">
                              {
                                image.file
                                  .name
                              }
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                setPrimaryImage(
                                  image.id
                                )
                              }
                              disabled={
                                isPrimary
                              }
                              className={`mt-2 w-full rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                isPrimary
                                  ? "cursor-default bg-[#E6F3ED] text-[#0F5C4D]"
                                  : "bg-gray-100 text-gray-600 hover:bg-[#E6F3ED] hover:text-[#0F5C4D]"
                              }`}
                            >
                              {isPrimary
                                ? isHindi
                                  ? "मुख्य तस्वीर"
                                  : "Primary Image"
                                : isHindi
                                ? "मुख्य बनाएं"
                                : "Set as Primary"}
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              {/* IMAGE NOTE */}

              <div className="mt-4 rounded-xl bg-[#F8FAF9] px-4 py-3 text-xs leading-5 text-gray-500">
                {isHindi
                  ? "पहली चुनी गई तस्वीर अपने आप मुख्य तस्वीर बन जाएगी। आप बाद में किसी दूसरी तस्वीर को मुख्य बना सकते हैं।"
                  : "The first selected image is automatically marked as primary. You can choose another image as primary before creating the vehicle."}
              </div>
            </div>

            {/* =================================
                ACTIONS
            ================================= */}

            <div className="mt-12 flex flex-col-reverse gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:justify-end">
              <Link
                to="/manager/vehicles"
                className="rounded-full border border-gray-200 px-7 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                {isHindi
                  ? "रद्द करें"
                  : "Cancel"}
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#0F5C4D] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? isHindi
                    ? selectedImages.length >
                      0
                      ? "वाहन और तस्वीरें अपलोड हो रही हैं..."
                      : "बनाया जा रहा है..."
                    : selectedImages.length >
                      0
                    ? "Creating & uploading images..."
                    : "Creating..."
                  : isHindi
                  ? "वाहन बनाएं"
                  : "Create Vehicle"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AddVehicle;