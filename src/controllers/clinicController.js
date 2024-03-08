import clinicService from '../services/clinicService';

let handleSaveClinic = async (req, res) => {

    try {
        let data = await clinicService.saveClinic(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleGetAllClinics = async (req, res) => {

    try {
        let data = await clinicService.getAllClinics();
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleGetClinicDoctorById = async (req, res) => {

    try {
        let data = await clinicService.getClinicDetailsById(req.query.id);
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
    handleSaveClinic,
    handleGetAllClinics,
    handleGetClinicDoctorById
}