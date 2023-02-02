import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router";
import { RegistrationContext } from "../../UserContext";
import { getAvailableAwards } from "../../api/api.services";

import AppButton from "../../components/common/AppButton";
import AwardSelector from "../../components/inputs/AwardSelector";
import LSAIneligible from "../../components/composites/LSAIneligible";
import "./Award.css";

import apiRoutesRegistrations from "../../api/api-routes-registrations";

/**
 * Award Selection Page.
 * Allows a user to select the award based on the available awards for their selected milestone.
 * Resets based on milestone selection.
 */

export default function Award() {
  const navigate = useNavigate();
  const { getAwards } = apiRoutesRegistrations;
  const [isLSAEligible, postupdateRegistration] = useOutletContext();

  const { registration, setRegistration } = useContext(RegistrationContext);

  const defaultFormValues = {
    awards: [
      {
        award: {
          id: "",
          label: "",
          description: "",
          award_options: [],
        },
      },
    ],
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  const [submissionData, setSubmissionData] = useState({});
  const [awardSelected, setAwardSelected] = useState(false);
  const [chosenAward, setChosenAward] = useState("");
  const [availableAwards, setAvailableAwards] = useState([]);

  const {
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
  } = methods;

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
      registrationUpdate["awards"][0]["award"]["label"]
        ? setAwardSelected(true)
        : false;
    });
  };

  const submitSelection = (data) => {
    const testValues = getValues("awards.0.award.award_options")[0];
    console.log(testValues, "these are award test values");
    const testData = data.options.map((each) => each.name);
    console.log(testData, "these are award test data");
    const finalOptions = {};

    testData.forEach((element) => {
      testValues[element]
        ? (finalOptions[element] = testValues[element])
        : null;
    });

    setValue("awards.0.award.award_options", [finalOptions]);
    const registrationData = {
      ...registration,
      ...{ awards: [{ award: { award_options: [] } }] },
    };
    const finalData = Object.assign({}, data);
    setChosenAward(data.id);
    setRegistration(registrationData);
    setSubmissionData(finalData);
    setAwardSelected(false);
  };

  //Final step in creating submission - will be api call to backend to update

  const submitData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };
    setSubmissionData(finalData);
    console.log(submissionData, "this is final submission data");
    try {
      navigate("/register/supervisor");
    } catch (error) {}
  };

  useEffect(() => {
    const setAwards = async () => {
      const currentMilestone = registration["milestone"]
        ? registration["milestone"]
        : null;
      const data = await getAvailableAwards(currentMilestone);
      // const data = await getAwards(currentMilestone);
      setAvailableAwards(data);
    };
    if (registration["awards"][0]["award"]["id"]) {
      setChosenAward(registration["awards"][0]["award"]["id"]);
      setAwardSelected(true);
    }
    setAwards();
  }, []);

  if (!isLSAEligible) return <LSAIneligible />;

  const currentMilestone = registration["milestone"] || null;

  return (
    <>
      <div className="self-registration award-profile">
        <FormProvider {...methods}>
          <form className="award-details-form">
            <AwardSelector
              milestone={currentMilestone}
              errors={errors}
              chosenAward={chosenAward}
              submitAward={submitSelection}
              awards={availableAwards}
            />
            <div className="submission-buttons">
              <AppButton secondary onClick={handleSubmit(saveData)}>
                Save
              </AppButton>
              <AppButton
                onClick={(e) => submitData(e)}
                disabled={!awardSelected}
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
