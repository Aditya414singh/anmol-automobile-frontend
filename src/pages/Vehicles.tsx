import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  webUtilsApi,
} from "../api/webUtilsApi";

import type {
  Vehicle,
} from "../types/vehicle";

import VehicleCard from "../components/VehicleCard";

import FilterPanel from "../components/FilterPanel";

const Vehicles = () => {

  const { language } =
    useLanguage();


  const [
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(false);


  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    brand,
    setBrand,
  ] = useState("");


  const [
    vehicleType,
    setVehicleType,
  ] = useState("");


  const [
    minPrice,
    setMinPrice,
  ] = useState("");


  const [
    maxPrice,
    setMaxPrice,
  ] = useState("");


  // ==========================================================
  // LOAD VEHICLES
  // ==========================================================

  const loadVehicles = async (
    filters = {
      search,
      brand,
      vehicleType,
      minPrice,
      maxPrice,
    }
  ) => {

    try {

      setLoading(true);
      setError(false);


      const data =
        await webUtilsApi.getVehicles({

          search:
            filters.search.trim() ||
            undefined,

          brand:
            filters.brand ||
            undefined,

          vehicle_type:
            filters.vehicleType ||
            undefined,

          min_price:
            filters.minPrice
              ? Number(filters.minPrice)
              : undefined,

          max_price:
            filters.maxPrice
              ? Number(filters.maxPrice)
              : undefined,

        });


      setVehicles(data);

    } catch (err) {

      console.error(
        "Failed to load vehicles:",
        err
      );

      setError(true);
      setVehicles([]);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadVehicles();

  }, []);


  // ==========================================================
  // BRANDS
  // ==========================================================

  const brands = useMemo(() => {

    return Array.from(
      new Set(
        vehicles.map(
          (vehicle) =>
            vehicle.brand
        )
      )
    );

  }, [vehicles]);


  // ==========================================================
  // VEHICLE TYPES
  // ==========================================================

  const vehicleTypes =
    useMemo(() => {

      return Array.from(
        new Set(
          vehicles.map(
            (vehicle) =>
              vehicle.vehicle_type
          )
        )
      );

    }, [vehicles]);


  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = () => {

    loadVehicles();

  };


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {

    const emptyFilters = {
      search: "",
      brand: "",
      vehicleType: "",
      minPrice: "",
      maxPrice: "",
    };


    setSearch("");
    setBrand("");
    setVehicleType("");
    setMinPrice("");
    setMaxPrice("");


    loadVehicles(
      emptyFilters
    );

  };


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main className="min-h-screen bg-[#F8FAF9]">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <section className="bg-[#F4F8F5] py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8B6D]">

              {language === "hi"
                ? "अनमोल ऑटोमोबाइल्स"
                : "Anmol Automobiles"}

            </p>


            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#123C35] sm:text-5xl lg:text-6xl">

              {language === "hi"
                ? "हमारे ई-रिक्शा"
                : "Our E-Rickshaws"}

            </h1>


            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">

              {language === "hi"
                ? "अपने काम और बजट के अनुसार भरोसेमंद इलेक्ट्रिक ई-रिक्शा चुनें।"
                : "Explore reliable electric rickshaws designed for everyday journeys and business."}

            </p>

          </div>

        </div>

      </section>


      {/* ====================================================
          CATALOGUE
      ==================================================== */}

      <section className="py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


          {/* =================================================
              MAIN LAYOUT
          ================================================= */}

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">


            {/* =================================================
                FILTERS + SEARCH
            ================================================= */}

            <aside className="lg:sticky lg:top-24 lg:self-start">

              <FilterPanel

                search={search}

                brand={brand}

                vehicleType={vehicleType}

                minPrice={minPrice}

                maxPrice={maxPrice}

                brands={brands}

                vehicleTypes={vehicleTypes}

                onSearchChange={
                  setSearch
                }

                onBrandChange={
                  setBrand
                }

                onVehicleTypeChange={
                  setVehicleType
                }

                onMinPriceChange={
                  setMinPrice
                }

                onMaxPriceChange={
                  setMaxPrice
                }

                onSearch={
                  handleSearch
                }

                onClear={
                  clearFilters
                }

              />

            </aside>


            {/* =================================================
                RESULTS
            ================================================= */}

            <div>

              {/* RESULTS HEADER */}

              <div className="mb-5 flex items-center justify-between">

                <p className="text-sm text-gray-500">

                  {loading

                    ? language === "hi"
                      ? "लोड हो रहा है..."
                      : "Loading..."

                    : language === "hi"
                    ? `${vehicles.length} वाहन मिले`
                    : `${vehicles.length} vehicles found`}

                </p>

              </div>


              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                  {[1, 2, 3, 4].map(
                    (item) => (

                      <div
                        key={item}
                        className="overflow-hidden rounded-3xl bg-white"
                      >

                        <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                        <div className="space-y-4 p-6">

                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                          <div className="h-20 animate-pulse rounded bg-gray-100" />

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}


              {/* =================================================
                  ERROR
              ================================================= */}

              {!loading &&
                error && (

                  <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

                    <div className="text-4xl">
                      ⚠️
                    </div>


                    <h3 className="mt-4 font-bold text-[#123C35]">

                      {language === "hi"
                        ? "वाहन लोड नहीं हो सके"
                        : "Unable to load vehicles"}

                    </h3>


                    <p className="mt-2 text-sm text-gray-500">

                      {language === "hi"
                        ? "कृपया दोबारा कोशिश करें।"
                        : "Please try again."}

                    </p>


                    <button
                      type="button"
                      onClick={() =>
                        loadVehicles()
                      }
                      className="mt-5 rounded-full bg-[#0F5C4D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0B493D]"
                    >

                      {language === "hi"
                        ? "फिर कोशिश करें"
                        : "Try Again"}

                    </button>

                  </div>

                )}


              {/* =================================================
                  EMPTY
              ================================================= */}

              {!loading &&
                !error &&
                vehicles.length === 0 && (

                  <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

                    <div className="text-5xl">
                      🛺
                    </div>


                    <h3 className="mt-4 font-bold text-[#123C35]">

                      {language === "hi"
                        ? "कोई वाहन नहीं मिला"
                        : "No vehicles found"}

                    </h3>


                    <p className="mt-2 text-sm text-gray-500">

                      {language === "hi"
                        ? "अपने फ़िल्टर बदलकर फिर कोशिश करें।"
                        : "Try changing your search or filters."}

                    </p>


                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-5 rounded-full border border-[#0F5C4D] px-6 py-3 text-sm font-semibold text-[#0F5C4D] transition hover:bg-[#0F5C4D] hover:text-white"
                    >

                      {language === "hi"
                        ? "फ़िल्टर साफ़ करें"
                        : "Clear Filters"}

                    </button>

                  </div>

                )}


              {/* =================================================
                  VEHICLE CARDS
              ================================================= */}

              {!loading &&
                !error &&
                vehicles.length > 0 && (

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                    {vehicles.map(
                      (vehicle) => (

                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                        />

                      )
                    )}

                  </div>

                )}

            </div>

          </div>

        </div>

      </section>

    </main>

  );

};


export default Vehicles;