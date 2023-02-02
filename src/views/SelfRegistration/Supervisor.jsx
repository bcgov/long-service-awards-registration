import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RegistrationContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import AddressInput from "../../components/inputs/AddressInput";
import ContactDetails from "../../components/inputs/ContactDetails";
import InfoToolTip from "../../components/common/InfoToolTip";

/**
 * Supervisor Information Page.
 */

export default function Supervisor() {
  const navigate = useNavigate();
  const [isLSAEligible, postupdateRegistration] = useOutletContext();
  const { registration, setRegistration } = useContext(RegistrationContext);

  const defaultFormValues = {
    supervisor: {
      firstname: "",
      lastname: "",
      office_email: "",
      office_phone: "",
      office_address: {
        pobox: "",
        street1: "",
        street2: "",
        postal_code: "",
        community: "",
        province: "",
        country: "",
      },
    },
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

  const [formComplete, setFormComplete] = useState(false);
  const formCompleteStatus = watch();

  useEffect(() => {
    setFormComplete(false);
  }, [formCompleteStatus]);

  const saveData = async (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
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
    try {
      navigate("/register/confirmation");
    } catch (error) {}
  };

  useEffect(() => {
    reset(registration);
  }, [registration]);

  return (
    <>
      <div className="self-registration supervisor-profile">
        <FormProvider {...methods}>
          <form className="supervisor-details-form">
            <AppPanel
              header={
                <>
                  <span className="supervisor-details-profile">
                    Supervisor Details
                  </span>

                  <InfoToolTip
                    target="supervisor-details-profile"
                    content="Please enter the contact information of your current supervisor."
                  />
                </>
              }
            >
              <ContactDetails basic panelName="supervisor" errors={errors} />
            </AppPanel>
            <AppPanel
              header={
                <>
                  <span className="supervisor-details-office">
                    Supervisor Office Address
                  </span>

                  <InfoToolTip
                    target="supervisor-details-office"
                    content="Please enter the local office address of your current supervisor."
                    position="top"
                  />
                </>
              }
            >
              <AddressInput
                pobox
                addressIdentifier="office"
                errors={errors}
                contactType="supervisor"
              />
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
