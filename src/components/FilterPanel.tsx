import {
  useLanguage,
} from "../context/LanguageContext";


interface FilterPanelProps {

  search: string;

  brand: string;

  vehicleType: string;

  minPrice: string;

  maxPrice: string;

  brands: string[];

  vehicleTypes: string[];

  onSearchChange: (
    value: string
  ) => void;

  onBrandChange: (
    value: string
  ) => void;

  onVehicleTypeChange: (
    value: string
  ) => void;

  onMinPriceChange: (
    value: string
  ) => void;

  onMaxPriceChange: (
    value: string
  ) => void;

  onSearch: () => void;

  onClear: () => void;

}


const FilterPanel = ({
  search,
  brand,
  vehicleType,
  minPrice,
  maxPrice,
  brands,
  vehicleTypes,
  onSearchChange,
  onBrandChange,
  onVehicleTypeChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSearch,
  onClear,
}: FilterPanelProps) => {

  const { language } =
    useLanguage();


  return (

    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">


      {/* =====================================================
          FILTER HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <h3 className="text-base font-bold text-[#123C35]">

          {language === "hi"
            ? "फ़िल्टर"
            : "Filters"}

        </h3>


        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-[#0F5C4D] transition hover:underline"
        >

          {language === "hi"
            ? "साफ़ करें"
            : "Clear All"}

        </button>

      </div>


      <div className="mt-5 space-y-5">


        {/* ===================================================
            SEARCH
        =================================================== */}

        <div>

          <label className="mb-2 block text-xs font-semibold text-gray-500">

            {language === "hi"
              ? "वाहन खोजें"
              : "Search Vehicles"}

          </label>


          <div className="flex gap-2">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
              onKeyDown={(event) => {

                if (
                  event.key ===
                  "Enter"
                ) {

                  onSearch();

                }

              }}
              placeholder={
                language === "hi"
                  ? "नाम, ब्रांड या मॉडल खोजें"
                  : "Search name, brand or model"
              }
              className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
            />


            <button
              type="button"
              onClick={onSearch}
              className="h-11 shrink-0 rounded-xl bg-[#0F5C4D] px-4 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
            >

              {language === "hi"
                ? "खोजें"
                : "Search"}

            </button>

          </div>

        </div>


        {/* ===================================================
            DIVIDER
        =================================================== */}

        <div className="border-t border-gray-100" />


        {/* ===================================================
            BRAND
        =================================================== */}

        <div>

          <label className="mb-2 block text-xs font-semibold text-gray-500">

            {language === "hi"
              ? "ब्रांड"
              : "Brand"}

          </label>


          <select
            value={brand}
            onChange={(event) =>
              onBrandChange(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
          >

            <option value="">

              {language === "hi"
                ? "सभी ब्रांड"
                : "All Brands"}

            </option>


            {brands.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>


        {/* ===================================================
            VEHICLE TYPE
        =================================================== */}

        <div>

          <label className="mb-2 block text-xs font-semibold text-gray-500">

            {language === "hi"
              ? "वाहन प्रकार"
              : "Vehicle Type"}

          </label>


          <select
            value={vehicleType}
            onChange={(event) =>
              onVehicleTypeChange(
                event.target.value
              )
            }
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
          >

            <option value="">

              {language === "hi"
                ? "सभी प्रकार"
                : "All Types"}

            </option>


            {vehicleTypes.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >

                  {item.replaceAll(
                    "_",
                    " "
                  )}

                </option>

              )
            )}

          </select>

        </div>


        {/* ===================================================
            PRICE
        =================================================== */}

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
                onMinPriceChange(
                  event.target.value
                )
              }
              placeholder={
                language === "hi"
                  ? "न्यूनतम"
                  : "Min"
              }
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
            />


            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) =>
                onMaxPriceChange(
                  event.target.value
                )
              }
              placeholder={
                language === "hi"
                  ? "अधिकतम"
                  : "Max"
              }
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0F5C4D] focus:ring-2 focus:ring-[#0F5C4D]/10"
            />

          </div>

        </div>


        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="grid grid-cols-2 gap-3 pt-1">

          <button
            type="button"
            onClick={onSearch}
            className="h-11 rounded-xl bg-[#0F5C4D] px-4 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
          >

            {language === "hi"
              ? "खोजें"
              : "Search"}

          </button>


          <button
            type="button"
            onClick={onClear}
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:border-[#0F5C4D] hover:text-[#0F5C4D]"
          >

            {language === "hi"
              ? "रीसेट"
              : "Reset"}

          </button>

        </div>

      </div>

    </div>

  );

};


export default FilterPanel;