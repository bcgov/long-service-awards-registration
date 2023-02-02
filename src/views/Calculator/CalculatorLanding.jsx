import React from "react";
import AppButton from "../../components/common/AppButton";
import AppPanel from "../../components/common/AppPanel";
import PageHeader from "../../components/common/PageHeader";
import { useNavigate, Outlet, useLocation } from "react-router";
import "./CalculatorLanding.css";

/**
 * Calculator Parent Page.
 * Provides outlet for personal and delegated calculations.
 */

export default function CalculatorLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const landing =
    location.pathname === "/calculator" || location.pathname === "/calculator/";
  const pageName = location.pathname.replace("/calculator/", "");

  return (
    <>
      <div className="calculator-splash">
        <PageHeader
          title="Long Service Awards and Service Pins Eligibility Calculator"
          singleLine
          gradient1
        ></PageHeader>
        {pageName !== "delegated" ? (
          <>
            <AppPanel
              header="Calculate Your Eligibility"
              toggleable
              collapsed={!landing}
            >
              <div className="information-only-panel">
                <p>
                  When calculating your eligibility, count the calendar years
                  you’ve been in service, don’t worry about the exact months and
                  days. If you have worked any portion of a calendar year, it
                  counts as one full year of long service recognition time.
                </p>
                <p>
                  This tool will help you check your total years of service. You
                  can use this calculator to enter your work history and apply
                  for your recognition awards in one easy process.
                </p>
              </div>
            </AppPanel>
            <AppPanel header="Eligible Service" toggleable collapsed={!landing}>
              <div className="information-only-panel">
                <h4>Long Service Awards</h4>
                <p>
                  You can register for the Long Service Awards if you’ve worked
                  for 25+ years in a BC Public Service organization under the BC
                  Public Service Act.
                </p>
                <p>
                  Attend a Long Service Awards ceremony every five years after
                  you’ve reached 25 years of service. If you have fewer than 25
                  years of service, you may be eligible for a Service Pin.
                </p>
                <h4>Service Pins</h4>
                <p>
                  You can register for a Service Pin if you’ve worked for 5+
                  years in a BC Public Service organization under the BC Public
                  Service Act.
                </p>
                <p>
                  Register for another Service Pin every five years after you've
                  reached 5 years of service.
                </p>
                <h4>Long Service Recognition</h4>
                <p>
                  Long service recognition time is calculated differently than
                  seniority and pensionable time. Long service time is your
                  total, cumulative years working at an eligible BC Public
                  Service organization.
                </p>
                <p>
                  Time spent working as a contractor does not count towards
                  years of service because contractors are not hired under the
                  BC Public Service Act.
                </p>
                <p>
                  If you’ve had a break in service, that time may still count
                  toward your years of service. Breaks in service include
                  periods of paid leave and part-time, auxiliary, or seasonal
                  work. Unpaid leaves of absence do not count.
                </p>
              </div>
            </AppPanel>
          </>
        ) : null}
        {pageName === "delegated" || landing ? (
          <AppPanel
            header="Delegated Calculations - Supervisors"
            toggleable
            collapsed={landing}
          >
            <div className="information-only-panel">
              <p>
                Supervisors may use this tool to calculate their employee’s
                eligibility for awards.
              </p>
              <p>
                This tool will allow you to enter your employees’ information
                and register them for their recognition awards.
              </p>
              <p>
                Employees will be registered for Service Pins automatically, and
                if eligible for a Long Service Award will be sent a link to
                complete their registration for the Long Service Awards Event
                and Award Selection.
              </p>
            </div>
          </AppPanel>
        ) : null}
        {pageName === "delegated" ? (
          <AppPanel header="Delegated Registration - Instructions" toggleable>
            <div className="information-only-panel">
              <h4>Supervisors and Other Delegates:</h4>
              <p>Enter supervisor information in the contact field below.</p>
              <p>
                Add employees under this supervisor that you wish to calculate
                and submit registration requests for. Only submit employees that
                report to the supervisor submitted. Please start a new
                registration if you have employees that work under different
                supervisors.
              </p>
              <h4>Calculating Service and Registering Employees:</h4>
              <p>
                A calculator for eligibility is provided for each employee you
                add. Alternatively, if you already know an employees total years
                of service, please enter this in the final Total Years field for
                the employee.
              </p>
              <p>
                Employees entered in this form will be instantly registered for
                eligible Service Pins. Additionally, if an employee has 25+
                years of service, they will be sent a link to complete their
                registration for the Long Service Awards Event and Award
                Selection.
              </p>
            </div>
          </AppPanel>
        ) : null}
        {landing ? (
          <>
            <AppButton info onClick={() => navigate("/calculator/delegated")}>
              Calculate Eligiblity And Register for Someone Else
            </AppButton>
            <AppButton onClick={() => navigate("/calculator/personal")}>
              Calculate My Eligibility
            </AppButton>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  );
}
