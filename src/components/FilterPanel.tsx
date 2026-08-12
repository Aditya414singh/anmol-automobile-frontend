import { useLanguage } from "../context/LanguageContext";

interface FilterPanelProps {
  brand: string;
  vehicleType: string;
  minPrice: string;
  maxPrice: string;
  brands: string[];
  vehicleTypes: string[];
  onBrandChange: (value: string) => void;
  onVehicleTypeChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClear: () => void;
}

const FilterPanel = ({
  brand,
  vehicleType,
  minPrice,
  maxPrice,
  brands,
  vehicleTypes,
  onBrandChange,
  onVehicleTypeChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
}: FilterPanelProps) => {
  const { language } = useLanguage();

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#123C35]">
          {language === "hi" ? "फ़िल्टर" : "Filters"}
        </h3>

        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-[#0F5C4D] hover:underline"
        >
          {language === "hi" ? "साफ़ करें" : "Clear All"}
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {/* Brand */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-500">
            {language === "hi" ? "ब्रांड" : "Brand"}
          </label>

          <select
            value={brand}
            onChange={(event) => onBrandChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#0F5C4D]"
          >
            <option value="">
              {language === "hi"
                ? "सभी ब्रांड"
                : "All Brands"}
            </option>

            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-500">
            {language === "hi" ? "वाहन प्रकार" : "Vehicle Type"}
          </label>

          <select
            value={vehicleType}
            onChange={(event) =>
              onVehicleTypeChange(event.target.value)
            }
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#0F5C4D]"
          >
            <option value="">
              {language === "hi"
                ? "सभी प्रकार"
                : "All Types"}
            </option>

            {vehicleTypes.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-gray-500">
            {language === "hi"
              ? "कीमत सीमा"
              : "Price Range"}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) =>
                onMinPriceChange(event.target.value)
              }
              placeholder={
                language === "hi" ? "न्यूनतम" : "Min"
              }
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#0F5C4D]"
            />

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) =>
                onMaxPriceChange(event.target.value)
              }
              placeholder={
                language === "hi" ? "अधिकतम" : "Max"
              }
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#0F5C4D]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;