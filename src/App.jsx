import { useRef, useState, useMemo, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";
import { UserContext, RegistrationContext, ToastContext } from "./UserContext";
import { getUserData, getRegistrationData } from "./api/api.services";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

import apiRoutesRegistrations from "./api/api-routes-registrations";
import apiRoutesUsers from "./api/api-routes.users";

/**
 * Main application. Loads user, registration, and messaging states prior to mounting main application.
 * @returns
 */

export default function App() {
  const toastProvider = useRef(null);
  const [user, setUser] = useState({ loading: true });
  const userProvider = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [registration, setRegistration] = useState({ loading: true });
  const registrationProvider = useMemo(
    () => ({ registration, setRegistration }),
    [registration, setRegistration]
  );

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData();
      // const data1 = await apiRoutesUsers.getLogin();
      // console.log(data1, "this is user data");
      console.log("user data");
      setUser(data);
      return data;
    };
    const fetchRegistration = async (userData) => {
      const data = await getRegistrationData(userData);
      // const data = {};
      let finalData = data;
      // Parses single date stored in UTC needed on frontend
      if (data.retirement_date) {
        finalData.retirement_date = new Date(data.retirement_date);
      }
      setRegistration(finalData);
      return finalData;
    };
    fetchUser()
      .then((data) => {
        console.log(data);
        fetchRegistration(data);
      })
      .catch(console.error)
      .finally(() => {
        setRegistration((state) => ({ ...state, loading: false }));
        setUser((state) => ({ ...state, loading: false }));
      });
  }, []);

  if (user["loading"]) return <ProgressSpinner />;

  return (
    <UserContext.Provider value={userProvider}>
      <RegistrationContext.Provider value={registrationProvider}>
        <ToastContext.Provider value={toastProvider}>
          <div className="App">
            <Navbar />
            <div className="main-content">
              <Toast ref={toastProvider} />
              <Outlet />
              {registration["loading"] ? (
                <div className="loading-modal">
                  <ProgressSpinner />
                </div>
              ) : null}
            </div>
          </div>
        </ToastContext.Provider>
      </RegistrationContext.Provider>
    </UserContext.Provider>
  );
}
