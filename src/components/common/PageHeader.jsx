import { Card } from "primereact/card";
import classNames from "classnames";
import "./PageHeader.css";

/**
 * Page Header custom component card block
 * @param {object} props
 * @param {boolean} props.singleLine state variable boolean for controlling if header should only be one line
 * @param {boolean} props.gradient1 state variable boolean for style type
 * @param {boolean} props.gradient2 state variable boolean for style type
 * @param {boolean} props.gradient3 state variable boolean for style type
 * @param {string} props.title the title for the page header
 * @param {string} props.subtitle the subtitle for the page header
 * @param {string} props.header the header for the page header
 * @param {string} props.footer the footer for the page header
 * @param {string} props.children the content of the page header
 * @returns
 */

export default function PageHeader(props) {
  const pageHeaderClass = classNames(
    "page-header-card",
    { "page-header-single-line": props.singleLine },
    { "page-header-gradient-1": props.gradient1 },
    { "page-header-gradient-2": props.gradient2 },
    { "page-header-gradient-3": props.gradient3 }
  );

  return (
    <div>
      <Card
        className={pageHeaderClass}
        title={props.title}
        subTitle={props.subtitle}
        header={props.header}
        footer={props.footer}
      >
        {props.children}
      </Card>
    </div>
  );
}
