import type { Request, Response } from 'express';
import * as plantService from '../services/plant.services';
import type { SearchParamsPlants } from '../types/plant';

export const searchPlants = async (req: Request, res: Response) => {
  try {
    const plants = await plantService.searchPlants(
      req.query as unknown as SearchParamsPlants,
    );
    res.json(plants);
  } catch (err) {
    console.error('Error searching plant', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPlants = async (req: Request, res: Response) => {
  try {
    const plants = await plantService.getAllPlants();
    res.json(plants);
  } catch (err) {
    console.error('Error getting all plants', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPlant = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const plant = await plantService.getPlantById(id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(plant);
  } catch (err) {
    console.error('Error getting plant:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createPlant = async (req: Request, res: Response) => {
  try {
    const id = await plantService.createPlant(req.body);

    res.status(201).json({ id });
  } catch (err) {
    console.error('Error creating plant:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updatePlant = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await plantService.updatePlant(id, req.body);

    res.json({ message: 'Plant updated' });
  } catch (err) {
    console.error('Error updating plant:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deletePlant = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await plantService.deletePlant(id);

    res.json({ message: 'Plant deleted' });
  } catch (err) {
    console.error('Error deleting plant:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
