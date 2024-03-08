import patientService from '../services/patientService';


let handleBookAppointment = async (req, res) => {

    try {
        let data = await patientService.bookAppointment(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleVerifyBookAppointment = async (req, res) => {

    try {
        let data = await patientService.verifyBookAppointment(req.body);
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
    handleBookAppointment,
    handleVerifyBookAppointment
}