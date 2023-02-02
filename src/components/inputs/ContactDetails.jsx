import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import classNames from "classnames";

import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import formServices from "../../services/settings.services";

import "./ContactDetails.css";

/**
 * Contact Details Reusable component.
 * @param {object} props
 * @param {(index) => void} props.ministryRef function for minstry choice to be handled by parent component
 * @param {integer} props.index index of item within form
 * @param {boolean} props.basic state variable boolean for controlling if basic fields are displayed
 * @param {boolean} props.extended state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.delegated state variable boolean for controlling if all fields are displayed
 * @param {boolean} props.personalContact state variable boolean for controlling if personal contact information displayed
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
 * @param {integer} props.itemNumber index of item within sublist; when used multiple times in a form, contact details will be registered as a separate item on form
 * @param {object} props.errors inherited errors object
 * @returns firstname, lastname, office email, office phone, employee number, organization, branch, personal phone, personal email
 */

export default function ContactDetails({
  ministryRef,
  index,
  basic,
  extended,
  delegated,
  personalContact,
  panelName,
  itemNumber,
  errors,
}) {
  const { control } = useFormContext();
  //Organization dropdown list - to be moved up
  const organizations = formServices.get("organizations") || [];
  const fullOrgList = organizations.concat(
    formServices.get("currentPinsOnlyOrganizations") || []
  );

  //Form input name formatting
  let panelGroupName = panelName
    ? `${panelName.replace(/\s/g, "")}`
    : "default";
  if (panelName === "personal") {
    panelGroupName = "contact";
  }
  if (panelName && itemNumber) {
    panelGroupName += ` ${itemNumber}`;
  }
  const panelTitle =
    panelName === "personal" ? "" : formServices.capitalize(panelName) || "";
  const panelPlaceholder =
    panelName === "personal"
      ? "Your"
      : formServices.capitalize(panelName) || "";

  const formItemName = itemNumber
    ? `${panelName}.${itemNumber - 1}.`
    : `${panelGroupName}.`;

  const formItemBase = itemNumber ? `${panelName}.${itemNumber - 1}.` : ``;

  const errorBodyName = panelName === "personal" ? "contact" : panelName;

  //On blur of ministry selection runs callback with given form value
  const onBlurMinistry = (event) => {
    const currentFormValue =
      formServices.lookup("organizations", event) ||
      formServices.lookup("currentPinsOnlyOrganizations", event);
    ministryRef ? ministryRef(index, currentFormValue) : null;
  };

  //To fix error handling to make sure naming convention works

  return (
    <div className={`contact-details-form-${panelGroupName}`}>
      <div className="container">
        <div
          className={`contact-information-${panelGroupName} contact-form-personal-details`}
        >
          {basic ? (
            <div className="contact-form-basic-details">
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}firstname`}
                  className={classNames("block", {
                    "p-error": errors.firstname,
                  })}
                >
                  {`${panelTitle} First Name`}
                </label>
                <Controller
                  name={`${formItemName}firstname`}
                  control={control}
                  rules={{ required: "Error: First name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      aria-describedby={`${formItemName}firstname-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder={`${panelPlaceholder} first name`}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${formItemName}firstname`,
                  errors,
                  errorBodyName,
                  itemNumber - 1,
                  "firstname"
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}lastname`}
                  className={classNames("block", {
                    "p-error": errors.lastname,
                  })}
                >
                  {`${panelTitle} Last Name`}
                </label>
                <Controller
                  name={`${formItemName}lastname`}
                  control={control}
                  rules={{ required: "Error: Last name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      aria-describedby={`${panelGroupName}-lastname-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      placeholder={`${panelPlaceholder} last name`}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${formItemName}lastname`,
                  errors,
                  errorBodyName,
                  itemNumber - 1,
                  "lastname"
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}office_email`}
                  className={classNames("block", {
                    "p-error": !!errors.office_email,
                  })}
                >
                  {`${panelTitle} Government Email`}
                </label>
                <Controller
                  name={`${formItemName}office_email`}
                  control={control}
                  rules={{
                    required: "Error: Government email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address. E.g. example@gov.bc.ca",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      type="text"
                      aria-describedby={`${panelGroupName}-government-email-help`}
                      placeholder={`${panelPlaceholder} government email`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${formItemName}office_email`,
                  errors,
                  errorBodyName,
                  itemNumber - 1,
                  "office_email"
                )}
              </div>
            </div>
          ) : null}
          <div>
            <div className="contact-form-extended-details">
              {extended ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${formItemName}office_phone`}
                    className={classNames("block", {
                      "p-error": errors.office_phone,
                    })}
                  >
                    {`${panelTitle} Government Phone Number`}
                  </label>
                  <Controller
                    name={`${formItemName}office_phone`}
                    control={control}
                    rules={{
                      required: "Error: Government phone number is required.",
                      pattern: {
                        value:
                          /^(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
                        message: "Invalid phone number. E.g. (555)-555-5555",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputMask
                        id={`${field.name}`}
                        mask="(999) 999-9999? x99999"
                        autoClear={false}
                        {...field}
                        placeholder={`${panelPlaceholder} government phone number Ex. (999) 999-9999 x99999`}
                        aria-describedby={`${panelGroupName}-government-phone-help`}
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `${formItemName}office_phone`,
                    errors,
                    errorBodyName,
                    itemNumber - 1,
                    "office_phone"
                  )}
                </div>
              ) : null}
              {extended || delegated ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${formItemBase}employee_number`}
                    className={classNames("block", {
                      "p-error": errors.employee_number,
                    })}
                  >
                    {`${panelTitle} Employee Number`}
                  </label>
                  <Controller
                    name={`${formItemBase}employee_number`}
                    control={control}
                    rules={{
                      required: "Error: Employee number is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${field.name}`}
                        aria-describedby={`${panelGroupName}-employee_number-help`}
                        {...field}
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                        placeholder={`${panelPlaceholder} employee number`}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `${formItemName}employee_number`,
                    errors,
                    errorBodyName,
                    itemNumber - 1,
                    "employee_number"
                  )}
                </div>
              ) : null}
              {extended || delegated ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${formItemBase}organization`}
                    className={classNames("block", {
                      "p-error": errors.organization,
                    })}
                  >
                    {`${panelTitle} Ministry/Organization`}
                  </label>
                  <Controller
                    name={`${formItemBase}organization`}
                    control={control}
                    rules={{
                      required: "Error: Ministry or Organization is required.",
                    }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={`${field.name}`}
                        value={field.value}
                        onChange={(e) => {
                          onBlurMinistry(e.value);
                          field.onChange(e.value);
                        }}
                        aria-describedby={`${panelGroupName}-organization-help`}
                        options={fullOrgList}
                        optionLabel="text"
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                        placeholder={`Select ${panelPlaceholder} ministry or organization`}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `organization`,
                    errors,
                    errorBodyName,
                    itemNumber - 1,
                    "organization"
                  )}
                </div>
              ) : null}
              {extended ? (
                <div className="contact-form-field-container">
                  <label
                    htmlFor={`${formItemBase}branch`}
                    className={classNames("block", {
                      "p-error": errors.branch,
                    })}
                  >
                    {`${panelTitle} Branch`}
                  </label>
                  <Controller
                    name={`${formItemBase}branch`}
                    control={control}
                    rules={{ required: "Error: Branch is required." }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={`${field.name}`}
                        aria-describedby={`${panelGroupName}-branch-help`}
                        {...field}
                        className={classNames("form-field block", {
                          "p-invalid": fieldState.error,
                        })}
                        placeholder={`${panelPlaceholder} branch`}
                      />
                    )}
                  />
                  {getFormErrorMessage(
                    `branch`,
                    errors,
                    errorBodyName,
                    itemNumber - 1,
                    "branch"
                  )}
                </div>
              ) : null}
            </div>
          </div>
          {personalContact ? (
            <div className="contact-form-personalcontact-details">
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}personal_phone`}
                  className={classNames("block", {
                    "p-error": errors.personal_phone,
                  })}
                >
                  {`${panelTitle} Personal Phone Number`}
                </label>
                <Controller
                  name={`${formItemName}personal_phone`}
                  control={control}
                  rules={{
                    required: "Error: Personal phone number is required.",
                    pattern: {
                      value:
                        /^(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
                      message: "Invalid phone number. E.g. (555)-555-5555",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputMask
                      id={`${field.name}`}
                      mask="(999) 999-9999? x99999"
                      autoClear={false}
                      {...field}
                      placeholder={`${panelPlaceholder} personal phone number Ex. (999) 999-9999 x99999`}
                      aria-describedby={`${panelGroupName}-personal_phone-help`}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${formItemName}personal_phone`,
                  errors,
                  errorBodyName,
                  itemNumber - 1,
                  "personal_phone"
                )}
              </div>
              <div className="contact-form-field-container">
                <label
                  htmlFor={`${formItemName}personal_email`}
                  className={classNames("block", {
                    "p-error": !!errors.personal_email,
                  })}
                >
                  {`${panelTitle} Personal Email Address`}
                </label>
                <Controller
                  name={`${formItemName}personal_email`}
                  control={control}
                  rules={{
                    required: "Error: Personal email address is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address. E.g. example@email.com",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={`${field.name}`}
                      type="text"
                      aria-describedby={`${panelGroupName}-personal_email-help`}
                      placeholder={`${panelPlaceholder} personal email address`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage(
                  `${formItemName}personal_email`,
                  errors,
                  errorBodyName,
                  itemNumber - 1,
                  "personal_email"
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
