import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

import classNames from "classnames";

/**
 * Common Award Options Component.
 * @param {object} props
 * @param {object} props.option Award option object
 * @returns variable award options for text, radio buttons, multiselect, and dropdown
 */

export default function AwardForm({ option, errors }) {
  const type = option.type;

  const methods = useFormContext();
  const { control, register } = methods;

  const renderRadioButtons = (data) => {
    const radioOptions = data.options ? data.options : [];
    const optionName = `awards.${0}.award.award_options.${0}.${data.name}`;
    const radioMap = radioOptions.map((option, index) => (
      <div key={index}>
        <li className="award-option-block-radio">
          <input
            {...register(`${optionName}`, {
              required: {
                value: data.required,
                message: `Option selection is required`,
              },
            })}
            type="radio"
            value={option}
          />
          <label
            htmlFor={option}
            className={classNames({ "p-error": errors.optionName })}
          >
            {option}
          </label>
        </li>
      </div>
    ));

    return (
      <div>
        <ul className={`${data.label}-radio-options`}>{radioMap}</ul>
      </div>
    );
  };

  const radioDisplay = type === "radio" ? renderRadioButtons(option) : null;

  return (
    <>
      {type === "text" ? (
        <Controller
          name={`awards.${0}.award.award_options.${0}.${option.name}`}
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: option.required,
              message: `Option selection is required`,
            },
          }}
          render={({ field, fieldState }) => (
            <InputText
              id={`${field.name}`}
              value={field.value}
              aria-describedby={`${field.name}-help`}
              {...field}
              className={classNames("form-field block", {
                "p-invalid": fieldState.error,
              })}
              placeholder={`${option.description}`}
            />
          )}
        />
      ) : null}

      {type === "radio" ? <> {radioDisplay}</> : null}

      {type === "dropdown" ? (
        <Controller
          name={`awards.${0}.award.award_options.${0}.${option.name}`}
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: option.required,
              message: `Option selection is required`,
            },
          }}
          render={({ field, fieldState }) => (
            <Dropdown
              id={`${field.name}`}
              value={field.value}
              options={option.options}
              aria-describedby={`${field.name}-help`}
              {...field}
              className={classNames("form-field block", {
                "p-invalid": fieldState.error,
              })}
              placeholder={`${option.description}`}
            />
          )}
        />
      ) : null}

      {type === "multiselect" ? (
        <Controller
          name={`awards.${0}.award.award_options.${0}.${option.name}`}
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: option.required,
              message: `Option selection is required`,
            },
          }}
          render={({ field, fieldState }) => (
            <MultiSelect
              id={`${field.name}`}
              value={field.value}
              options={option.options}
              display="chip"
              aria-describedby={`${field.name}-help`}
              {...field}
              className={classNames("form-field block", {
                "p-invalid": fieldState.error,
              })}
              placeholder={`${option.description}`}
            />
          )}
        />
      ) : null}
    </>
  );
}
