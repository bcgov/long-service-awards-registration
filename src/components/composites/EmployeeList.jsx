import React, { useState, useEffect, useContext } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import ContactDetails from "../../components/inputs/ContactDetails";
import MilestoneSelector from "../../components/inputs/MilestoneSelector";
import { ToastContext } from "../../UserContext";

/**
 * Composite component builds a list of employees with user ability to increase/decrease number of employees in form
 * @param {object} props.errors inherited form errors object
 * @returns
 */

const EmployeeList = ({ errors }) => {
  const toast = useContext(ToastContext);
  const { control, reset } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employee",
  });

  const [employees, setEmployees] = useState({});
  const [employeeCount, setEmployeeCount] = useState(1);
  const [resetList, setResetList] = useState(false);

  const acceptreset = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "Form Reset",
      life: 2000,
    });
    setEmployeeCount(1);
    setResetList(!resetList);
  };

  const confirmReset = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message:
        "Are you sure you want to reset the form? This will reset all fields.",
      icon: "pi pi-exclamation-triangle",
      accept: acceptreset,
      reject: null,
    });
  };

  useEffect(() => {
    reset({
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
    });
  }, [resetList]);

  const onChange = (id, ministry) => {
    setEmployees({ ...employees, [id]: ministry });
  };

  return (
    <>
      <ul>
        {fields?.map((item, index) => {
          return (
            <li key={item.id}>
              <AppPanel
                header={
                  <div className="employee-header-bar">
                    <span className="employee-header-text">
                      Employee {index + 1}
                    </span>
                    {index !== 0 ? (
                      <AppButton
                        className="employee-add-delete-button"
                        passClass="p-button-raised p-button-rounded"
                        icon="pi pi-times-circle"
                        danger
                        onClick={(e) => {
                          e.preventDefault();
                          setEmployeeCount((state) => state - 1);
                          remove(index);
                        }}
                      ></AppButton>
                    ) : null}
                  </div>
                }
              >
                <ContactDetails
                  basic
                  delegated
                  ministryRef={onChange}
                  index={item.id}
                  panelName={`employee`}
                  itemNumber={index + 1}
                  errors={errors}
                />
                <MilestoneSelector
                  delegated
                  selfregister
                  ministry={employees[item.id]}
                  index={item.id}
                  panelName={`employee`}
                  itemNumber={index + 1}
                  errors={errors}
                />
              </AppPanel>
            </li>
          );
        })}
      </ul>
      <div className="employee-list-options">
        <AppButton
          info
          disabled={employeeCount >= 5}
          onClick={(e) => {
            e.preventDefault();
            setEmployeeCount((state) => state + 1);
            append({
              firstname: "",
              lastname: "",
              office_email: "",
              employee_number: "",
              organization: null,
              years_of_service: "",
              milestone: "",
              qualifying_year: "",
              prior_milestones: "",
            });
          }}
        >
          Add Another Employee
        </AppButton>
        <ConfirmPopup />
        <AppButton
          danger
          onClick={(e) => {
            e.preventDefault();
            confirmReset(e);
          }}
        >
          Reset Form
        </AppButton>
      </div>
    </>
  );
};

export default EmployeeList;
