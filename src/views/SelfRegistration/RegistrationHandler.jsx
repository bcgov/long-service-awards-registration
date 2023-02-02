import React, { useContext, useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation, useNavigate } from "react-router";
import {
  UserContext,
  RegistrationContext,
  ToastContext,
} from "../../UserContext";
import apiRoutesRegistrations from "../../api/api-routes-registrations";
import formServices from "../../services/settings.services";
import { getRegistrationData } from "../../api/api.services";

/**
 * Registration Handling Page
 * Re-routes to appropriate page based on current stage in registration process.
 */

export default function RegistrationHandler() {
  const { registration, setRegistration } = useContext(RegistrationContext);
  const { user, setUser } = useContext(UserContext);
  const toast = useContext(ToastContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isLSAEligible = registration["milestone"] >= 25;

  const regType = typeof registration["confirmed"];
  const activeRegistration = regType !== "undefined";
  const [submitted, setSubmitted] = useState(registration["confirmed"]);
  const [createNew, setCreateNew] = useState(false);

  const stateData = location.state;
  const qualifyingYears = stateData && stateData.years ? stateData.years : null;

  const registrationProgress = async () => {
    let route = `profile`;
    if (registration) {
      if (registration["contact"]["firstname"]) {
        route = "milestone";
      }
      if (registration["years_of_service"]) {
        route = "details";
      }
      if (registration["contact"]["personal_address"]["street1"]) {
        isLSAEligible ? (route = "attendance") : (route = "supervisor");
      }

      if (registration["retiring_current_year"] != null) {
        isLSAEligible ? (route = "award") : (route = "supervisor");
      }

      if (registration["awards"][0]["award"]["label"]) {
        route = "supervisor";
      }

      if (registration["supervisor"]["firstname"]) {
        route = "confirmation";
      }
    }
    const registrationRoute = `/register/${route}`;

    return registrationRoute;
  };

  const createRegistration = async (userData) => {
    // const data = await apiRoutesRegistrations.postRegistration(userData);
    const data = await getRegistrationData(userData);
    return data;
  };

  const loader = async () => {
    const finalRoute = await registrationProgress();
    if (submitted) {
      navigate("/register/confirmation", { replace: true });
    } else if (activeRegistration) {
      navigate(finalRoute, { replace: true });
    } else {
      try {
        setRegistration((state) => ({ ...state, loading: true }));
        setCreateNew(true);
      } catch (error) {
        toast.current.replace(formServices.lookup("messages", "saveerror"));
        setRegistration((state) => ({ ...state, loading: false }));
      }
    }
  };

  useEffect(() => {
    loader();
  }, []);

  useEffect(() => {
    if (createNew) {
      toast.current.show(formServices.lookup("messages", "create"));
      try {
        createRegistration(user)
          .then((data) => {
            setRegistration(data);
          })
          .then(() => {
            setTimeout(() => {
              toast.current.replace(
                formServices.lookup("messages", "successcreate")
              );
              navigate("/register/profile", {
                state: { qualifyingYears },
                replace: true,
              });
            }, 3000);
          });
      } catch (error) {
        toast.current.replace(formServices.lookup("messages", "saveerror"));
      } finally {
        setRegistration((state) => ({ ...state, loading: false }));
      }
    }
  }, [createNew]);

  return (
    <>
      <div className="loading-modal">
        <ProgressSpinner />
      </div>
    </>
  );
}
