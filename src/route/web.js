//mỗi khi truy cập vào 1 đường link sẽ chạy vào đây
import express from 'express';
import homeController from "../controllers/homeController";
import userControlller from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getAboutPage);
    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);

    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    //Manage users
    router.post("/api/login", userControlller.handleLoginApi);
    router.get("/api/get-all-users", userControlller.handleGetAllUsers);
    //router.get("/api/get-users", userControlller.handleGetUsers);
    router.post("/api/create-new-user", userControlller.handleCreateNewUser);
    router.put("/api/edit-summary-user", userControlller.handleEditSummaryUser);
    router.put("/api/edit-user", userControlller.handleEditUser);
    router.delete("/api/delete-user", userControlller.handleDeleteUser);
    router.get('/api/allcode', userControlller.getAllCode)

    //manage doctors
    router.get("/api/top-doctors-home", doctorController.handleGetTopDoctors);
    router.get("/api/get-all-doctors", doctorController.handleGetAllDoctors);
    router.post("/api/save-doctor-details", doctorController.handleSaveDoctorDetails);
    router.get("/api/get-doctor-details-by-id", doctorController.handleGetDoctorDetailsById);
    router.post("/api/bulk-create-schedule", doctorController.handleBulkCreateSchedule);
    router.get("/api/get-schedule-by-date", doctorController.handleGetScheduleByDate);
    router.get("/api/get-extra-info-doctor-by-id", doctorController.handleGetExtraInfoDoctorById);
    router.get("/api/get-profile-doctor-by-id", doctorController.handleGetProfileDoctorById);
    router.get("/api/get-list-patient-for-doctor", doctorController.handleGetListPatientForDoctor);
    router.post("/api/send-remedy", doctorController.handleSendRemedy);

    //patient (client UI)
    router.post("/api/patient-book-appointment", patientController.handleBookAppointment);
    router.post("/api/verify-book-appointment", patientController.handleVerifyBookAppointment);
    //specialty
    router.post("/api/save-specialty", specialtyController.handleSaveSpecialty);
    router.get("/api/get-all-specialties", specialtyController.handleGetAllSpecialties);
    router.get("/api/get-specialty-doctor-by-id", specialtyController.handleGetSpecialtyDoctorById);
    //clinic
    router.post("/api/save-clinic", clinicController.handleSaveClinic);
    router.get("/api/get-all-clinics", clinicController.handleGetAllClinics);
    router.get("/api/get-clinic-doctor-by-id", clinicController.handleGetClinicDoctorById);

    return app.use("/", router);
}

module.exports = initWebRoutes;