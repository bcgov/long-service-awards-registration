import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import classNames from "classnames";
import "./PecsfForm.css";

/**
 * Pecsf Award Options Component.
 * @param {object} props
 * @param {object} errors Inherited form errors object
 * @returns pecsf award and options
 */

export default function PecsfForm({ errors }) {
  const formName = `awards.0.award.award_options.${0}`;
  const [regions1, setRegions1] = useState([]);
  const [regions2, setRegions2] = useState([]);
  const [charity1, setCharity1] = useState([]);
  const [charity2, setCharity2] = useState([]);

  const methods = useFormContext();
  const { control, getValues, register, watch, setFocus } = methods;

  const [selectedDonation, setSelectedDonation] = useState(
    getValues(`donation-choice`)
  );

  //to update regions/charities by api
  useEffect(() => {}, []);

  {
    /* Added temporarily due to naming/nesting change */
  }
  const donationError =
    errors &&
    errors["awards"] &&
    errors["awards"][0] &&
    errors["awards"][0]["award"] &&
    errors["awards"][0]["award"]["award_options"] &&
    errors["awards"][0]["award"]["award_options"][0];

  //Reusable drop down form component
  function RenderDropdown({
    name,
    dropoptions,
    isrequired,
    dropplaceholder,
    isdisabled,
    errormessage,
  }) {
    return (
      <>
        <Controller
          name={`${formName}.${name}`}
          control={control}
          rules={{
            required: {
              value: isrequired || false,
              message: `Error: ${errormessage} is required.`,
            },
          }}
          render={({ field, fieldState }) => (
            <Dropdown
              id={`${field.name}`}
              disabled={isdisabled}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.value);
              }}
              aria-describedby={`${name}-help`}
              options={dropoptions}
              className={classNames("form-field block", {
                "p-invalid": fieldState.error,
              })}
              placeholder={`${dropplaceholder}`}
            />
          )}
        />
        {/* Added temporarily due to naming/nesting change */}
        {donationError &&
        errors["awards"][0]["award"]["award_options"][0][name] ? (
          <small className={`p-error ${name}-help`}>
            {errors["awards"][0]["award"]["award_options"][0][name].message}
          </small>
        ) : null}
        {/* {getFormErrorMessage(name, errors, "award_options", 0, name)} */}
      </>
    );
  }

  const watchRegion1 = watch(`${formName}.firstregion`);
  const watchRegion2 = watch(`${formName}.secondregion`);

  //to update sub-selection\ by watching for changes in regions
  useEffect(() => {}, [watchRegion1]);
  useEffect(() => {}, [watchRegion2]);

  return (
    <div className="pecsf-award-options">
      <div>
        <p>
          {" "}
          In lieu of receiving a Long Service Award, you may opt to make a
          charitable donation via Provincial Employees Community Services Fund
          (PECSF). <br />
          <b>
            Please Note - charitable tax receipts are not issued for LSA
            donations.
          </b>
        </p>
        <p>You may choose one of two donation options:</p>

        <ol>
          <li>
            to donate to the <b>PECSF Regional Pool Fund</b> Supported pool of
            charities in your region, OR,
          </li>
          <li>
            to donate to a registered charitable organization (maximum of two)
            of your choice.
          </li>
        </ol>
      </div>
      <div className="donation-choice-block">
        <h3
          htmlFor={`${formName}.donation-choice`}
          className={classNames("block", {
            "p-error": errors[`${formName}.donation-choice`],
          })}
        >
          Choose Your Donation
        </h3>
        <li className="award-option-block-radio">
          <div className="radio-option-line">
            <input
              {...register(`${formName}.donation-choice`, {
                required: {
                  value: true,
                  message: `Option selection is required`,
                },
              })}
              type="radio"
              onClick={(e) => {
                setFocus("firstregion");
                setSelectedDonation(`${e.target.value}`);
              }}
              value="regionalpool"
            />
            <label
              htmlFor={`${formName}.donation-choice-regionalpool`}
              className="block"
            >
              Donate to the PECSF Regional Pool Fund
            </label>
          </div>
          <div className="radio-option-line">
            <input
              {...register(`${formName}.donation-choice`, {
                required: {
                  value: true,
                  message: `Option selection is required`,
                },
              })}
              type="radio"
              onClick={(e) => {
                setFocus("firstregion");
                setSelectedDonation(`${e.target.value}`);
              }}
              value="choosecharity"
            />
            <label
              htmlFor={`${formName}.donation-choice-regionalpool`}
              className="block"
            >
              Donate to a registered charitable organization (maximum of two)
            </label>
          </div>
          {/* Added temporarily due to naming/nesting change */}
          {donationError &&
          errors["awards"][0]["award"]["award_options"][0][
            "donation-choice"
          ] ? (
            <small className={`p-error ${name}-help`}>
              {
                errors["awards"][0]["award"]["award_options"][0][
                  "donation-choice"
                ].message
              }
            </small>
          ) : null}
          {/* {getFormErrorMessage(
            `${"donation-choice"}`,
            errors,
            "awar_doptions",
            0,
            "donation-choice"
          )} */}
        </li>
      </div>
      <div className="pecsf-charity-selections">
        <div className="pecsf-choice-1">
          <li className="award-option-block">
            <label
              htmlFor={"firstregion"}
              className={classNames("block", {
                "p-error": errors["firstregion"],
              })}
            >
              Choose a region for your first donation
            </label>
            <RenderDropdown
              name="firstregion"
              dropoptions={regions1}
              isrequired={true}
              dropplaceholder="Please select a PECSF region"
              isdisabled={false}
              errormessage="PECSF region"
            />
          </li>
          <li className="award-option-block">
            <label
              htmlFor={"firstcharity"}
              className={classNames("block", {
                "p-error": errors["firstcharity"],
              })}
            >
              Choose a charity for your first donation
            </label>
            <RenderDropdown
              name="firstcharity"
              dropoptions={charity1}
              isrequired={true}
              dropplaceholder="Select a region to view charities"
              isdisabled={!watchRegion1}
              errormessage="Charity selection"
            />
            <small>
              Optional. If you do not see your charity listed, please contact
              PECSF@gov.bc.ca
            </small>
          </li>
        </div>
        {selectedDonation === "choosecharity" ? (
          <div className="pecsf-choice-2">
            <li className="award-option-block">
              <label
                htmlFor={"secondregion"}
                className={classNames("block", {
                  "p-error": errors["secondregion"],
                })}
              >
                Choose a region for your second donation
              </label>
              <RenderDropdown
                name="secondregion"
                dropoptions={regions2}
                isrequired={false}
                isdisabled={false}
                dropplaceholder="Please select a PECSF region"
                errormessage="PECSF region"
              />
              <small>Optional</small>
            </li>
            <li className="award-option-block">
              <label
                htmlFor={"secondcharity"}
                className={classNames("block", {
                  "p-error": errors["secondcharity"],
                })}
              >
                Choose a charity for your second donation
              </label>
              <RenderDropdown
                name="secondcharity"
                dropoptions={charity2}
                isrequired={getValues(`${formName}.secondregion`)}
                dropplaceholder="Select a region to view charities"
                isdisabled={!watchRegion2}
                errormessage="Charity selection"
              />
              <small>
                Optional. If you do not see your charity listed, please contact
                PECSF@gov.bc.ca
              </small>
            </li>
          </div>
        ) : null}
      </div>

      <div className="award-option-block">
        <label
          htmlFor={"donation-certificate"}
          className={classNames("block", {
            "p-error": errors["donation-certificate"],
          })}
        >
          How you would like your name to appear on your PECSF Donation
          certificate?
        </label>

        <Controller
          name={`${formName}.donation-certificate`}
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: `Option selection is required`,
            },
          }}
          render={({ field, fieldState }) => (
            <InputText
              ref={field.ref}
              id={`${field.name}`}
              aria-describedby={`${field.name}-help`}
              {...field}
              className={classNames("form-field block", {
                "p-invalid": fieldState.error,
              })}
              placeholder={`Enter the full name of the individual`}
            />
          )}
        />
        {/* Added temporarily due to naming/nesting change */}
        {donationError &&
        errors["awards"][0]["award"]["award_options"][0][
          "donation-certificate"
        ] ? (
          <small className={`p-error ${name}-help`}>
            {
              errors["awards"][0]["award"]["award_options"][0][
                "donation-certificate"
              ].message
            }
          </small>
        ) : null}
        <small>
          You can make the donation in memory or in honour of someone
        </small>
        {/* {getFormErrorMessage(
          `donation-certificate`,
          errors,
          "award_options",
          0,
          "donation-certificate"
        )} */}
      </div>
    </div>
  );
}
