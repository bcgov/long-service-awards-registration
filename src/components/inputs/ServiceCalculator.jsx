import React, { useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";

import AppButton from "../common/AppButton";
import InfoToolTip from "../common/InfoToolTip";
import "./ServiceCalculator.css";

/**
 * Service Calculator component calculates years of service from given year inputs.
 * @param {() => void} props.formSubmit function to execute on form submission
 * @returns
 */

export default function ServiceCalculator({ formSubmit }) {
  const [displayHelp, setDisplayHelp] = useState(false);
  const toggleHelp = () => {
    setDisplayHelp(!displayHelp);
  };

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: {
      serviceCalculator: [{ startYear: "", endYear: "", years: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "serviceCalculator",
  });

  const onSubmit = (data) => {
    const yearSet = [];
    data["serviceCalculator"].forEach((element) => {
      const startYear = element["startYear"]
        ? element["startYear"].getFullYear()
        : 0;
      const endYear = element["endYear"]
        ? element["endYear"].getFullYear()
        : startYear;
      for (let i = startYear; i <= endYear; i++) {
        yearSet.push(i);
      }
    });

    const finalYears = [...new Set(yearSet)].length;

    formSubmit ? formSubmit(finalYears) : null;
  };

  const YearCalculator = (index) => {
    const start = getValues(`serviceCalculator.${index}.startYear`);
    const end = getValues(`serviceCalculator.${index}.endYear`);
    const startYear = start ? start.getFullYear() : new Date().getFullYear();
    const endYear = end
      ? end.getFullYear()
      : start.getFullYear() || new Date().getFullYear();
    let lineItemYearsTotal =
      endYear - startYear <= -1 ? 0 : endYear - startYear + 1;
    setValue(`serviceCalculator.${index}.years`, lineItemYearsTotal);
  };

  const TotalYears = ({ control }) => {
    const value = useWatch({
      name: "serviceCalculator",
      control,
    });
    const yearSet = [];
    value.forEach((element) => {
      const startYear = element["startYear"]
        ? element["startYear"].getFullYear()
        : 0;
      const endYear = element["endYear"]
        ? element["endYear"].getFullYear()
        : startYear;
      for (let i = startYear; i <= endYear; i++) {
        i !== 0 ? yearSet.push(i) : null;
      }
    });

    const finalYears = [...new Set(yearSet)].length;

    return <>{finalYears || 0}</>;
  };

  return (
    <div className="service-calculator-component">
      <span className="service-calculator-header">
        <h4>Years of Service Calculator</h4>
        <AppButton
          icon="pi pi-question-circle"
          onClick={(e) => {
            {
              e.preventDefault();
              toggleHelp();
            }
          }}
        >
          Help
        </AppButton>
      </span>
      <Dialog
        header="How to use the years of service calculator"
        visible={displayHelp}
        style={{ width: "90vw" }}
        onHide={() => toggleHelp()}
        className="information-only-panel"
      >
        <p>You only need to input years.</p>
        <p>
          Enter your start year and your end year to check eligibility. Since
          service is cumulative, you can add additional rows to account for any
          breaks in service. Enter each group of continuous years on separate
          lines.
        </p>
        <p>For example:</p>
        <ul>
          <li>
            If you have been working with no breaks in service since 2008, enter
            “2008” as your start year and the current calendar year as your end
            year.
          </li>
          <li>
            If you worked from 2008 to 2010, had a two year break in service and
            then resumed service in 2012, enter “2008” as the start year and
            “2010” as the end year. Then add another row and enter “2012” as the
            start year and current calendar year as the end year.
          </li>
        </ul>
        <p>
          Note: If an end year is not set, the calculator will use the start
          year as the end year. If the start year is later than the end year,
          the row will be calculated as 0 years.
        </p>
      </Dialog>
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <div className="service-calculator-fields">
                <div className="start-date-column">
                  <label htmlFor="startYear">Start Year</label>
                  <span className="p-float-label">
                    <Controller
                      name={`serviceCalculator.${index}.startYear`}
                      control={control}
                      render={({ field }) => (
                        <Calendar
                          minDate={new Date(1930, 0, 0, 0, 0, 0, 0)}
                          maxDate={new Date()}
                          readOnlyInput
                          id={field.name}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.value);
                            YearCalculator(index);
                          }}
                          view="year"
                          dateFormat="yy"
                          mask="9999"
                          showIcon
                        />
                      )}
                    />
                  </span>
                </div>
                <div className="end-date-column">
                  <label htmlFor="endYear">End Year</label>
                  <span className="p-float-label">
                    <Controller
                      name={`serviceCalculator.${index}.endYear`}
                      control={control}
                      render={({ field }) => (
                        <Calendar
                          minDate={new Date(1930, 0, 0, 0, 0, 0, 0)}
                          maxDate={new Date()}
                          readOnlyInput
                          id={field.name}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.value);
                            YearCalculator(index);
                          }}
                          view="year"
                          dateFormat="yy"
                          mask="9999"
                          showIcon
                        />
                      )}
                    />
                  </span>
                </div>
                <div className="year-calculation-column">
                  <label htmlFor="yearCalculation">Years of Service:</label>
                  <span className="p-float-label">
                    <Controller
                      name={`serviceCalculator.${index}.years`}
                      control={control}
                      render={({ field }) => (
                        <InputText
                          readOnly
                          id={field.name}
                          value={field.value}
                          placeholder="0"
                        />
                      )}
                    />
                  </span>
                </div>
                <div className="service-calculator-delete-column">
                  {index !== 0 ? (
                    <AppButton
                      className="service-years-delete-row-button"
                      passClass="p-button-raised p-button-rounded"
                      icon="pi pi-times-circle"
                      danger
                      onClick={() => remove(index)}
                    >
                      Delete
                    </AppButton>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
        <li className="add-service-row-button">
          <AppButton
            secondary
            icon="pi pi-plus-circle"
            onClick={(e) => {
              e.preventDefault();
              append({ startYear: "", endYear: "", years: "" });
            }}
          >
            Add Row
          </AppButton>
        </li>
        <li className="service-calculator-reset">
          <AppButton
            danger
            onClick={(e) => {
              e.preventDefault();
              reset({
                serviceCalculator: [{ startYear: "", endYear: "", years: "" }],
              });
            }}
          >
            Reset Calculator
          </AppButton>
        </li>
      </ul>
      <section className="years-of-service-calculator-final">
        <div className="total-years-counter">
          <span>
            Total Years: <TotalYears key="total-count" {...{ control }} />
          </span>
          <InfoToolTip
            target="total-years-counter"
            content="Total Years count may differ from years of service per row, as duplicated years are only counted once."
          />
        </div>
        <AppButton onClick={handleSubmit(onSubmit)}>
          Submit Years of Service Calculation
        </AppButton>
      </section>
    </div>
  );
}
