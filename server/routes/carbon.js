const express = require('express');
const router = express.Router();
const { calculateCarbonFootprint } = require('../services/climatiqService');

// POST /api/carbon/calculate
router.post('/calculate', async (req, res) => {
  try {
    // Extract data from frontend
    const { activity, value, unit } = req.body;

    // Validate data
    if (!activity || !value || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Activity, value, and unit are required'
      });
    }

    // Map frontend data to Climatiq format
    const emission_factor = { 
      activity_id: activity,
      data_version: "20.20"
    };
    const parameters = { 
      [activity === 'electricity' ? 'energy' : 'distance']: {
        value: value,
        unit: unit
      }
    };

    // Process calculation
    const result = await calculateCarbonFootprint({ emission_factor, parameters });

    // Send response
    res.status(200).json({
      success: true,
      message: 'Carbon footprint calculated successfully',
      data: result
    });
  } catch (error) {
    console.error('Carbon calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate carbon footprint',
      error: error.message
    });
  }
});

module.exports = router;