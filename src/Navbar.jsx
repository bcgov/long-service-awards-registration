import React, { useRef, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "primereact/menu";
import "./Navbar.css";
import AppButton from "./components/common/AppButton";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const dropdown = useRef(null);
  const { user } = useContext(UserContext);

  //Update navbar items based on screen width
  const adaptiveWidth = 770;
  const [screenSize, setScreenSize] = useState(
    window.innerWidth > adaptiveWidth
  );

  const updateNavItems = () => {
    setScreenSize(window.innerWidth > adaptiveWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateNavItems);
    return () => window.removeEventListener("resize", updateNavItems);
  });

  const pages = [
    {
      label: "Self-Registration",
      items: [
        {
          label: "Registration Start",
          template: () => {
            return (
              <Link to="/register/profile" className="p-menuitem-link">
                Registration Start
              </Link>
            );
          },
        },
        {
          label: "Milestones",
          template: () => {
            return (
              <Link to="/register/milestone" className="p-menuitem-link">
                Milestone Selection
              </Link>
            );
          },
        },
        {
          label: "Profile Details",
          template: () => {
            return (
              <Link to="/register/details" className="p-menuitem-link">
                Personal Profile Details
              </Link>
            );
          },
        },
        {
          label: "LSA Attendance",
          template: () => {
            return (
              <Link to="/register/attendance" className="p-menuitem-link">
                LSA Attendance Details
              </Link>
            );
          },
        },
        {
          label: "Award Selection",
          template: () => {
            return (
              <Link to="/register/award" className="p-menuitem-link">
                Award Selection
              </Link>
            );
          },
        },
        {
          label: "Supervisor Details",
          template: () => {
            return (
              <Link to="/register/supervisor" className="p-menuitem-link">
                Supervisor Details
              </Link>
            );
          },
        },
        {
          label: "Registration Confirmation",
          template: () => {
            return (
              <Link to="/register/confirmation" className="p-menuitem-link">
                Registration Confirmation
              </Link>
            );
          },
        },
      ],
    },
  ];

  const mobilePages = [
    {
      label: "Registration Start",
      template: () => {
        return (
          <a
            href="https://longserviceawards.gww.gov.bc.ca/"
            target={"_blank"}
            className="p-menuitem-link"
          >
            About
          </a>
        );
      },
    },
    {
      label: "Registration Start",
      template: () => {
        return (
          <Link to="/calculator" className="p-menuitem-link">
            Service Calculator
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <nav className="navbar">
        <ul>
          <div>
            <li className="service-awards-logo">
              <Link to="/">LONG SERVICE AWARDS</Link>
            </li>
            <li className="navigation-item">
              <Link to="/">Home</Link>
            </li>
            <li className="navigation-item">
              <a
                href="https://longserviceawards.gww.gov.bc.ca/"
                target={"_blank"}
              >
                About
              </a>
            </li>
            <li className="navigation-item">
              <Link to="/calculator">Service Calculator</Link>
            </li>
          </div>
          <div>
            <li style={{ float: "right !important" }}>
              <Menu
                model={screenSize ? pages : mobilePages.concat(pages)}
                popup
                ref={dropdown}
                id="navbar-dropdown"
              />
              <AppButton
                icon={!screenSize ? "pi pi-bars" : ""}
                onClick={(event) => dropdown.current.toggle(event)}
                aria-controls="navbar-dropdown"
                aria-haspopup
              >
                {user ? user.idir : "IDIR"}
              </AppButton>
            </li>
          </div>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
