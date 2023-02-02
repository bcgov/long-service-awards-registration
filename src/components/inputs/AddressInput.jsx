import React, { useEffect, useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import AddressAutoComplete from "../../services/AddressAutoComplete";
import getFormErrorMessage from "../../services/helpers/ErrorMessage";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";
import formServices from "../../services/settings.services";
import "./AddressInput.css";

/**
 * Address Input reusable component. Conditional PO Box requirement for address's identified for supervisors.
 * @param {object} props
 * @param {object} props.errors inherited errors object from form control
 * @param {boolean} props.manualComplete state variable boolean for controlling if autocomplete is used
 * @param {boolean} props.pobox state variable boolean for controlling P.O. Box field required
 * @param {boolean} props.province state variable boolean for controlling province field required
 * @param {string} props.addressIdentifier string describing what field this address belongs to ex: Supervisor, Office, Personal
 * @param {string} props.contactType string describing contact to apply address details to in form, ex: contact / supervisor
 * @returns address line 1, address line 2, city/community, province/state, postal code, po box
 */

export default function AddressInput({
  manualComplete,
  pobox,
  province,
  addressIdentifier,
  errors,
  contactType,
}) {
  const address = useRef();
  const methods = useFormContext();
  const [poBoxField, setPoBoxField] = useState(false);
  let autoCompleteBody = "";
  const addressAutoComplete = AddressAutoComplete();
  const addressGroupName = addressIdentifier
    ? formServices.capitalize(addressIdentifier)
    : "default";

  const formGroupAddress = `${contactType}.${addressIdentifier}_address.`;

  const { setFocus, setValue, getValues, control } = methods;

  const handleAddressSelect = async () => {
    let fullAddressObject = await addressAutoComplete.getAddressDetails(
      autoCompleteBody
    );
    address.current.value = fullAddressObject.streetAddress;
    setValue(`${formGroupAddress}street1`, fullAddressObject.streetAddress);
    setValue(`${formGroupAddress}community`, fullAddressObject.cityCommunity);
    province &&
      setValue(
        `${formGroupAddress}province`,
        fullAddressObject.provinceStateLong
      );
    setPoBoxField(getValues(`${formGroupAddress}community`).match(/Victoria/i));
    setValue(`${formGroupAddress}country`, fullAddressObject.countryLong);
    setValue(`${formGroupAddress}postal_code`, fullAddressObject.postalCode);
    setFocus(`${formGroupAddress}street2`);
  };

  useEffect(() => {
    if (!manualComplete) {
      async function googlePlacesAutocomplete() {
        autoCompleteBody = await addressAutoComplete.initializeAutoComplete(
          address.current,
          handleAddressSelect
        );
      }
      googlePlacesAutocomplete();
    }
  }, []);

  useEffect(() => {
    getValues(`${addressIdentifier}citycommunity`)
      ? setPoBoxField(
          getValues(`${addressIdentifier}citycommunity`).match(/Victoria/i)
        )
      : null;
  }, [addressIdentifier]);

  const enforceFormatting =
    addressIdentifier === "supervisor" || addressIdentifier === "office";

  return (
    <div className="container">
      <div className="address-container">
        <div className="address-form-field-container">
          <label htmlFor={`${formGroupAddress}street1`} className="block">
            {`${addressGroupName} Street Address 1`}
          </label>
          <Controller
            name={`${formGroupAddress}street1`}
            control={control}
            rules={{ required: "Error: Street address is required." }}
            render={({ field: { ref, ...field }, fieldState }) => (
              <InputText
                id={`${field.name}`}
                ref={address}
                aria-describedby={`${formGroupAddress}-street1-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="123 W Street Rd"
              />
            )}
          />
          {getFormErrorMessage(
            `${formGroupAddress}street1`,
            errors,
            contactType,
            `${addressIdentifier}_address`,
            "street1"
          )}
        </div>
        <div className="address-form-field-container">
          <label htmlFor={`${formGroupAddress}street2`} className="block">
            {`${addressGroupName} Street Address 2`}
          </label>
          <Controller
            name={`${formGroupAddress}street2`}
            control={control}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${formGroupAddress}-street2-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="Suite 123"
              />
            )}
          />
          {getFormErrorMessage(
            `${formGroupAddress}street2`,
            errors,
            contactType,
            `${addressIdentifier}_address`,
            "street2"
          )}
        </div>
        <div className="address-form-field-container">
          <label htmlFor={`${formGroupAddress}community`} className="block">
            {`${addressGroupName} City/Community`}
          </label>
          <Controller
            name={`${formGroupAddress}community`}
            control={control}
            rules={{ required: "Error: City/Community is required." }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${formGroupAddress}-community-help`}
                onBlurCapture={() => {
                  setPoBoxField(
                    getValues(`${formGroupAddress}community`).match(/Victoria/i)
                  );
                }}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="Victoria"
              />
            )}
          />
          {getFormErrorMessage(
            `${formGroupAddress}community`,
            errors,
            contactType,
            `${addressIdentifier}_address`,
            "community"
          )}
        </div>
        {province ? (
          <div className="address-form-field-container">
            <label htmlFor={`${formGroupAddress}province`} className="block">
              {`${addressGroupName} Province/State`}
            </label>
            <Controller
              name={`${formGroupAddress}province`}
              control={control}
              rules={{ required: "Error: Province/State is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={`${field.name}`}
                  aria-describedby={`${formGroupAddress}-province-help`}
                  {...field}
                  className={classNames("form-field block", {
                    "p-invalid": fieldState.error,
                  })}
                  placeholder="BC"
                />
              )}
            />
            {getFormErrorMessage(
              `${formGroupAddress}province`,
              errors,
              contactType,
              `${addressIdentifier}_address`,
              "province"
            )}
          </div>
        ) : null}
        <div className="address-form-field-container">
          <label htmlFor={`${formGroupAddress}postal_code`} className="block">
            {`${addressGroupName} Postal Code`}
          </label>
          <Controller
            name={`${formGroupAddress}postal_code`}
            control={control}
            rules={{
              required: "Error: Postal Code is required.",
              pattern: {
                value: enforceFormatting
                  ? /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i
                  : null,
                message: "Invalid postal code. E.g. A0A 0A0",
              },
            }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${formGroupAddress}-postal_code-help`}
                {...field}
                className={classNames("form-field block", "short-form-field", {
                  "p-invalid": fieldState.error,
                })}
                placeholder="A0A 0A0"
              />
            )}
          />
          {getFormErrorMessage(
            `${formGroupAddress}postal_code`,
            errors,
            contactType,
            `${addressIdentifier}_address`,
            "postal_code"
          )}
        </div>
      </div>

      {pobox && formGroupAddress.match(/supervisor/i) ? (
        <div className="address-form-field-container">
          <label htmlFor={`${formGroupAddress}pobox`} className="block">
            {`${addressGroupName} P.O. Box`}
          </label>
          <Controller
            name={`${formGroupAddress}pobox`}
            control={control}
            rules={{
              required: poBoxField,
            }}
            render={({ field, fieldState }) => (
              <InputText
                id={`${field.name}`}
                aria-describedby={`${formGroupAddress}-pobox-help`}
                {...field}
                className={classNames("form-field block", {
                  "p-invalid": fieldState.error,
                })}
                placeholder={`${addressGroupName} P.O. Box number`}
              />
            )}
          />
          {getFormErrorMessage(
            `${formGroupAddress}pobox`,
            errors,
            contactType,
            `${addressIdentifier}_address`,
            "pobox"
          ) ? (
            <small
              id={`pobox-${addressGroupName}-help`}
              className="validation-error p-error block"
            >
              P.O. Box is required for Victoria addresses. Please use the BC
              Government{" "}
              <a target="_blank" href="https://govposearch.pss.gov.bc.ca/">
                P.O. Box Lookup tool
              </a>{" "}
              to find the appropriate P.O. Box number.
            </small>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
