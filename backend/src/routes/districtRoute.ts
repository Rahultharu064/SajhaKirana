import { Router } from 'express';
import { getDistricts } from '../controllers/districtController';

const router = Router();

/**
 * @route GET /api/districts
 * @desc Get all districts
 * @access Public
 */
router.get('/', getDistricts);

export default router;
