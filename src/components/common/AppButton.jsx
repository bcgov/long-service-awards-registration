import { Button } from "primereact/button";
import classNames from "classnames";
import "./AppButton.css";

/**
 * common button component with custom styling
 * @param {object} props
 * @param {boolean} props.secondary state variable boolean for controling toggleable functionality
 * @param {boolean} props.info state variable boolean for controlling initial collapsed status
 * @param {boolean} props.danger the title that should be placed in the header of the panel
 * @param {string} props.passClass additional classes to pass to the button
 * @param {string} props.iconPosition the position of an icon if selected
 * @param {string} props.icon the icon to use on the button
 * @param {() => void} props.onClick callback to state function on click of button
 * @param {boolean} props.disabled state variable boolean for controlling disabled button status
 * @param {boolean} props.tooltip optional tooltip for a button
 * @param {boolean} props.tooltipOptions optional tooltip options for a button
 * @param {string} props.children the label for the button. Leave blank if only icon desired
 * @returns
 */

export default function AppButton(props) {
  const buttonClass = classNames(
    "p-button-raised",
    props.passClass,
    { "p-button-secondary": props.secondary },
    { "p-button-info": props.info },
    { "p-button-danger": props.danger }
  );

  const iconPos = props.iconPosition ? props.iconPosition : "right";
  const icons = props.icon ? props.icon : "null";

  return (
    <Button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
      label={props.children}
      icon={icons}
      iconPos={iconPos}
      tooltip={props.tooltip}
      tooltipOptions={props.tooltipOptions}
    ></Button>
  );
}
