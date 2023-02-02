import React, { useEffect, useState } from "react";
import AppButton from "../common/AppButton";
import ServiceCalculator from "./ServiceCalculator";
import { Controller, useFormContext } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import formServices from "../../services/settings.services";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";

import classNames from "classnames";
import "./MilestoneSelector.css";
import InfoToolTip from "../common/InfoToolTip";

/**
 * Milestones reusable component.
 * @param {object} props
 * @param {boolean} props.selfregister state variable boolean for controlling if all fields are displayed dependent on whether or not this is a user self-registering
 * @param {string} props.ministry state describing what ministry has been selected for the user
 * @param {object} props.errors inherited form errors object
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @param {integer} props.itemNumber index of item within sublist; when used multiple times in a form, contact details will be registered as a separate item on form
 * @returns years of service, current milestone, qualifying year, prior milestones, 
 */

export default function MilestoneSelector({
  selfregister,
  ministry,
  errors,
  panelName,
  itemNumber,
}) {
  //Form input name formatting
  let panelGroupName = panelName
    ? `${panelName.replace(/\s/g, "")}`
    : "default";
  if (panelName && itemNumber) {
    panelGroupName += ` ${itemNumber}`;
  }
  const panelTitle =
    panelName === "personal" ? "" : formServices.capitalize(panelName) || "";
  const panelPlaceholder =
    panelName === "personal"
      ? "your"
      : formServices.capitalize(panelName) || "";

  const itemName = itemNumber ? `${panelName}.${itemNumber - 1}.` : ``;

  const milestones = formServices.get("milestones") || [];

  //Get eligible years
  const date = new Date().getFullYear();
  const yearsDateRange = [];
  for (let i = 0; i < 4; i++) {
    yearsDateRange.push(date - i);
  }
  const yearsList = yearsDateRange.map((each) => ({
    value: each,
    text: each,
  }));

  const [availableMilestones, setAvailableMilestones] = useState(milestones);
  const [priorMilestonesAvailable, setPriorMilestonesAvailable] =
    useState(milestones);
  const [qualifyingYears, setQualifyingYears] = useState(yearsList);
  const [milestoneSelected, setMilestoneSelected] = useState(false);

  const [calculatorButton, setCalculatorButton] = useState(false);
  const [calculatorDropdown, setCalculatorDropdown] = useState(false);
  const [ministryCalc, setMinistryCalc] = useState("");

  const { control, setValue, clearErrors, resetField, getValues, watch } =
    useFormContext();

  useEffect(() => {
    setMinistryCalc(ministry);
  }, [ministry]);

  //Monitor years of service change and update fields any time anything new is entered

  const onYearsOfServiceChange = () => {
    resetField(`${itemName}milestone`, { defaultValue: null });
    resetField(`${itemName}prior_milestones`, { defaultValue: [] });
    resetField(`${itemName}qualifying_year`, { defaultValue: "" });

    const milestones = formServices.get("milestones") || [];
    const filteredMilestones = milestones.filter(
      (milestone) =>
        milestone["value"] <= getValues(`${itemName}years_of_service`)
    );
    const filteredPriorMilestones = milestones.filter(
      (milestone) =>
        milestone["value"] < getValues(`${itemName}years_of_service`)
    );
    setAvailableMilestones(filteredMilestones);
    setPriorMilestonesAvailable(filteredPriorMilestones);
  };

  const watchYearsOfService = watch(`${itemName}years_of_service`);

  useEffect(() => {
    onYearsOfServiceChange();
  }, [watchYearsOfService]);

  const onMilestoneSelection = (e) => {
    e.value.length > 0 || e.value > 0
      ? setMilestoneSelected(true)
      : setMilestoneSelected(false);
  };

  const currentPinsOnlyOrgs =
    formServices.get("currentPinsOnlyOrganizations") || [];

  const ministryEligible = currentPinsOnlyOrgs.some(
    (org) => org["text"] === ministryCalc
  )
    ? false
    : true;

  const toggleCalculator = (e) => {
    e.preventDefault();
    setCalculatorButton(!calculatorButton);
    setCalculatorDropdown(!calculatorDropdown);
  };

  const calculateTotal = (newValue) => {
    if (newValue !== 0) {
      setValue(`${itemName}years_of_service`, newValue);
      clearErrors(`${itemName}years_of_service`);
    }
  };

  const errorBodyName = panelName === "personal" ? "contact" : panelName;

  return (
    <div className={`milestone-form-${panelGroupName}`}>
      <div className="container">
        <div
          className={`milestoneselector-${panelGroupName} milestone-form-details`}
        >
          <div className="milestone-form-field-container yearsofservice-block">
            <div className="milestone-form-yearsofservice-block">
              <label
                htmlFor={`${itemName}years_of_service`}
                className={classNames("block", {
                  "p-error": errors.years_of_service,
                })}
              >
                {`${panelTitle} Years of Service`}
              </label>
              <Controller
                name={`${itemName}years_of_service`}
                control={control}
                rules={{ required: "Error: Years of Service is required." }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    inputId="withoutgrouping"
                    min={0}
                    max={99}
                    id={`${field.name}`}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    aria-describedby={`${panelGroupName}-years_of_service-help`}
                    className={classNames("form-field block", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder={`Enter ${panelPlaceholder} years of service`}
                    tooltip="Enter total years of service. Only individuals with 25+ years of service are eligible for the Long Service Awards."
                    tooltipOptions={{ position: "right" }}
                  />
                )}
              />
              {getFormErrorMessage(
                `years_of_service`,
                errors,
                errorBodyName,
                itemNumber - 1,
                "years_of_service"
              )}
            </div>
            <div className="calculator-button-toggle">
              <AppButton
                danger={calculatorButton}
                secondary={!calculatorButton}
                onClick={toggleCalculator}
              >
                {calculatorButton ? "Hide Calculator" : "Show Calculator"}
              </AppButton>
              <InfoToolTip
                target="calculator-button"
                content="Use the calculator if you are not sure of the total years of service worked."
                position="top"
              />
            </div>
          </div>
          {calculatorDropdown ? (
            <ServiceCalculator formSubmit={calculateTotal}></ServiceCalculator>
          ) : null}
          <div className="milestone-form-field-container">
            <label
              htmlFor={`${itemName}milestone`}
              className={classNames("block", {
                "p-error": errors.milestone,
              })}
            >
              {`${panelTitle} Current Milestone`}
            </label>
            <Controller
              name={`${itemName}milestone`}
              control={control}
              rules={{
                required: {
                  value: !milestoneSelected,
                  message: "Error: Milestone selection is required.",
                },
              }}
              render={({ field, fieldState }) => (
                <Dropdown
                  disabled={!getValues(`${itemName}years_of_service`)}
                  id={`${field.name}`}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                    onMilestoneSelection(e);
                  }}
                  aria-describedby={`${panelGroupName}-milestone-help`}
                  options={availableMilestones}
                  optionLabel="text"
                  className={classNames("form-field block", {
                    "p-invalid": fieldState.error,
                  })}
                  placeholder={`Select ${panelPlaceholder} current milestone.`}
                  tooltip="Service Pin Milestone Years include: 5, 10, 15, 20. Service Pin and LSA Milestone Years include: 25, 30, 35, 40, 45, 50."
                  tooltipOptions={{ position: "top" }}
                />
              )}
            />
            {getFormErrorMessage(
              `milestone`,
              errors,
              errorBodyName,
              itemNumber - 1,
              "milestone"
            )}
          </div>
          {getValues(`${itemName}milestone`) && selfregister ? (
            <div className="milestone-form-field-container">
              <label
                htmlFor={`${itemName}qualifying_year`}
                className={classNames("block", {
                  "p-error": errors.qualifying_year,
                })}
              >
                {`${panelTitle} Qualifying Year`}
              </label>
              <Controller
                name={`${itemName}qualifying_year`}
                control={control}
                rules={{
                  required: {
                    value: getValues(`${itemName}milestone`),
                    message: "Error: Qualifying Year is required.",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    disabled={!getValues(`${itemName}years_of_service`)}
                    id={`${field.name}`}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    aria-describedby={`${panelGroupName}-qualifying_year-help`}
                    options={qualifyingYears}
                    optionLabel="text"
                    tooltip="Select the year that qualified for the current milestone."
                    tooltipOptions={{ position: "top" }}
                    className={classNames("form-field block", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder={`During which year was this milestone reached.`}
                  />
                )}
              />
              {getFormErrorMessage(
                `qualifying_year`,
                errors,
                errorBodyName,
                itemNumber - 1,
                "qualifying_year"
              )}
            </div>
          ) : null}

          {ministryEligible ? (
            <div className="milestone-form-field-container">
              <label
                htmlFor={`${itemName}prior_milestones`}
                className={classNames("block", {
                  "p-error": errors.prior_milestones,
                })}
              >
                {`${panelTitle} Prior Unclaimed Milestone(s) Selected`}
              </label>
              <Controller
                name={`${itemName}prior_milestones`}
                control={control}
                render={({ field, fieldState }) => (
                  <MultiSelect
                    disabled={!getValues(`${itemName}years_of_service`)}
                    id={`${field.name}`}
                    display="chip"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
                      onMilestoneSelection(e);
                    }}
                    aria-describedby={`${panelGroupName}-prior_milestones-help`}
                    options={priorMilestonesAvailable}
                    optionLabel="text"
                    tooltip="If prior Service Pins have not been claimed, use this field to submit a claim of eligibility for those years."
                    tooltipOptions={{ position: "top" }}
                    className={classNames("form-field block", {
                      "p-invalid": fieldState.error,
                    })}
                    placeholder={`Select ${panelPlaceholder} prior milestones.`}
                  />
                )}
              />
              {getFormErrorMessage(
                `prior_milestones`,
                errors,
                errorBodyName,
                itemNumber - 1,
                "prior_milestones"
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
