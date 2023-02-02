import api from "./api.services";

class UsersDataService {
  login() {
    return api.get("/register/users/login");
  }
}
export default new UsersDataService();
