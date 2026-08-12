import api from "./axios";
import type { Vehicle } from "../types/vehicle";
import type { User } from "../types/auth";


// ==========================================================
// COMMON API RESPONSE
// ==========================================================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


// ==========================================================
// AUTH TYPES
// ==========================================================

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
}


// ==========================================================
// VEHICLE TYPES
// ==========================================================

export interface CreateVehiclePayload {
  name: string;
  brand: string;
  model: string;
  vehicle_type: string;
  price: number;
  battery_capacity: string;
  range_km: number | null;
  charging_time: string;
  seating_capacity: number | null;
  payload_capacity: string;
  top_speed: number | null;
  description: string;
  specifications: Record<string, unknown>;
  is_available: boolean;
}

export interface UpdateVehiclePayload {
  name?: string;
  brand?: string;
  model?: string;
  vehicle_type?: string;
  price?: number;
  battery_capacity?: string;
  range_km?: number | null;
  charging_time?: string;
  seating_capacity?: number | null;
  payload_capacity?: string;
  top_speed?: number | null;
  description?: string;
  specifications?: Record<string, unknown>;
  is_available?: boolean;
}


// ==========================================================
// VEHICLE IMAGE TYPES
// ==========================================================

export interface UploadVehicleImageResponse {
  id: string;
  image_url: string;
  public_id: string;
  is_primary: boolean;
  created_at: string;
}


// ==========================================================
// WEB UTILS API
// ==========================================================

export const webUtilsApi = {

  // ========================================================
  // AUTH
  // ========================================================

  register: async (
    payload: RegisterPayload
  ) => {
    const response = await api.post<ApiResponse<User>>(
      "/auth/register/",
      payload
    );

    return response.data;
  },


  login: async (
    payload: LoginPayload
  ) => {
    const response =
      await api.post<ApiResponse<LoginResponse>>(
        "/auth/login/",
        payload
      );

    return response.data;
  },


  getMe: async (): Promise<User> => {
    const response =
      await api.get<ApiResponse<User>>(
        "/auth/me/"
      );

    return response.data.data;
  },


  refreshToken: async (
    refresh: string
  ) => {
    const response = await api.post<
      ApiResponse<{
        access: string;
        refresh: string;
      }>
    >(
      "/auth/refresh-token/",
      {
        refresh,
      }
    );

    return response.data;
  },


  logout: async () => {
    const response =
      await api.post<ApiResponse<null>>(
        "/auth/logout/"
      );

    return response.data;
  },


  // ========================================================
  // PUBLIC VEHICLES
  // ========================================================

  /*
   * Returns only available vehicles.
   *
   * GET /api/v1/vehicles/
   */

  getVehicles: async (
    params?: {
      search?: string;
      brand?: string;
      vehicle_type?: string;
      min_price?: number;
      max_price?: number;
    }
  ): Promise<Vehicle[]> => {

    const response =
      await api.get<ApiResponse<Vehicle[]>>(
        "/vehicles/",
        {
          params,
        }
      );

    return response.data.data;
  },


  /*
   * Returns details of an available vehicle.
   *
   * GET /api/v1/vehicles/<vehicle_id>/
   */

  getVehicleById: async (
    vehicleId: string
  ): Promise<Vehicle> => {

    const response =
      await api.get<ApiResponse<Vehicle>>(
        `/vehicles/${vehicleId}/`
      );

    return response.data.data;
  },


  // ========================================================
  // MANAGER - VEHICLES
  // ========================================================

  /*
   * Returns ALL vehicles.
   *
   * Includes:
   * - Available vehicles
   * - Unavailable vehicles
   *
   * GET /api/v1/vehicles/manager/
   */

  getManagerVehicles: async (
    params?: {
      search?: string;
      brand?: string;
      vehicle_type?: string;
      min_price?: number;
      max_price?: number;
      is_available?: boolean;
    }
  ): Promise<Vehicle[]> => {

    const response =
      await api.get<ApiResponse<Vehicle[]>>(
        "/vehicles/manager/",
        {
          params,
        }
      );

    return response.data.data;
  },


  /*
   * Returns details of ANY vehicle for manager.
   *
   * This is important because an unavailable vehicle
   * should still be editable by the manager.
   *
   * GET /api/v1/vehicles/manager/<vehicle_id>/
   */

  getManagerVehicleById: async (
    vehicleId: string
  ): Promise<Vehicle> => {

    const response =
      await api.get<ApiResponse<Vehicle>>(
        `/vehicles/manager/${vehicleId}/`
      );

    return response.data.data;
  },


  // ========================================================
  // MANAGER - CREATE VEHICLE
  // ========================================================

  /*
   * POST /api/v1/vehicles/create/
   */

  createVehicle: async (
    payload: CreateVehiclePayload
  ): Promise<Vehicle> => {

    const response =
      await api.post<ApiResponse<Vehicle>>(
        "/vehicles/create/",
        payload
      );

    return response.data.data;
  },


  // ========================================================
  // MANAGER - UPDATE VEHICLE
  // ========================================================

  /*
   * PUT /api/v1/vehicles/<vehicle_id>/update/
   */

  updateVehicle: async (
    vehicleId: string,
    payload: UpdateVehiclePayload
  ): Promise<Vehicle> => {

    const response =
      await api.put<ApiResponse<Vehicle>>(
        `/vehicles/${vehicleId}/update/`,
        payload
      );

    return response.data.data;
  },


  // ========================================================
  // MANAGER - DELETE VEHICLE
  // ========================================================

  /*
   * DELETE /api/v1/vehicles/<vehicle_id>/delete/
   */

  deleteVehicle: async (
    vehicleId: string
  ) => {

    const response =
      await api.delete<ApiResponse<null>>(
        `/vehicles/${vehicleId}/delete/`
      );

    return response.data;
  },


  // ========================================================
  // MANAGER - VEHICLE IMAGES
  // ========================================================

  /*
   * POST /api/v1/vehicles/<vehicle_id>/images/
   */

  uploadVehicleImage: async (
    vehicleId: string,
    image: File,
    isPrimary = false
  ): Promise<UploadVehicleImageResponse> => {

    const formData = new FormData();

    formData.append(
      "image",
      image
    );

    formData.append(
      "is_primary",
      String(isPrimary)
    );

    const response =
      await api.post<
        ApiResponse<UploadVehicleImageResponse>
      >(
        `/vehicles/${vehicleId}/images/`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data.data;
  },


  /*
   * DELETE /api/v1/vehicles/<vehicle_id>/images/<image_id>/
   */

  deleteVehicleImage: async (
    vehicleId: string,
    imageId: string
  ) => {

    const response =
      await api.delete<ApiResponse<null>>(
        `/vehicles/${vehicleId}/images/${imageId}/`
      );

    return response.data;
  },

};