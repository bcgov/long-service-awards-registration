import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation, useOutletContext } from "react-router";
import { RegistrationContext } from "../../UserContext";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";
import InfoToolTip from "../../components/common/InfoToolTip";

import formServices from "../../services/settings.services";

/**
 * Milestone Selection.
 * Allows user to use built in calculator to determine years of service and potential milestones.
 */

export default function MilestoneSelection() {
  const navigate = useNavigate();
  const pageIndex = 1;
  const location = useLocation();
  const [isLSAEligible, postupdateRegistration] = useOutletContext();

  const { registration, setRegistration } = useContext(RegistrationContext);

  const yearsData = location.state ? location.state["qualifyingYears"] : "";
  const ministryInherited = location.state
    ? location.state["ministryData"]
    : null;

  const ministryRegistration =
    registration && registration["organization"]
      ? registration["organization"]
      : null;

  const defaultFormValues = {
    // awards: [
    //   {
    //     award: {
    //       // years_of_service: null,
    //       milestone: null,
    //       qualifying_year: null,
    //       prior_milestones: [],
    //     },
    //   },
    // ],
    years_of_service: "",
    milestone: null,
    qualifying_year: "",
    prior_milestones: [],
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  const [ministrySelected, setMinistrySelected] = useState("");

  const {
    formState: { errors, isValid, isDirty },
    getValues,
    setValue,
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
    let updateData = {};
    if (data["milestone"] !== registration["milestone"]) {
      updateData = {
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
    }
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    const registrationUpdate = {
      ...registrationData,
      ...finalData,
      ...updateData,
      ...{ loading: true },
    };
    console.log(registrationUpdate, "this update is checking spread operator");
    postupdateRegistration(registrationUpdate).then(() => {
      setRegistration(registrationUpdate);
      setFormComplete(true);
    });
  };

  const submitData = (e) => {
    e.preventDefault();
    const finalData = { ...getValues() };
    console.log("final Data before set submission", finalData);
    try {
      navigate("/register/details");
    } catch (error) {}
  };

  useEffect(() => {
    //to update with api call to get ministry selection from prior profile page
    let minData = "org-1";
    const getMinistry = async () => {
      //update with api call for prior data
      if (ministryInherited) {
        minData = ministryInherited;
      }
      if (ministryRegistration) {
        minData = ministryRegistration;
      }
      const ministry =
        (await formServices.lookup("organizations", minData)) ||
        (await formServices.lookup("currentPinsOnlyOrganizations", minData)) ||
        "";
      setMinistrySelected(ministry);
      yearsData ? setValue("years_of_service", yearsData) : null;
    };
    getMinistry();
  }, []);

  useEffect(() => {
    reset(registration);
  }, [registration]);

  return (
    <>
      <div className="self-registration basic-profile">
        <FormProvider {...methods}>
          <form className="milestones-form">
            <AppPanel header="Milestones Information" collapsed toggleable>
              <div className="information-only-panel">
                <p>
                  Eligibility for service recognition programs is calculated
                  differently than pensionable time.
                </p>
                <ul>
                  <li>
                    Calculate your years of service by counting the calendar
                    years you’ve been working for an eligible organization,
                    including the year you started and the current year.{" "}
                  </li>
                  <li>
                    Time worked as a seasonal, co-op, part-time or auxiliary
                    employee counts.
                  </li>
                  <li>
                    Your service time is calculated based on cumulative service
                    time, rather than continuous.{" "}
                  </li>
                  <li>
                    That means any time worked prior to a break in service
                    counts towards your service time. Periods of leave with pay
                    (STIIP, maternity/parental leave, educational leave,
                    deferred salary leave, LTD up to a maximum of two years)
                    count towards years of service, but unpaid leave does not.
                  </li>
                </ul>
                <p>
                  Contact Careers & MyHR if you need to confirm your individual
                  service dates.
                </p>
              </div>
            </AppPanel>
            <AppPanel
              header={
                <>
                  Milestone Details
                  <InfoToolTip
                    target="milestones-form"
                    content="Enter your years of service and claim milestones in recognition of years served."
                  />
                </>
              }
            >
              <MilestoneSelector
                selfregister
                panelName="personal"
                errors={errors}
                ministry={ministrySelected}
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
