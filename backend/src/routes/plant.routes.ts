import { Router } from 'express';
import * as plantController from '../controllers/plant.controllers';

const router = Router();

router.get('/search', plantController.searchPlants);

router.get('/', plantController.getPlants);

router.get('/get/:id', plantController.getPlant);

router.post('/', plantController.createPlant);

router.put('/get/:id', plantController.updatePlant);

router.delete('/get/:id', plantController.deletePlant);

export default router;
