import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RegistrationContext } from "../../UserContext";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import classNames from "classnames";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import DataDisplay from "../../components/common/DataDisplay";
import "./Confirmation.css";

/**
 * Final Confirmation page.
 * User verifies previously input data and is given the option to return and edit prior selections, or submit registration.
 */

export default function Confirmation() {
  const navigate = useNavigate();
  const [isLSAEligible, postupdateRegistration] = useOutletContext();

  const { registration, setRegistration } = useContext(RegistrationContext);

  //set todays date and populate end of year based on current date
  const today = new Date().getFullYear();
  const endYear = new Date(today, 11, 31).toDateString();

  //Load default form values and
  const defaultFormValues = {
    survey_participation: false,
  };

  const methods = useForm({
    defaultValues: useMemo(() => {
      const defaultSetting = { ...defaultFormValues, ...registration };
      return defaultSetting;
    }, [registration]),
  });

  const [submitted, setSubmitted] = useState(registration["confirmed"]);
  const [errorsRegistration, setErrorsRegistration] = useState({
    milestone: true,
    award: true,
    lsa: true,
    personal: true,
    contact: true,
    office: true,
    supervisor: true,
  });

  const [formData, setFormData] = useState([{}]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [registrationReady, setRegistrationReady] = useState(false);

  const { control, reset, handleSubmit } = methods;

  const submitData = async (data) => {
    const registrationData = registration;
    const finalData = Object.assign({}, data);
    let registrationUpdate = {
      ...registrationData,
      ...finalData,
      ...{ confirmed: true, loading: true },
    };

    if (!isLSAEligible) {
      const defaultFormReset = {
        personal_email: "",
        personal_phone: "",
        personal_address: {
          pobox: "",
          street1: "",
          street2: "",
          postal_code: "",
          community: "",
          province: "",
          country: "",
        },
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
        retirement_date: null,
        retiring_current_year: false,
        bcgeu: false,
        ceremony_opt_out: false,
      };
      registrationUpdate = { ...registrationUpdate, ...defaultFormReset };
    }
    await postupdateRegistration(registrationUpdate).then(() => {
      setRegistration(registrationUpdate);
      setSubmitted(true);
    });
  };

  useEffect(() => {
    const milestoneArray = [
      {
        years_of_service: registration["years_of_service"],
        milestone: registration["milestone"],
        qualifying_year: registration["qualifying_year"],
        prior_milestones: registration["prior_milestones"],
      },
    ];
    const personalArray = [
      {
        firstname: registration["contact"]["firstname"],
        lastname: registration["contact"]["lastname"],
        office_email: registration["contact"]["office_email"],
        office_phone: registration["contact"]["office_phone"],
        employee_number: registration["employee_number"],
        organization: registration["organization"],
        branch: registration["branch"],
      },
    ];
    const officeArray = [
      {
        community: registration["contact"]["office_address"]["community"],
        postal_code: registration["contact"]["office_address"]["postal_code"],
        street1: registration["contact"]["office_address"]["street1"],
        street2: registration["contact"]["office_address"]["street2"],
      },
    ];
    const supervisorArray = [
      {
        firstname: registration["supervisor"]["firstname"],
        lastname: registration["supervisor"]["lastname"],
        office_email: registration["supervisor"]["office_email"],
        street1: registration["supervisor"]["office_address"]["street1"],
        street2: registration["supervisor"]["office_address"]["street2"],
        community: registration["supervisor"]["office_address"]["community"],
        postal_code:
          registration["supervisor"]["office_address"]["postal_code"],
        pobox: registration["supervisor"]["office_address"]["pobox"],
      },
    ];

    const contactArray = [
      {
        personal_phone: registration["contact"]["personal_phone"],
        personal_email: registration["contact"]["personal_email"],
        street1: registration["contact"]["personal_address"]["street1"],
        street2: registration["contact"]["personal_address"]["street2"],
        community: registration["contact"]["personal_address"]["community"],
        postal_code: registration["contact"]["personal_address"]["postal_code"],
        province: registration["contact"]["personal_address"]["province"],
      },
    ];
    const awardArray = [
      {
        label: registration["awards"][0]["award"]["label"],
        description: registration["awards"][0]["award"]["description"],
        award_options: registration["awards"][0]["award"]["award_options"],
      },
    ];
    const lsaArray = [
      {
        retiring_current_year: registration["retiring_current_year"],
        retirement_date: registration["retirement_date"],
        ceremony_opt_out: registration["ceremony_opt_out"],
        bcgeu: registration["bcgeu"],
      },
    ];
    const lsaDataSet = {
      milestoneArray: milestoneArray,
      personalArray: personalArray,
      contactArray: contactArray,
      officeArray: officeArray,
      supervisorArray: supervisorArray,
      lsaArray: lsaArray,
      awardArray: awardArray,
    };

    const pinOnlyDataSet = {
      milestoneArray: milestoneArray,
      personalArray: personalArray,
      officeArray: officeArray,
      supervisorArray: supervisorArray,
    };

    const finalData = isLSAEligible ? lsaDataSet : pinOnlyDataSet;
    const errorValues = {
      milestone: !registration["years_of_service"],
      personal: !registration["contact"]["firstname"],
      office: !registration["contact"]["office_address"]["street1"],
      supervisor: !registration["supervisor"]["firstname"],

      award: isLSAEligible
        ? !registration["awards"][0]["award"]["label"] ||
          (registration["awards"][0]["award"]["label"] === "PECSF Donation" &&
            registration["awards"][0]["award"]["award_options"].length === 0)
        : false,
      lsa: false,
      contact: isLSAEligible
        ? !registration["contact"]["personal_address"]["street1"]
        : false,
    };
    setErrorsRegistration((state) => ({
      ...state,
      ...errorValues,
    }));

    const formErrors = Object.values(errorValues).every((v) => v === false);
    setRegistrationReady(formErrors);

    setFormData(finalData);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    reset(registration);
  }, [registration]);

  // Basic Panel header formatting specific to confirmation page
  const header = (title, path) => {
    const titlePath = title.toLowerCase().replace(/\s/g, "");
    return (
      <div className="confirmation-panel-details-header">
        <span>{title}:</span>
        {!submitted ? (
          <AppButton
            className="confirmation-panel-edit"
            passClass="p-button-raised"
            info
            onClick={(e) => {
              e.preventDefault();
              navigate(`/register/${path ? path : titlePath}`);
            }}
          >
            Edit
          </AppButton>
        ) : null}
      </div>
    );
  };

  const finalConfirm = () => {
    console.log("finalConfirm has worked");
    handleSubmit(submitData)();
  };

  const confirmSubmit = (event) => {
    confirmDialog({
      target: event.currentTarget,
      message:
        "Are you sure you want to submit?\n This action cannot be undone.\n Confirm that you have double checked all details, and your selections are correct.",
      icon: "pi pi-exclamation-triangle",
      accept: finalConfirm,
      reject: null,
    });
  };

  return (
    <>
      {hasLoaded ? (
        <div className="self-registration confirmation-profile">
          <AppPanel
            header={
              <>
                <span>
                  Registration Information: Status -{" "}
                  {submitted ? (
                    <span style={{ color: "green" }}>Submitted</span>
                  ) : (
                    <span style={{ color: "red" }}>In Progress</span>
                  )}
                </span>
              </>
            }
          >
            <div className="information-only-panel">
              <h4>Service Recognition</h4>
              <p>
                The information you have submitted indicates that you are
                {!submitted ? " registering" : " registered"} for the following
                recognition awards:
              </p>
              <ul>
                <li>Service Pins</li>
                {isLSAEligible ? <li>Long Service Awards</li> : null}
              </ul>

              {!submitted ? (
                <p>
                  Please review the confirmation details below and ensure that
                  the information you have entered is correct. Your submission
                  will not be complete until you have confirmed your
                  registration below. After confirming your registration, you
                  will not be able to make additional changes, so please check
                  that all information is correct.
                </p>
              ) : (
                <p>
                  If you have any concerns about your registration details,
                  please contact support.
                </p>
              )}
            </div>
          </AppPanel>

          <AppPanel header="Registration Confirmation">
            <div className="registration-confirmation-sections">
              <AppPanel header="Recognition Details">
                <div className="confirmation-panel-details">
                  <div
                    id="confirmation-milestone-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.milestone,
                    })}
                  >
                    <AppPanel header={header("Milestone")}>
                      {errorsRegistration.milestone ? (
                        <label
                          htmlFor="confirmation-milestone-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit milestone details
                          before submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="milestone"
                        data={formData}
                        identifier="milestoneArray"
                        stacked
                      />
                    </AppPanel>
                  </div>
                  {isLSAEligible ? (
                    <>
                      <div
                        id="confirmation-award-details"
                        className={classNames("confirmation-panel", {
                          "registration-confirmation-error":
                            errorsRegistration.award,
                        })}
                      >
                        <AppPanel header={header("Award")}>
                          {errorsRegistration.award ? (
                            <label
                              htmlFor="confirmation-award-details"
                              className="registration-confirmation-error-text"
                            >
                              Missing Information. Please edit award selection
                              before submission.
                            </label>
                          ) : null}
                          <DataDisplay
                            category="award"
                            data={formData}
                            identifier="awardArray"
                          />
                        </AppPanel>
                      </div>
                      <div
                        id="confirmation-lsa-details"
                        className={classNames("confirmation-panel", {
                          "registration-confirmation-error":
                            errorsRegistration.lsa,
                        })}
                      >
                        <AppPanel
                          header={header("Long Service Awards", "attendance")}
                        >
                          {errorsRegistration.lsa ? (
                            <label
                              htmlFor="confirmation-lsa-details"
                              className="registration-confirmation-error-text"
                            >
                              Missing Information. Please edit Long Service
                              Awards details before submission.
                            </label>
                          ) : null}
                          <DataDisplay
                            category="lsa"
                            data={formData}
                            identifier="lsaArray"
                          />
                        </AppPanel>
                      </div>
                    </>
                  ) : null}
                </div>
              </AppPanel>

              <AppPanel header="Contact Details">
                <div className="confirmation-panel-details">
                  <div
                    id="confirmation-personal-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.personal,
                    })}
                  >
                    <AppPanel header={header("Personal Profile", "profile")}>
                      {errorsRegistration.personal ? (
                        <label
                          htmlFor="confirmation-personal-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit personal details
                          before submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="profile"
                        data={formData}
                        identifier="personalArray"
                      />
                    </AppPanel>
                  </div>
                  {isLSAEligible ? (
                    <div
                      id="confirmation-contact-details"
                      className={classNames("confirmation-panel", {
                        "registration-confirmation-error":
                          errorsRegistration.contact,
                      })}
                    >
                      <AppPanel header={header("Personal Contact", "details")}>
                        {errorsRegistration.contact ? (
                          <label
                            htmlFor="confirmation-contact-details"
                            className="registration-confirmation-error-text"
                          >
                            Missing Information. Please edit contact details
                            before submission.
                          </label>
                        ) : null}
                        <DataDisplay
                          category="personalContact"
                          data={formData}
                          identifier="contactArray"
                        />
                      </AppPanel>
                    </div>
                  ) : null}
                  <div
                    id="confirmation-office-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.office,
                    })}
                  >
                    <AppPanel
                      header={header("Personal Office Address", "details")}
                    >
                      {errorsRegistration.office ? (
                        <label
                          htmlFor="confirmation-office-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit office details before
                          submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="office"
                        data={formData}
                        identifier="officeArray"
                      />
                    </AppPanel>
                  </div>
                  <div
                    id="confirmation-supervisor-details"
                    className={classNames("confirmation-panel", {
                      "registration-confirmation-error":
                        errorsRegistration.supervisor,
                    })}
                  >
                    <AppPanel
                      header={header("Supervisor Information", "supervisor")}
                    >
                      {errorsRegistration.supervisor ? (
                        <label
                          htmlFor="confirmation-supervisor-details"
                          className="registration-confirmation-error-text"
                        >
                          Missing Information. Please edit supervisor details
                          before submission.
                        </label>
                      ) : null}
                      <DataDisplay
                        category="supervisor"
                        data={formData}
                        identifier="supervisorArray"
                      />
                    </AppPanel>
                  </div>
                </div>
              </AppPanel>
            </div>
          </AppPanel>
          <FormProvider {...methods}>
            {!submitted ? (
              <form className="confirmation-details-form">
                <AppPanel header="Declaration and Consent">
                  <div className="consent-and-declaration">
                    <div className="declaration-true">
                      <div className="declaration-body">
                        <h4>Eligible Programs:</h4>
                        <p>
                          I declare, to the best of my knowledge and consistent
                          with the Service Pin{" "}
                          <a
                            href="https://longserviceawards.gww.gov.bc.ca/service-pins/"
                            target={"_blank"}
                          >
                            eligibility guidelines
                          </a>{" "}
                          (which I have reviewed) that as of {endYear}, I will
                          have worked for the BC Public Service for 5, 10, 15,
                          20, 25, 30, 35, 40, 45 or 50 years and I am therefore
                          eligible for a Service Pin.
                        </p>
                        {isLSAEligible ? (
                          <>
                            <p>
                              I declare, to the best of my knowledge and
                              consistent with the Long Service Awards{" "}
                              <a
                                href="https://longserviceawards.gww.gov.bc.ca/eligibility/"
                                target={"_blank"}
                              >
                                eligibility guidelines
                              </a>{" "}
                              (which I have reviewed) that as of {endYear}, I
                              will have worked for the BC Public Service for 25,
                              30, 35, 40, 45 or 50 years and I am therefore
                              eligible for a Long Service Award.
                            </p>
                          </>
                        ) : null}
                        <h4>Information Disclosure:</h4>
                        <p>
                          By providing my personal information, I am allowing
                          the BC Public Service Agency to use and disclose this
                          information for the planning and delivery of the
                          Service Pin program
                          {isLSAEligible ? (
                            <> and Long Service Award recognition events</>
                          ) : null}
                          .{" "}
                        </p>
                        <p>
                          This personal information is required to process your
                          application for the recognition programs and is
                          collected in accordance with{" "}
                          <a
                            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96165_03#section26"
                            target={"_blank"}
                          >
                            section 26(c)
                          </a>{" "}
                          of the Freedom of Information and Protection of
                          Privacy Act (FOIPPA).{" "}
                        </p>{" "}
                        <p>
                          Questions about the collection or use of this
                          information can be directed to Program Manager,{" "}
                          <a href="mailto: LongServiceAwards@gov.bc.ca">
                            LongServiceAwards@gov.bc.ca
                          </a>
                          , 1st floor - 563 Superior Street, Victoria BC, V8V
                          0C5, or by calling{" "}
                          <a href="tel:1-877-277-0772">1.877.277.0772</a>
                        </p>
                      </div>
                      <div className="confirmation-form-checkbox">
                        <Checkbox
                          inputId="declaration"
                          checked={declaration}
                          onChange={(e) => setDeclaration(e.checked)}
                        />
                        <label
                          htmlFor="declaration"
                          style={
                            declaration ? { color: "green" } : { color: "red" }
                          }
                        >
                          I declare the information provided in this
                          registration to be accurate.
                        </label>
                      </div>
                    </div>
                    <div className="consent-true">
                      <h5>Would you like to participate in our survey?</h5>
                      <div className="confirmation-form-checkbox">
                        <Controller
                          name="survey_participation"
                          defaultValue={false}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id={field.name}
                              {...field}
                              inputId="survey_participation"
                              checked={field.value}
                              onChange={(e) => {
                                setConsentChecked(e.checked);
                                field.onChange(e.checked);
                              }}
                            />
                          )}
                        />
                        <label
                          htmlFor={`survey_participation`}
                          className="block"
                          style={
                            consentChecked
                              ? { color: "green" }
                              : { color: "red" }
                          }
                        >
                          Yes, I would like to participate in the LSA survey.
                        </label>
                      </div>
                    </div>
                  </div>
                </AppPanel>
                {!registrationReady && declaration ? (
                  <label
                    id="confirmation-final-submission-details-help"
                    htmlFor="confirmation-final-submission-details"
                    className="registration-confirmation-error-text"
                  >
                    Your registration is missing some information and cannot be
                    submitted until this is corrected. Please complete all
                    required form fields. Missing form fields are identified
                    above.
                  </label>
                ) : null}

                <div
                  id="confirmation-final-submission-details"
                  className="submission-buttons"
                >
                  <ConfirmDialog />
                  <AppButton
                    passClass="final-confirmation-button"
                    tooltip={!declaration ? "Declaration Required." : null}
                    tooltipOptions={{ showOnDisabled: true, position: "top" }}
                    secondary
                    onClick={(e) => {
                      e.preventDefault();
                      confirmSubmit(e);
                    }}
                    disabled={!declaration || !registrationReady}
                  >
                    Confirm/Submit Registration
                  </AppButton>
                </div>
              </form>
            ) : null}
          </FormProvider>
        </div>
      ) : null}
    </>
  );
}
