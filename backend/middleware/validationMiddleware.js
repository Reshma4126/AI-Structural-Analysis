const validateBeamDesign = (req, res, next) => {
    const { 
        beam_name, beam_width, beam_depth, beam_length, 
        concrete_grade, steel_grade, cover, 
        number_of_tensile_bars, diameter_tensile_bars, 
        number_of_compression_bars, diameter_compression_bars, 
        stirrup_diameter, stirrup_spacing, 
        loading_type, applied_load 
    } = req.body;

    const errors = [];

    if (!beam_name || beam_name.trim() === '') errors.push('Beam name is required.');
    
    if (beam_width === undefined || beam_width <= 0) errors.push('Beam width must be greater than 0.');
    if (beam_depth === undefined || beam_depth <= 0) errors.push('Beam depth must be greater than 0.');
    if (beam_length === undefined || beam_length <= 0) errors.push('Beam length must be greater than 0.');
    
    if (!concrete_grade || concrete_grade.trim() === '') errors.push('Concrete grade cannot be empty.');
    if (!steel_grade || steel_grade.trim() === '') errors.push('Steel grade cannot be empty.');
    
    if (cover === undefined || cover < 0) errors.push('Cover must be 0 or greater.');
    
    if (number_of_tensile_bars === undefined || number_of_tensile_bars < 0) errors.push('Number of tensile bars must be 0 or positive.');
    if (diameter_tensile_bars === undefined || diameter_tensile_bars < 0) errors.push('Diameter of tensile bars must be 0 or positive.');
    
    if (number_of_compression_bars === undefined || number_of_compression_bars < 0) errors.push('Number of compression bars must be 0 or positive.');
    if (diameter_compression_bars === undefined || diameter_compression_bars < 0) errors.push('Diameter of compression bars must be 0 or positive.');
    
    if (stirrup_diameter === undefined || stirrup_diameter < 0) errors.push('Stirrup diameter must be 0 or positive.');
    if (stirrup_spacing === undefined || stirrup_spacing <= 0) errors.push('Stirrup spacing must be greater than 0.');
    
    if (!loading_type || loading_type.trim() === '') errors.push('Loading type is required.');
    if (applied_load === undefined || applied_load < 0) errors.push('Applied load must be 0 or positive.');

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    next();
};

module.exports = {
    validateBeamDesign
};
