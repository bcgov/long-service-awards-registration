import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import formServices from "../../services/settings.services";
import "./DataDisplay.css";

/**
 * Data Display common display component to display user data after input/submission
 * @param {object} props
 * @param {object} props.data object of data to display in data table
 * @param {string} props.identifier if object contains nested array, the string name identifier for that array
 * @param {string} props.category determines the formfield options that should be selected (options: contact, address, milestone, award, lsa, delegated)
 * @param {boolean} props.stacked boolean that determines if data table will be forced into permanent stacked layout, or will be responsive
 * @returns
 */

export default function DataDisplay(props) {
  const formField = `${props.category}FormFields`;
  const columns = props.category ? formServices.get(formField) : [];

  const ministryOrgLookup = (rowData) => {
    return rowData.organization
      ? formServices.lookup("organizations", rowData.organization) ||
          formServices.lookup(
            "currentPinsOnlyOrganizations",
            rowData.organization
          )
      : null;
  };

  const dynamicColumns = columns.map((col, i) => {
   const columnClass = `${col.header
     .replace(/\s+/g, "-")
     .replace(/\//g, "")
     .toLowerCase()}-column`;
    if (col.field === "organization") {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={ministryOrgLookup}
          className={columnClass}
        />
      );
    } else if (col.body) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          body={col.body}
          className={columnClass}
        />
      );
    } else {     
          return <Column key={col.field} field={col.field} header={col.header} className={columnClass} />;
    }
  });

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const userData = props.identifier
      ? [...props.data[props.identifier]]
      : [...props.data];
    setUserData(userData);
  }, [props.data]);

  return (
    <div>
      <div className="card">
        <DataTable
          value={userData}
          responsiveLayout="stack"
          breakpoint={props.stacked ? "100vw" : "1240px"}
        >
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
}
