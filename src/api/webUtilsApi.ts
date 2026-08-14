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
// TESTIMONIAL TYPES
// ==========================================================

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_location: string;
  review: string;
  rating: number;
  customer_image_url: string;
  customer_image_public_id: string;
  vehicle: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubmitTestimonialPayload {
  customer_name: string;
  customer_location?: string;
  review: string;
  rating: number;
  vehicle?: string;
  customer_image?: File | null;
}

export interface UpdateTestimonialPayload {
  customer_name?: string;
  customer_location?: string;
  review?: string;
  rating?: number;
  vehicle?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  customer_image?: File | null;
}


// ==========================================================
// VEHICLE DELIVERY TYPES
// ==========================================================

export interface VehicleDelivery {
  id: string;
  vehicle: string | null;
  vehicle_name: string | null;
  vehicle_model: string | null;
  customer_name: string;
  customer_location: string;
  delivery_date: string;
  image_url: string;
  public_id: string;
  caption: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleDeliveryPayload {
  vehicle?: string | null;
  customer_name?: string;
  customer_location?: string;
  delivery_date: string;
  caption?: string;
  image: File;
}


//FEATURED TYPES
export interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  content_type: "IMAGE" | "VIDEO";
  media_url: string;
  public_id: string;
  button_text: string;
  button_url: string;
  start_date: string;
  end_date: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnquiryPayload {
  customer_name: string;
  phone: string;
  vehicle: string;
  message: string;
}

export interface EnquiryResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    customer_name: string;
    phone: string;
    vehicle: string;
    message: string;
    status: string;
    manager_notes: string;
    created_at: string;
    updated_at: string;
  };
  notification_sent?: boolean;
  code?: string;
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

  // ========================================================
  // PUBLIC - TESTIMONIALS
  // ========================================================

  /*
   * Returns published testimonials.
   *
   * GET /api/v1/testimonials/
   */

  getTestimonials: async (): Promise<Testimonial[]> => {
    const response =
      await api.get<ApiResponse<Testimonial[]>>(
        "/testimonials/"
      );

    return response.data.data;
  },

  /*
   * Submit customer testimonial.
   *
   * Customer does NOT need to be logged in.
   *
   * Image is optional.
   *
   * POST /api/v1/testimonials/submit/
   */

  submitTestimonial: async (
    payload: SubmitTestimonialPayload
  ): Promise<Testimonial> => {
    const formData = new FormData();

    formData.append(
      "customer_name",
      payload.customer_name
    );

    formData.append(
      "customer_location",
      payload.customer_location ?? ""
    );

    formData.append(
      "review",
      payload.review
    );

    formData.append(
      "rating",
      String(payload.rating)
    );

    if (payload.vehicle) {
      formData.append(
        "vehicle",
        payload.vehicle
      );
    }

    if (payload.customer_image) {
      formData.append(
        "customer_image",
        payload.customer_image
      );
    }

    const response =
      await api.post<ApiResponse<Testimonial>>(
        "/testimonials/submit/",
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

  // ========================================================
  // MANAGER - TESTIMONIALS
  // ========================================================

  /*
   * Returns all testimonials.
   *
   * Includes:
   * - Pending testimonials
   * - Published testimonials
   *
   * GET /api/v1/testimonials/manager/
   */

  getManagerTestimonials:
    async (): Promise<Testimonial[]> => {
      const response =
        await api.get<ApiResponse<Testimonial[]>>(
          "/testimonials/manager/"
        );

      return response.data.data;
    },

  /*
   * Approve testimonial.
   *
   * Optionally mark it as featured.
   *
   * PUT /api/v1/testimonials/<testimonial_id>/approve/
   */

  approveTestimonial: async (
    testimonialId: string,
    isFeatured = false
  ): Promise<Testimonial> => {
    const response =
      await api.put<ApiResponse<Testimonial>>(
        `/testimonials/${testimonialId}/approve/`,
        {
          is_featured: isFeatured,
        }
      );

    return response.data.data;
  },

  /*
   * Update testimonial.
   *
   * PUT /api/v1/testimonials/<testimonial_id>/update/
   */

  updateTestimonial: async (
    testimonialId: string,
    payload: UpdateTestimonialPayload
  ): Promise<Testimonial> => {
    const formData = new FormData();

    if (
      payload.customer_name !== undefined
    ) {
      formData.append(
        "customer_name",
        payload.customer_name
      );
    }

    if (
      payload.customer_location !== undefined
    ) {
      formData.append(
        "customer_location",
        payload.customer_location
      );
    }

    if (
      payload.review !== undefined
    ) {
      formData.append(
        "review",
        payload.review
      );
    }

    if (
      payload.rating !== undefined
    ) {
      formData.append(
        "rating",
        String(payload.rating)
      );
    }

    if (
      payload.vehicle !== undefined &&
      payload.vehicle !== null
    ) {
      formData.append(
        "vehicle",
        payload.vehicle
      );
    }

    if (
      payload.is_published !== undefined
    ) {
      formData.append(
        "is_published",
        String(payload.is_published)
      );
    }

    if (
      payload.is_featured !== undefined
    ) {
      formData.append(
        "is_featured",
        String(payload.is_featured)
      );
    }

    if (payload.customer_image) {
      formData.append(
        "customer_image",
        payload.customer_image
      );
    }

    const response =
      await api.put<ApiResponse<Testimonial>>(
        `/testimonials/${testimonialId}/update/`,
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
   * DELETE /api/v1/testimonials/<testimonial_id>/delete/
   */

  deleteTestimonial: async (
    testimonialId: string
  ) => {
    const response =
      await api.delete<ApiResponse<null>>(
        `/testimonials/${testimonialId}/delete/`
      );

    return response.data;
  },

  // ========================================================
  // PUBLIC - VEHICLE DELIVERIES
  // ========================================================

  /*
   * Returns only published vehicle deliveries.
   *
   * GET /api/v1/vehicles/deliveries/
   */

getVehicleDeliveries: async (
  limit?: number
): Promise<VehicleDelivery[]> => {
  const response =
    await api.get<ApiResponse<VehicleDelivery[]>>(
      "/vehicles/deliveries/",
      {
        params: limit
          ? { limit }
          : undefined,
      }
    );

  return response.data.data;
},


  // ========================================================
  // MANAGER - VEHICLE DELIVERIES
  // ========================================================

  /*
   * Returns all vehicle deliveries.
   *
   * Includes:
   * - Pending deliveries
   * - Published deliveries
   *
   * GET /api/v1/vehicles/deliveries/manager/
   */

  getManagerVehicleDeliveries: async (): Promise<
    VehicleDelivery[]
  > => {
    const response =
      await api.get<ApiResponse<VehicleDelivery[]>>(
        "/vehicles/deliveries/manager/"
      );

    return response.data.data;
  },


  // ========================================================
  // MANAGER - CREATE VEHICLE DELIVERY
  // ========================================================

  /*
   * Creates a vehicle delivery.
   *
   * Image is uploaded as multipart/form-data.
   *
   * New delivery is unpublished by default.
   *
   * POST /api/v1/vehicles/deliveries/create/
   */

  createVehicleDelivery: async (
    payload: CreateVehicleDeliveryPayload
  ): Promise<VehicleDelivery> => {
    const formData = new FormData();

    if (payload.vehicle) {
      formData.append(
        "vehicle",
        payload.vehicle
      );
    }

    formData.append(
      "customer_name",
      payload.customer_name ?? ""
    );

    formData.append(
      "customer_location",
      payload.customer_location ?? ""
    );

    formData.append(
      "delivery_date",
      payload.delivery_date
    );

    formData.append(
      "caption",
      payload.caption ?? ""
    );

    formData.append(
      "image",
      payload.image
    );

    const response =
      await api.post<ApiResponse<VehicleDelivery>>(
        "/vehicles/deliveries/create/",
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


  // ========================================================
  // MANAGER - PUBLISH VEHICLE DELIVERY
  // ========================================================

  /*
   * Publishes a pending vehicle delivery.
   *
   * PUT /api/v1/vehicles/deliveries/<delivery_id>/approve/
   */

  approveVehicleDelivery: async (
    deliveryId: string
  ): Promise<VehicleDelivery> => {
    const response =
      await api.put<ApiResponse<VehicleDelivery>>(
        `/vehicles/deliveries/${deliveryId}/approve/`
      );

    return response.data.data;
  },


  // ========================================================
  // MANAGER - DELETE VEHICLE DELIVERY
  // ========================================================

  /*
   * Deletes a vehicle delivery.
   *
   * The backend also deletes the associated
   * Cloudinary image.
   *
   * DELETE /api/v1/vehicles/deliveries/<delivery_id>/delete/
   */

  deleteVehicleDelivery: async (
    deliveryId: string
  ) => {
    const response =
      await api.delete<ApiResponse<null>>(
        `/vehicles/deliveries/${deliveryId}/delete/`
      );

    return response.data;
  },


  // ==========================================================
// FEATURED CONTENT
// ==========================================================

getFeaturedContent: async (): Promise<FeaturedContent[]> => {
  const response =
    await api.get<ApiResponse<FeaturedContent[]>>(
      "/featured/"
    );

  return response.data.data;
},

getManagerFeaturedContent: async (): Promise<
  FeaturedContent[]
> => {
  const response =
    await api.get<ApiResponse<FeaturedContent[]>>(
      "/featured/manager/"
    );

  return response.data.data;
},

createFeaturedContent: async (
  formData: FormData
): Promise<FeaturedContent> => {
  const response =
    await api.post<ApiResponse<FeaturedContent>>(
      "/featured/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

  return response.data.data;
},

updateFeaturedContent: async (
  featuredId: string,
  formData: FormData
): Promise<FeaturedContent> => {
  const response =
    await api.put<ApiResponse<FeaturedContent>>(
      `/featured/${featuredId}/update/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

  return response.data.data;
},

publishFeaturedContent: async (
  featuredId: string
): Promise<FeaturedContent> => {
  const response =
    await api.put<ApiResponse<FeaturedContent>>(
      `/featured/${featuredId}/publish/`
    );

  return response.data.data;
},

unpublishFeaturedContent: async (
  featuredId: string
): Promise<FeaturedContent> => {
  const response =
    await api.put<ApiResponse<FeaturedContent>>(
      `/featured/${featuredId}/unpublish/`
    );

  return response.data.data;
},

deleteFeaturedContent: async (
  featuredId: string
): Promise<void> => {
  await api.delete(
    `/featured/${featuredId}/delete/`
  );
},

submitEnquiry: async (
  payload: EnquiryPayload
): Promise<EnquiryResponse> => {
  const response = await api.post(
    "/enquiries/",
    payload
  );

  return response.data;
},
};