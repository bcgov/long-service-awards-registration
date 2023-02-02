import React, { useContext } from "react";
import AppButton from "../components/common/AppButton";
import AppPanel from "../components/common/AppPanel";
import PageHeader from "../components/common/PageHeader";
import { RegistrationContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./Splash.css";

/**
 * Home Splash Page.
 */

export default function Splash() {
  const navigate = useNavigate();
  const { registration } = useContext(RegistrationContext);
  const submittedRegistration = registration ? registration.confirmed : null;
  const activeRegistration = JSON.stringify(registration) !== "{}";

  const registerRedirect = () => {
    navigate("/register/self");
  };

  return (
    <div className="splash-page">
      <PageHeader
        title="Welcome"
        subtitle="Long Service Awards And Service Pin Registration"
      ></PageHeader>
      <AppPanel header="CELEBRATING YOUR SERVICE">
        The Long Service Awards celebrate the dedication and commitment of
        employees with 25, 30, 35, 40, 45 and 50 year careers in the BC Public
        Service. Long Service Award ceremonies are prestigious and memorable
        events held at Government House in Victoria, the official residence of
        B.C.'s Lieutenant Governor and the ceremonial home for all British
        Columbians.
      </AppPanel>
      <AppButton onClick={registerRedirect}>
        {activeRegistration || submittedRegistration
          ? "View Registration"
          : "Register"}
      </AppButton>
    </div>
  );
}
