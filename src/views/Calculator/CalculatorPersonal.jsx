import React, { useState } from "react";
import { useNavigate } from "react-router";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import ServiceCalculator from "../../components/inputs/ServiceCalculator";
import "./CalculatorPersonal.css";

/**
 * Personal Calculator Page. Allows individuals to calculate eligibility.
 * Carries forward eligibility calculation into application if they choose to apply.
 */

export default function CalculatorPersonal() {
  const [eligibility, setEligibility] = useState(false);
  const [years, setYears] = useState("");

  const navigate = useNavigate();
  const startRegistration = () => {
    navigate("/register/self", { state: { years } });
  };

  const isEligible = (totalYears) => {
    if (totalYears >= 5) {
      setEligibility(true);
      setYears(totalYears);
    } else {
      setEligibility(false);
    }
  };

  return (
    <>
      <AppPanel
        fullwidth
        header={
          <PageHeader
            title="Years of Service"
            singleLine
            gradient3
          ></PageHeader>
        }
      >
        <ServiceCalculator formSubmit={isEligible} />
      </AppPanel>

      {eligibility ? (
        <AppPanel
          fullwidth
          header={
            <PageHeader
              title="Congratulations"
              singleLine
              gradient3
            ></PageHeader>
          }
        >
          Based on the input in the calculator above, you may be eligible for
          registration for recognition under the Service Pin program. You can
          continue registration by clicking on “Register” below.{" "}
          <AppButton onClick={startRegistration}>Register</AppButton>
        </AppPanel>
      ) : null}
    </>
  );
}
