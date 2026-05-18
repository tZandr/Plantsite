import type { ResultSetHeader } from 'mysql2';
import type { RowDataPacket } from 'mysql2/promise';
import type {
  Plant,
  CreatePlant,
  PlantingSchedule,
  PlantRow,
  SearchParamsPlants,
} from '../types/plant';
import { db } from '../databases/mysql/connection';

export const searchPlants = async (params: SearchParamsPlants) => {
  const {
    name,
    sun,
    water,
    difficulty,
    soil,
    sort = 'created_at',
    order = 'desc',
  } = params;

  const filters: string[] = [];
  const values: any[] = [];

  if (name) {
    filters.push('(name LIKE ? OR latin_name LIKE ?)');
    values.push(`%${name}%`, `%${name}%`);
  }

  if (sun) {
    filters.push('sun_requirement = ?');
    values.push(sun);
  }

  if (water) {
    filters.push('water_requirement = ?');
    values.push(water);
  }

  if (difficulty) {
    filters.push('difficulty_level = ?');
    values.push(difficulty);
  }

  if (soil) {
    filters.push('soil_type = ?');
    values.push(soil);
  }

  let query = `SELECT * FROM plants`;

  if (filters.length > 0) {
    query += ` WHERE ${filters.join(' AND ')}`;
  }

  const allowedSort = ['name', 'created_at', 'difficulty_level'];
  const allowedOrder = ['asc', 'desc'];

  const sortField = allowedSort.includes(sort) ? sort : 'created_at';
  const sortOrder = allowedOrder.includes(order) ? order : 'desc';

  query += ` ORDER BY ${sortField} ${sortOrder}`;

  const [rows] = await db.query<RowDataPacket[] & Plant[]>(query, values);

  return rows;
};

export const getAllPlants = async () => {
  const [rows] = await db.query(`SELECT * FROM plants`);

  return rows;
};

export const getPlantById = async (id: number): Promise<Plant | null> => {
  const [rows] = await db.query<RowDataPacket[] & PlantRow[]>(
    `SELECT
      p.*,
      ps.id AS schedule_id,
      ps.planting_start_month,
      ps.planting_end_month,
      ps.harvest_start_month,
      ps.harvest_end_month,
      ps.notes
    FROM plants p
    LEFT JOIN planting_schedule ps ON ps.plant_id = p.id
    WHERE p.id = ?`,
    [id],
  );

  if (rows.length === 0) return null;

  const {
    schedule_id,
    planting_start_month,
    planting_end_month,
    harvest_start_month,
    harvest_end_month,
    notes,
    ...plantData
  } = rows[0] as PlantRow;

  const plant: Plant = {
    ...plantData,
    schedules: rows
      .filter((row) => row.schedule_id !== null)
      .map((row) => ({
        id: row.schedule_id!,
        planting_start_month: row.planting_start_month!,
        planting_end_month: row.planting_end_month!,
        harvest_start_month: row.harvest_start_month!,
        harvest_end_month: row.harvest_end_month!,
        notes: row.notes ?? undefined,
      })) as PlantingSchedule[],
  };

  return plant;
};

export const createPlant = async (plant: CreatePlant): Promise<number> => {
  const {
    name,
    img_url,
    latin_name,
    plant_family,
    description,
    care_instructions,
    sun_requirement,
    water_requirement,
    soil_type,
    blooming_season,
    difficulty_level,
  } = plant;

  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO plants
    (name, img_url, latin_name, plant_family, description, care_instructions, sun_requirement, water_requirement, soil_type, blooming_season, difficulty_level, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      name,
      img_url,
      latin_name,
      plant_family,
      description,
      care_instructions,
      sun_requirement,
      water_requirement,
      soil_type,
      blooming_season,
      difficulty_level,
    ],
  );

  return result.insertId;
};

export const updatePlant = async (id: number, plant: CreatePlant) => {
  const {
    name,
    img_url,
    latin_name,
    plant_family,
    description,
    care_instructions,
    sun_requirement,
    water_requirement,
    soil_type,
    blooming_season,
    difficulty_level,
  } = plant;

  await db.query(
    `UPDATE plants
    SET name=?, img_url=?, latin_name=?, plant_family=?, description=?, care_instructions=?, sun_requirement=?, water_requirement=?, soil_type=?, blooming_season=?, difficulty_level=?, updated_at=NOW()
    WHERE id=?`,
    [
      name,
      img_url,
      latin_name,
      plant_family,
      description,
      care_instructions,
      sun_requirement,
      water_requirement,
      soil_type,
      blooming_season,
      difficulty_level,
      id,
    ],
  );

  return true;
};

export const deletePlant = async (id: number) => {
  await db.query(`DELETE FROM plants WHERE id=?`, [id]);
};
