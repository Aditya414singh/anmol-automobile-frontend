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

import { webUtilsApi } from "../../api/webUtilsApi";
import type { UpdateVehiclePayload } from "../../api/webUtilsApi";

import type { VehicleImage } from "../../types/vehicle";

import { useLanguage } from "../../context/LanguageContext";
import { compressImage } from "../../utils/compressImage";

interface SpecificationItem {
  key: string;
  value: string;
}

const EditVehicle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { language } = useLanguage();

  const isHindi = language === "hi";

  // ==========================================
  // PAGE STATE
  // ==========================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // VEHICLE FIELDS
  // ==========================================

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const [vehicleType, setVehicleType] =
    useState("E_RICKSHAW");

  const [price, setPrice] = useState("");

  const [batteryCapacity, setBatteryCapacity] =
    useState("");

  const [rangeKm, setRangeKm] = useState("");

  const [chargingTime, setChargingTime] =
    useState("");

  const [seatingCapacity, setSeatingCapacity] =
    useState("");

  const [payloadCapacity, setPayloadCapacity] =
    useState("");

  const [topSpeed, setTopSpeed] = useState("");

  const [description, setDescription] =
    useState("");

  const [isAvailable, setIsAvailable] =
    useState(true);

  // ==========================================
  // SPECIFICATIONS
  // ==========================================

  const [specifications, setSpecifications] =
    useState<SpecificationItem[]>([]);

  // ==========================================
  // IMAGES
  // ==========================================

  const [images, setImages] =
    useState<VehicleImage[]>([]);

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [uploadAsPrimary, setUploadAsPrimary] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [deletingImageId, setDeletingImageId] =
    useState<string | null>(null);

  const [imageError, setImageError] =
    useState("");

  // ==========================================
  // LOAD VEHICLE
  // ==========================================

  useEffect(() => {
    if (!id) {
      setError(
        isHindi
          ? "वाहन की जानकारी नहीं मिली।"
          : "Vehicle ID is missing."
      );

      setLoading(false);

      return;
    }

    const loadVehicle = async () => {
      try {
        setLoading(true);
        setError("");

        const vehicle =
          await webUtilsApi.getManagerVehicleById(id);

        // Basic information
        setName(vehicle.name ?? "");
        setBrand(vehicle.brand ?? "");
        setModel(vehicle.model ?? "");

        setVehicleType(
          vehicle.vehicle_type ??
            "E_RICKSHAW"
        );

        setPrice(
          vehicle.price !== null &&
            vehicle.price !== undefined
            ? String(vehicle.price)
            : ""
        );

        setIsAvailable(
          Boolean(vehicle.is_available)
        );

        // Technical information
        setBatteryCapacity(
          vehicle.battery_capacity ?? ""
        );

        setRangeKm(
          vehicle.range_km !== null &&
            vehicle.range_km !== undefined
            ? String(vehicle.range_km)
            : ""
        );

        setChargingTime(
          vehicle.charging_time ?? ""
        );

        setSeatingCapacity(
          vehicle.seating_capacity !== null &&
            vehicle.seating_capacity !== undefined
            ? String(
                vehicle.seating_capacity
              )
            : ""
        );

        setPayloadCapacity(
          vehicle.payload_capacity ?? ""
        );

        setTopSpeed(
          vehicle.top_speed !== null &&
            vehicle.top_speed !== undefined
            ? String(vehicle.top_speed)
            : ""
        );

        // Description
        setDescription(
          vehicle.description ?? ""
        );

        // Specifications
        const existingSpecifications =
          vehicle.specifications ?? {};

        const specificationRows =
          Object.entries(
            existingSpecifications
          ).map(([key, value]) => ({
            key,
            value: String(value),
          }));

        setSpecifications(
          specificationRows
        );

        // Images
        setImages(
          vehicle.images ?? []
        );
      } catch (err) {
        console.error(
          "Failed to load vehicle:",
          err
        );

        setError(
          isHindi
            ? "वाहन की जानकारी लोड नहीं हो सकी।"
            : "Unable to load vehicle details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id, isHindi]);

  // ==========================================
  // SPECIFICATIONS
  // ==========================================

  const addSpecification = () => {
    setSpecifications((current) => [
      ...current,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setSpecifications((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeSpecification = (
    index: number
  ) => {
    setSpecifications((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  // ==========================================
  // IMAGE SELECTION
  // ==========================================

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setImageError(
        isHindi
          ? "कृपया केवल इमेज फाइल चुनें।"
          : "Please select a valid image file."
      );

      event.target.value = "";

      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        isHindi
          ? "इमेज का आकार 5 MB से कम होना चाहिए।"
          : "Image size must be less than 5 MB."
      );

      event.target.value = "";

      return;
    }

    // Remove previous object URL
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);
  };

  // ==========================================
  // CLEAR SELECTED IMAGE
  // ==========================================

  const clearSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(null);
    setImagePreview("");
    setUploadAsPrimary(false);
  };

  // ==========================================
  // UPLOAD IMAGE
  // ==========================================

 const handleUploadImage = async () => {
  if (!id) {
    return;
  }

  if (!selectedImage) {
    setImageError(
      isHindi
        ? "पहले एक इमेज चुनें।"
        : "Please select an image first."
    );

    return;
  }

  try {
    setUploadingImage(true);
    setImageError("");

    // Compress image before uploading to Cloudinary
    const compressedImage = await compressImage(
      selectedImage,
      1800,
      0.85
    );

    console.log(
      "Original image size:",
      (selectedImage.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    console.log(
      "Compressed image size:",
      (compressedImage.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    const uploadedImage =
      await webUtilsApi.uploadVehicleImage(
        id,
        compressedImage,
        uploadAsPrimary
      );

    setImages((current) => {
      if (uploadedImage.is_primary) {
        return [
          ...current.map((image) => ({
            ...image,
            is_primary: false,
          })),
          uploadedImage,
        ];
      }

      return [
        ...current,
        uploadedImage,
      ];
    });

    clearSelectedImage();
  } catch (err) {
    console.error(
      "Failed to upload image:",
      err
    );

    setImageError(
      isHindi
        ? "इमेज अपलोड नहीं हो सकी। कृपया दोबारा कोशिश करें।"
        : "Unable to upload image. Please try again."
    );
  } finally {
    setUploadingImage(false);
  }
};

  // ==========================================
  // DELETE IMAGE
  // ==========================================

  const handleDeleteImage = async (
    imageId: string
  ) => {
    if (!id) {
      return;
    }

    const confirmed =
      window.confirm(
        isHindi
          ? "क्या आप इस इमेज को हटाना चाहते हैं?"
          : "Are you sure you want to delete this image?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingImageId(imageId);
      setImageError("");

      await webUtilsApi.deleteVehicleImage(
        id,
        imageId
      );

      setImages((current) =>
        current.filter(
          (image) =>
            image.id !== imageId
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete image:",
        err
      );

      setImageError(
        isHindi
          ? "इमेज हटाई नहीं जा सकी।"
          : "Unable to delete image."
      );
    } finally {
      setDeletingImageId(null);
    }
  };

  // ==========================================
  // UPDATE VEHICLE
  // ==========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!id) {
      setError(
        isHindi
          ? "वाहन की ID नहीं मिली।"
          : "Vehicle ID is missing."
      );

      return;
    }

    // Basic validation
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
      price === "" ||
      Number(price) < 0
    ) {
      setError(
        isHindi
          ? "कृपया सही कीमत दर्ज करें।"
          : "Please enter a valid price."
      );

      return;
    }

    // Build specifications object
    const specificationObject: Record<
      string,
      string
    > = {};

    for (const specification of specifications) {
      const key =
        specification.key.trim();

      const value =
        specification.value.trim();

      // Ignore completely empty rows
      if (!key && !value) {
        continue;
      }

      if (!key || !value) {
        setError(
          isHindi
            ? "हर स्पेसिफिकेशन में नाम और मान दोनों दर्ज करें।"
            : "Please provide both name and value for every specification."
        );

        return;
      }

      specificationObject[key] = value;
    }

    // Build payload
    const payload: UpdateVehiclePayload = {
      name: name.trim(),

      brand: brand.trim(),

      model: model.trim(),

      vehicle_type: vehicleType,

      price: Number(price),

      battery_capacity:
        batteryCapacity.trim(),

      range_km:
        rangeKm === ""
          ? null
          : Number(rangeKm),

      charging_time:
        chargingTime.trim(),

      seating_capacity:
        seatingCapacity === ""
          ? null
          : Number(seatingCapacity),

      payload_capacity:
        payloadCapacity.trim(),

      top_speed:
        topSpeed === ""
          ? null
          : Number(topSpeed),

      description:
        description.trim(),

      specifications:
        specificationObject,

      is_available: isAvailable,
    };

    try {
      setSaving(true);

      await webUtilsApi.updateVehicle(
        id,
        payload
      );

      navigate("/manager/vehicles");
    } catch (err) {
      console.error(
        "Failed to update vehicle:",
        err
      );

      setError(
        isHindi
          ? "वाहन अपडेट नहीं हो सका। कृपया दोबारा कोशिश करें।"
          : "Unable to update vehicle. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAF9]">
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />

            <div className="mt-5 h-10 w-72 animate-pulse rounded bg-gray-200" />

            <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {Array.from({
                  length: 12,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      {/* ======================================
          HEADER
      ====================================== */}

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/manager/vehicles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F5C4D] transition hover:text-[#0B493D]"
          >
            <span>←</span>

            {isHindi
              ? "वाहनों पर वापस जाएं"
              : "Back to Vehicles"}
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">
            {isHindi
              ? "मैनेजर"
              : "Manager"}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#123C35] sm:text-4xl">
            {isHindi
              ? "वाहन संपादित करें"
              : "Edit Vehicle"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
            {isHindi
              ? "वाहन की सभी जानकारी, स्पेसिफिकेशन और इमेज अपडेट करें।"
              : "Update vehicle information, specifications and images."}
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
            {/* ERROR */}
            {error && (
              <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* ==================================
                BASIC INFORMATION
            ================================== */}

            <div>
              <h2 className="text-xl font-bold text-[#123C35]">
                {isHindi
                  ? "मूल जानकारी"
                  : "Basic Information"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isHindi
                  ? "वाहन की मुख्य जानकारी।"
                  : "Basic information about the vehicle."}
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
                  placeholder="Anmol Electric Plus"
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
                  placeholder="Anmol"
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
                  placeholder="A1"
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
                    E-Rickshaw
                  </option>

                  <option value="CARGO">
                    Cargo E-Rickshaw
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
                    step="0.01"
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

            {/* ==================================
                TECHNICAL INFORMATION
            ================================== */}

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
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
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
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-14 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
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
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
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
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
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
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
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
                      className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-16 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      km/h
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================
                DESCRIPTION
            ================================== */}

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
                rows={6}
                placeholder={
                  isHindi
                    ? "वाहन के बारे में जानकारी..."
                    : "Describe the vehicle..."
                }
                className="mt-5 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
              />
            </div>

            {/* ==================================
                SPECIFICATIONS
            ================================== */}

            <div className="mt-12 border-t border-gray-100 pt-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#123C35]">
                    {isHindi
                      ? "अतिरिक्त स्पेसिफिकेशन"
                      : "Additional Specifications"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {isHindi
                      ? "मौजूदा स्पेसिफिकेशन को सीधे एडिट करें या नया जोड़ें।"
                      : "Edit existing specifications directly or add new ones."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addSpecification
                  }
                  className="inline-flex w-fit items-center rounded-full bg-[#E6F3ED] px-5 py-2.5 text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#D5EDE3]"
                >
                  +{" "}
                  {isHindi
                    ? "स्पेसिफिकेशन जोड़ें"
                    : "Add Specification"}
                </button>
              </div>

              {specifications.length ===
                0 && (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-[#F8FAF9] p-8 text-center">
                  <p className="text-sm text-gray-500">
                    {isHindi
                      ? "अभी कोई अतिरिक्त स्पेसिफिकेशन नहीं है।"
                      : "No additional specifications added."}
                  </p>

                  <button
                    type="button"
                    onClick={
                      addSpecification
                    }
                    className="mt-4 text-sm font-semibold text-[#0F5C4D] hover:underline"
                  >
                    {isHindi
                      ? "पहला स्पेसिफिकेशन जोड़ें"
                      : "Add the first specification"}
                  </button>
                </div>
              )}

              {specifications.length >
                0 && (
                <div className="mt-5 space-y-3">
                  {specifications.map(
                    (
                      specification,
                      index
                    ) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-gray-100 bg-[#F8FAF9] p-4"
                      >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                              {isHindi
                                ? "नाम"
                                : "Name"}
                            </label>

                            <input
                              type="text"
                              value={
                                specification.key
                              }
                              onChange={(
                                event
                              ) =>
                                updateSpecification(
                                  index,
                                  "key",
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                              {isHindi
                                ? "मान"
                                : "Value"}
                            </label>

                            <input
                              type="text"
                              value={
                                specification.value
                              }
                              onChange={(
                                event
                              ) =>
                                updateSpecification(
                                  index,
                                  "value",
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() =>
                                removeSpecification(
                                  index
                                )
                              }
                              className="h-11 w-full rounded-xl border border-red-100 bg-white px-4 text-sm font-semibold text-red-500 transition hover:bg-red-50 sm:w-auto"
                            >
                              {isHindi
                                ? "हटाएं"
                                : "Remove"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* ==================================
                VEHICLE IMAGES
            ================================== */}

            <div className="mt-12 border-t border-gray-100 pt-10">
              <div>
                <h2 className="text-xl font-bold text-[#123C35]">
                  {isHindi
                    ? "वाहन की इमेज"
                    : "Vehicle Images"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {isHindi
                    ? "वाहन की इमेज अपलोड करें और मौजूदा इमेज मैनेज करें।"
                    : "Upload vehicle images and manage existing images."}
                </p>
              </div>

              {/* IMAGE ERROR */}
              {imageError && (
                <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                  {imageError}
                </div>
              )}

              {/* UPLOAD AREA */}
              <div className="mt-6 rounded-3xl border border-dashed border-[#B8DDCE] bg-[#F5FBF8] p-5 sm:p-7">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
                  {/* FILE PICKER */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {isHindi
                        ? "नई इमेज चुनें"
                        : "Choose New Image"}
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-[#0F5C4D] file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0B493D]"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      {isHindi
                        ? "अधिकतम आकार: 5 MB"
                        : "Maximum size: 5 MB"}
                    </p>

                    {/* PRIMARY CHECKBOX */}
                    <label className="mt-5 flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          uploadAsPrimary
                        }
                        onChange={(
                          event
                        ) =>
                          setUploadAsPrimary(
                            event.target
                              .checked
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-[#0F5C4D] focus:ring-[#0F5C4D]"
                      />

                      <span className="text-sm font-medium text-gray-700">
                        {isHindi
                          ? "इसे मुख्य इमेज बनाएं"
                          : "Set as primary image"}
                      </span>
                    </label>

                    {/* UPLOAD BUTTON */}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={
                          handleUploadImage
                        }
                        disabled={
                          !selectedImage ||
                          uploadingImage
                        }
                        className="rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {uploadingImage
                          ? isHindi
                            ? "अपलोड हो रहा है..."
                            : "Uploading..."
                          : isHindi
                          ? "इमेज अपलोड करें"
                          : "Upload Image"}
                      </button>

                      {selectedImage && (
                        <button
                          type="button"
                          onClick={
                            clearSelectedImage
                          }
                          disabled={
                            uploadingImage
                          }
                          className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-white disabled:opacity-50"
                        >
                          {isHindi
                            ? "रद्द करें"
                            : "Clear"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PREVIEW */}
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      {isHindi
                        ? "पूर्वावलोकन"
                        : "Preview"}
                    </p>

                    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white">
                      {imagePreview ? (
                        <img
                          src={
                            imagePreview
                          }
                          alt="Preview"
                          className="h-full w-full object-contain p-3"
                        />
                      ) : (
                        <div className="px-5 text-center">
                          <div className="text-4xl">
                            🖼️
                          </div>

                          <p className="mt-2 text-xs text-gray-400">
                            {isHindi
                              ? "इमेज चुनने के बाद यहां प्रीव्यू दिखाई देगा।"
                              : "Image preview will appear here."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXISTING IMAGES */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#123C35]">
                    {isHindi
                      ? "मौजूदा इमेज"
                      : "Existing Images"}
                  </h3>

                  <span className="rounded-full bg-[#E6F3ED] px-3 py-1 text-xs font-semibold text-[#0F5C4D]">
                    {images.length}{" "}
                    {isHindi
                      ? "इमेज"
                      : images.length === 1
                      ? "Image"
                      : "Images"}
                  </span>
                </div>

                {images.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-[#F8FAF9] p-10 text-center">
                    <div className="text-5xl">
                      🖼️
                    </div>

                    <p className="mt-4 text-sm font-semibold text-gray-600">
                      {isHindi
                        ? "अभी कोई इमेज नहीं है।"
                        : "No images uploaded yet."}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {isHindi
                        ? "ऊपर से पहली इमेज अपलोड करें।"
                        : "Upload the first vehicle image above."}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map(
                      (image) => (
                        <div
                          key={image.id}
                          className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                        >
                          {/* IMAGE */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F8F5]">
                            <img
                              src={
                                image.image_url
                              }
                              alt={
                                name ||
                                "Vehicle"
                              }
                              className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                            />

                            {/* PRIMARY BADGE */}
                            {image.is_primary && (
                              <div className="absolute left-3 top-3">
                                <span className="rounded-full bg-[#0F5C4D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                                  ★{" "}
                                  {isHindi
                                    ? "मुख्य इमेज"
                                    : "Primary"}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* IMAGE ACTIONS */}
                          <div className="flex items-center justify-between gap-3 p-4">
                            <div className="min-w-0">
                              <p className="truncate text-xs text-gray-400">
                                {image.public_id ||
                                  image.id}
                              </p>

                              {image.is_primary && (
                                <p className="mt-1 text-xs font-semibold text-[#0F5C4D]">
                                  {isHindi
                                    ? "मुख्य वाहन इमेज"
                                    : "Primary vehicle image"}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteImage(
                                  image.id
                                )
                              }
                              disabled={
                                deletingImageId ===
                                image.id
                              }
                              className="shrink-0 rounded-full border border-red-100 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingImageId ===
                              image.id
                                ? "..."
                                : isHindi
                                ? "हटाएं"
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ==================================
                ACTIONS
            ================================== */}

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
                disabled={saving}
                className="rounded-full bg-[#0F5C4D] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0B493D] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? isHindi
                    ? "अपडेट किया जा रहा है..."
                    : "Updating..."
                  : isHindi
                  ? "वाहन अपडेट करें"
                  : "Update Vehicle"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default EditVehicle;