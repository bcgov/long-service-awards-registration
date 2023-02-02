import api from "./api.services";

class RegistrationsDataService {
  //Takes in id of user to return appropriate recipient registration
  getRegistration(id) {
    return api.get(`/users/register/${id}`);
  }

  //takes in milestone variable to return subset of available awards
  getAwards(milestone) {
    return api.get(`/awards/${milestone}`);
  }

  //takes in type of ministries - those that allow prior registrations or not
  getMinistries(type) {
    return api.get(`/ministries/${type}`);
  }

  //Create a new registration
  postRegistration() {
    return api.post("/recipients/register/self");
  }

  //Create a new delegate registration
  postDelegatedRegistration() {
    return api.post("/recipients/register/delegated");
  }

  //Update currently active registration
  updateRegistration(id, data) {
    return api.post(`/recipients/save/${id}`);
  }
}
export default new RegistrationsDataService();
