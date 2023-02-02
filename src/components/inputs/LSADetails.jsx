import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import "./LSADetails.css";
import classNames from "classnames";

/**
 * LSA Details reusable component.
 * @param {object} props
 * @param {object} props.errors inherited form errors object
 * @param {string} props.panelName string describing what panel these contact details belong to ex: Supervisor, Personal
  * @param {integer} props.itemNumber index of item within sublist; when used multiple times in a form, contact details will be registered as a separate item on form
 * @returns retiring current year status, retiring date, bcgeu member status, ceremony opt out status
 */

export default function LSADetails({ errors, panelName, itemNumber }) {
  //set todays date and populate start and end of year based on current date
  const today = new Date();
  const year = today.getFullYear();
  const startYear = new Date(year, 0, 0);
  const endYear = new Date(year, 11, 31);

  //Form input name formatting
  let panelGroupName = panelName
    ? `${panelName.replace(/\s/g, "")}`
    : "default";
  if (panelName && itemNumber) {
    panelGroupName += ` ${itemNumber}`;
  }

  const { control, watch, setValue } = useFormContext();

  const isRetiring = watch("retiring_current_year");

  return (
    <div className={`lsa-attendance-form-${panelGroupName}`}>
      <div className="container">
        <div className={`lsa-attendance-${panelGroupName}`}>
          <div className="lsa-attendance-details">
            <div className="lsa-attendance-form-field-container">
              <label
                htmlFor={`bcgeu`}
                className={classNames("block", {
                  "p-error": errors.bcgeu,
                })}
              >
                {`Are you a BCGEU member?`}
              </label>
              <div>
                <Controller
                  name="bcgeu"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      id={`${field.name}`}
                      aria-describedby={`bcgeu-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      inputId={field.name}
                      onChange={(e) => field.onChange(e.checked)}
                      checked={field.value}
                    />
                  )}
                />
                <small>Yes, I am a BCGEU member.</small>
              </div>
              {getFormErrorMessage(`bcgeu`, errors)}
            </div>

            <div className="lsa-attendance-form-field-container">
              <label
                htmlFor={`retiring_current_year`}
                className={classNames("block", {
                  "p-error": errors.retiring_current_year,
                })}
              >
                {`Are you retiring this year?`}
              </label>
              <div>
                <Controller
                  name="retiring_current_year"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      id={`${field.name}`}
                      aria-describedby={`retiring_current_year-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      inputId={field.name}
                      onChange={(e) => {
                        setValue("retirement_date", null);
                        field.onChange(e.checked);
                      }}
                      checked={field.value}
                    />
                  )}
                />
                <small>Yes, I am retiring this year.</small>
              </div>
              {getFormErrorMessage(`retiring_current_year`, errors)}
            </div>
            {isRetiring ? (
              <div className="lsa-attendance-form-field-container">
                <label
                  htmlFor={`retirement_date`}
                  className={classNames("block", {
                    "p-error": errors.retirement_date,
                  })}
                >
                  {`Please select your retirement date:`}
                </label>

                <Controller
                  name="retirement_date"
                  control={control}
                  rules={{
                    required:
                      "Error: Retirement date is required if you are retiring this year.",
                  }}
                  render={({ field, fieldState }) => (
                    <Calendar
                      id={`${field.name}`}
                      aria-describedby={`retirement_date-help`}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      dateFormat="dd/mm/yy"
                      mask="99/99/9999"
                      showIcon
                      placeholder="Select retirement date"
                      minDate={startYear}
                      maxDate={endYear}
                    />
                  )}
                />
                <small>Please select your retirement date.</small>

                {getFormErrorMessage(`retirement_date`, errors)}
              </div>
            ) : null}
            <div className="lsa-attendance-form-field-container">
              <label
                htmlFor={`ceremony_opt_out`}
                className={classNames("block", {
                  "p-error": errors.ceremony_opt_out,
                })}
              >
                {`Would you prefer to opt out of the Long Service Awards Ceremony?`}
              </label>
              <div>
                <Controller
                  name="ceremony_opt_out"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Checkbox
                      id={`${field.name}`}
                      aria-describedby={`ceremony_opt_out-help`}
                      {...field}
                      className={classNames("form-field block", {
                        "p-invalid": fieldState.error,
                      })}
                      inputId={field.name}
                      onChange={(e) => field.onChange(e.checked)}
                      checked={field.value}
                    />
                  )}
                />
                <small>
                  Yes, I want to receive my award only and opt out of attending
                  the ceremony.
                </small>
              </div>
              {getFormErrorMessage(`ceremony_opt_out`, errors)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
