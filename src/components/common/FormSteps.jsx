import React, { useEffect, useState } from "react";
import { Steps } from "primereact/steps";
import AppPanel from "./AppPanel";
import "./FormSteps.css";

/**
 * Data Display common display component to display user data after input/submission
 * @param {object} props
 * @param {object} props.data object of data to display in data table
 * @param {object} props.stepIndex current index of step in process
 * @param {string} props.identifier if object contains nested array, the string name identifier for that array
 * @param {string} props.category determines the formfield options that should be selected (options: contact, address, milestone, award, lsa, delegated)
 * @returns
 */

export default function FormSteps(props) {
  const [activeIndex, setActiveIndex] = useState(props.stepIndex || 0);
  const [stepData, setStepdata] = useState([]);
  const [screenSize, setScreenSize] = useState(window.innerWidth > 1100);

  const interactiveItems = stepData;

  const updateStepsWidth = () => {
    setScreenSize(window.innerWidth > 1100);
  };

  useEffect(() => {
    window.addEventListener("resize", updateStepsWidth);
    return () => window.removeEventListener("resize", updateStepsWidth);
  });

  useEffect(() => {
    const stepdata = props.identifier
      ? [...props.data[props.identifier]]
      : [...props.data];
    setStepdata(stepdata);
  }, [props.data]);

  useEffect(() => {
    setActiveIndex(props.stepIndex);
  }, [props.stepIndex]);

  return (
    <div>
      <div className="steps">
        <AppPanel
          header={`${props.category || ""} Progress`}
          toggleable={!screenSize}
          collapsed={!screenSize}
        >
          <Steps
            model={interactiveItems}
            activeIndex={activeIndex}
            onSelect={(e) => {
              props.onSelect ? props.onSelect() : null;
              setActiveIndex(e.index);
            }}
            readOnly={false}
          />
        </AppPanel>
      </div>
    </div>
  );
}
