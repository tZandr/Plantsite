export interface Plant {
  id: number;
  name: string;
  img_url: string;
  latin_name: string;
  plant_family: string;
  description: string;
  care_instructions: string;
  sun_requirement: string;
  water_requirement: string;
  soil_type: string;
  blooming_season: string;
  difficulty_level: string;
  created_at: Date;
  updated_at: Date;
  schedules?: PlantingSchedule[];
}

export type PlantingSchedule = {
  id: number;
  planting_start_month: number;
  planting_end_month: number;
  harvest_start_month: number;
  harvest_end_month: number;
  notes?: string;
};

export type PlantRow = Plant & {
  schedule_id: number | null;
  planting_start_month: number | null;
  planting_end_month: number | null;
  harvest_start_month: number | null;
  harvest_end_month: number | null;
  notes?: string | null;
};

export interface CreatePlant {
  name: string;
  img_url: string;
  latin_name: string;
  plant_family: string;
  description: string;
  care_instructions: string;
  sun_requirement: string;
  water_requirement: string;
  soil_type: string;
  blooming_season: string;
  difficulty_level: string;
}

export type SearchParamsPlants = {
  name?: string;
  sun?: string;
  water?: string;
  difficulty?: string;
  soil?: string;
  sort?: string;
  order?: 'asc' | 'desc';
};
