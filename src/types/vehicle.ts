export type VehicleType =
  | "E_RICKSHAW"
  | "CARGO";

export interface VehicleImage {
  id: string;
  image_url: string;
  public_id: string;
  is_primary: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;

  name: string;
  brand: string;
  model: string;

  vehicle_type: VehicleType;

  price: number | string;

  battery_capacity: string;

  range_km: number | null;

  charging_time: string;

  seating_capacity: number | null;

  payload_capacity: string;

  top_speed: number | null;

  description: string;

  specifications: Record<string, unknown>;

  is_available: boolean;

  images: VehicleImage[];

  created_at: string;
  updated_at: string;
}