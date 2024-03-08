import specialtyService from '../services/specialtyService';

let handleSaveSpecialty = async (req, res) => {

    try {
        let data = await specialtyService.saveSpecialty(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleGetAllSpecialties = async (req, res) => {

    try {
        let data = await specialtyService.getAllSpecialties();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleGetSpecialtyDoctorById = async (req, res) => {

    try {
        let data = await specialtyService.getSpecialtyDoctorById(req.query.id, req.query.location);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}


module.exports = {
    handleSaveSpecialty,
    handleGetAllSpecialties,
    handleGetSpecialtyDoctorById
}