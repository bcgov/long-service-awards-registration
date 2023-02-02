import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RegistrationContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import LSADetails from "../../components/inputs/LSADetails";
import LSAIneligible from "../../components/composites/LSAIneligible";
import InfoToolTip from "../../components/common/InfoToolTip";

/**
 * LSA Attendance Questions.
 */

export default function LSAAttendance() {
  const navigate = useNavigate();
  const [isLSAEligible, postupdateRegistration] = useOutletContext();
  const { registration, setRegistration } = useContext(RegistrationContext);

  const defaultFormValues = {
    retiring_current_year: false,
    retirement_date: null,
    ceremony_opt_out: false,
    bcgeu: false,
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  const {
    formState: { errors, isValid, isDirty },
    handleSubmit,
    reset,
    watch,
  } = methods;

  const [formComplete, setFormComplete] = useState(false);
  const formCompleteStatus = watch();

  useEffect(() => {
    setFormComplete(false);
  }, [formCompleteStatus]);

  const saveData = async (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    const date = finalData.retirement_date
      ? new Date(finalData.retirement_date).getTime()
      : null;
    console.log("this is date", date);

    const registrationUpdate = {
      ...registrationData,
      ...finalData,
      ...{ loading: true },
    };

    const finalRegistrationPost = {
      ...registrationUpdate,
      ...{ retirement_date: date },
    };
    console.log(
      finalRegistrationPost,
      "this update is checking spread operator"
    );
    await postupdateRegistration(finalRegistrationPost).then(() => {
      setRegistration(finalRegistrationPost);
      setFormComplete(true);
    });
  };

  const submitData = (e) => {
    e.preventDefault();
    try {
      navigate("/register/award");
    } catch (error) {}
  };

  useEffect(() => {
    reset(registration);
  }, [registration]);

  if (!isLSAEligible) return <LSAIneligible />;

  return (
    <>
      <div className="self-registration basic-profile">
        <FormProvider {...methods}>
          <form className="lsa-attendance-form">
            <AppPanel
              header={
                <>
                  Long Service Awards Attendance Details
                  <InfoToolTip
                    target="lsa-attendance-form"
                    content="Please provide your employment status and attendance plans for the Long Service Awards below."
                    position="top"
                  />
                </>
              }
            >
              <LSADetails panelName="personal" errors={errors} />
            </AppPanel>
            <div className="submission-buttons">
              <AppButton secondary onClick={handleSubmit(saveData)}>
                Save
              </AppButton>
              <AppButton
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
