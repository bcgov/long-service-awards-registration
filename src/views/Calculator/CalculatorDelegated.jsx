import React, { useState, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { RegistrationContext, ToastContext } from "../../UserContext";
import formServices from "../../services/settings.services";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import InfoToolTip from "../../components/common/InfoToolTip";
import DataDisplay from "../../components/common/DataDisplay";
import EmployeeList from "../../components/composites/EmployeeList";
import ContactDetails from "../../components/inputs/ContactDetails";
import AddressInput from "../../components/inputs/AddressInput";
import "./CalculatorDelegated.css";

import apiRoutesRegistrations from "../../api/api-routes-registrations";

/**
 * Delegated Calculator Page. Allows users to submit delegated applications for LSA/Service Pin registration.
 */

export default function CalculatorDelegated() {
  const { registration, setRegistration } = useContext(RegistrationContext);
  const toast = useContext(ToastContext);
  const { postDelegatedRegistration } = apiRoutesRegistrations;
  const defaultValues = {
    supervisor: {
      firstname: "",
      lastname: "",
      office_email: "",
      office_phone: "",
      office_address: {
        pobox: "",
        street1: "",
        street2: "",
        postal_code: "",
        community: "",
        province: "",
        country: "",
      },
    },
    employee: [
      {
        firstname: "",
        lastname: "",
        office_email: "",
        employee_number: "",
        organization: null,
        years_of_service: "",
        milestone: "",
        qualifying_year: "",
        prior_milestones: "",
      },
    ],
  };

  const methods = useForm({ defaultValues });
  const [employeeData, setEmployeeData] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [formChanged, setFormChanged] = useState(true);

  const {
    formState: { errors },
    watch,
    handleSubmit,
  } = methods;

  watch(() => setFormChanged(true));

  const onSubmit = (data) => {
    setFormComplete(true);
    setFormChanged(false);
    const finalData = Object.assign({}, data);
    setSubmissionData(finalData);

    const employeeData = [...data.employee];
    employeeData.map((each, index) => {
      each["employee"] = each["firstname"] ? `${index + 1}` : "";
    });
    setEmployeeData(employeeData);
  };

  //Final step in creating submission - will be api call to backend to update

  const submitDelegated = async (e) => {
    e.preventDefault();
    console.log(submissionData, "this is final submission data");
    setRegistration((state) => ({ ...state, loading: true }));
    try {
      toast.current.show(formServices.lookup("messages", "submit"));
      // await postDelegatedRegistration(submissionData)
      setTimeout(() => {
        toast.current.replace(formServices.lookup("messages", "savesuccess"));
        setRegistration((state) => ({ ...state, loading: false }));
      }, 3000);
    } catch (error) {
      toast.current.replace(formServices.lookup("messages", "saveerror"));
    } finally {
      // setRegistration((state) => ({ ...state, loading: false }));
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AppPanel header="Supervisor Details">
            <ContactDetails basic panelName="supervisor" errors={errors} />
          </AppPanel>
          <AppPanel header="Supervisor Address">
            <AddressInput
              pobox
              addressIdentifier="office"
              errors={errors}
              contactType="supervisor"
            />
          </AppPanel>

          <AppPanel
            header={
              <span>
                Add Employees
                <InfoToolTip
                  target="p-panel-title"
                  content="This section allows you to add employees that you wish to calculate and submit registration requests for. Please include all information and complete fields in full. "
                />
              </span>
            }
          >
            <div className="employee-add-panel">
              <EmployeeList errors={errors} />
            </div>
            <div className="employee-add-buttons">
              <AppButton type="submit" onClick={handleSubmit(onSubmit)}>
                {!formComplete
                  ? "Finished? Check Submission."
                  : "Recheck data if updated."}
              </AppButton>
            </div>
          </AppPanel>
        </form>
      </FormProvider>
      {employeeData.length > 0 ? (
        <AppPanel
          header={
            <PageHeader
              title="Submit Registration"
              singleLine
              gradient3
            ></PageHeader>
          }
          fullwidth
        >
          <div>
            Based on the input in the calculator above, the following employees
            will receive registration confirmation emails for the CURRENT YEAR
            recognition period. If employees are eligible for previous years
            that they have not claimed, they will have the opportunity to update
            their registrations prior to submission. Please confirm that the
            information you have entered is correct prior to submission, and
            then proceed by clicking on “Submit”.
          </div>

          <DataDisplay
            category="delegated"
            data={submissionData}
            identifier="employee"
          />
          <AppButton disabled={formChanged} onClick={(e) => submitDelegated(e)}>
            {!formChanged
              ? "Submit"
              : "Data has been updated, please resubmit above to check input."}
          </AppButton>
        </AppPanel>
      ) : null}
    </>
  );
}
