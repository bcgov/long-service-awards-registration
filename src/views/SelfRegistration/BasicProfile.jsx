import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { RegistrationContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import ContactDetails from "../../components/inputs/ContactDetails";
import InfoToolTip from "../../components/common/InfoToolTip";
import "./BasicProfile.css";

/**
 * Basic Registration.
 * Basic Profile Page requests user info required to continue with application.
 */

export default function BasicProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLSAEligible, postupdateRegistration] = useOutletContext();
  const { registration, setRegistration } = useContext(RegistrationContext);

  const stateData = location.state ? location.state : null;

  const defaultFormValues = {
    contact: {
      firstname: "",
      lastname: "",
      office_email: "",
      office_phone: "",
    },
    employee_number: "",
    organization: null,
    branch: "",
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  const {
    formState: { errors, isValid, isDirty },
    getValues,
    handleSubmit,
    reset,
    watch,
  } = methods;

  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);

  const formCompleteStatus = watch();

  useEffect(() => {
    setFormComplete(false);
  }, [formCompleteStatus]);

  const saveData = async (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);
    const registrationUpdate = {
      ...registrationData,
      ...finalData,
      ...{ loading: true },
    };
    console.log(registrationUpdate, "this update is checking spread operator");
    await postupdateRegistration(registrationUpdate).then(() => {
      setRegistration(registrationUpdate);
      setFormComplete(true);
    });
  };

  const submitData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };
    setSubmissionData(finalData);
    console.log(submissionData, "this is final submission data");
    try {
      const ministryData = getValues("organization");
      const newState = { ...stateData, ministryData };
      navigate("/register/milestone", { state: newState });
    } catch (error) {}
  };

  useEffect(() => {
    reset(registration);
  }, [registration]);

  return (
    <>
      <div className="self-registration basic-profile">
        <FormProvider {...methods}>
          <form className="basic-details-form">
            <AppPanel
              header={
                <>
                  Profile Details
                  <InfoToolTip
                    target="basic-details-form"
                    content="Enter your basic profile information on this page. This information will be used to populate the options available to you for this registration."
                  />
                </>
              }
            >
              <ContactDetails
                basic
                extended
                panelName="personal"
                errors={errors}
              />
            </AppPanel>
            <div className="submission-buttons">
              <AppButton secondary onClick={handleSubmit(saveData)}>
                Save
              </AppButton>
              <AppButton
                type="submit"
                onClick={(e) => submitData(e)}
                disabled={!isValid || (isDirty && !formComplete)}
              >
                Continue
              </AppButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
