import React, { useEffect, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import classNames from "classnames";
import AppButton from "./AppButton";
import "./GalleryDisplay.css";
import logo from "../../assets/bclogo.jpg";

/**
 * Gallery Display common display component to display items in list with details
 * @param {object} props
 * @param {Array} props.itemSet Array of objects to display in gallery view
 * @param {Array} props.chosenAward Identifying string of chosen item
 * @returns
 */

export default function GalleryDisplay(props) {
  const [layout, setLayout] = useState("grid");
  const [items, setItems] = useState([]);
  const [chosenItem, setChosenItem] = useState("");

  useEffect(() => {
    setItems(props.itemSet);
  }, [props.itemSet]);

  useEffect(() => {
    setChosenItem(props.chosenAward);
  }, [props.chosenAward]);

  const renderListItem = (data) => {
    return (
      <div>
        <div className="item-list-item">
          <img
            src={`${import.meta.env.LSA_REGISTRATION_APP_URL}${data.image_url}`}
            onError={(e) => (e.target.src = logo)}
            alt={data.label}
          />
          <div className="item-list-detail">
            <div className="item-name">{data.label}</div>
          </div>
          <div className="item-list-action">
            <AppButton
              secondary
              info={data.id === chosenItem}
              onClick={(e) => {
                e.preventDefault();
                props.onClick(data.id);
              }}
            >
              {data.id === chosenItem ? "Selected" : "View"}
            </AppButton>
          </div>
        </div>
      </div>
    );
  };

  const renderGridItem = (data) => {
    return (
      <div>
        <div className="item-grid-item card">
          <div className="item-grid-item-content">
            <img
              src={`${import.meta.env.LSA_REGISTRATION_APP_URL}${
                data.image_url
              }`}
              onError={(e) => (e.target.src = logo)}
              alt={data.label}
            />
            <div className="item-name">{data.label}</div>
          </div>
          <div className="item-grid-item-bottom">
            <AppButton
              secondary
              info={data.id === chosenItem}
              onClick={(e) => {
                e.preventDefault();
                props.onClick(data.id);
              }}
            >
              {data.id === chosenItem ? "Selected" : "View"}
            </AppButton>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (item, layout) => {
    if (!item) {
      return;
    }

    if (layout === "list") return renderListItem(item);
    else if (layout === "grid") return renderGridItem(item);
  };

  const renderHeader = () => {
    return (
      <div className="gallery-display-header">
        <div style={{ textAlign: "left" }}>
          {props.header ? props.header : ""}
        </div>
        <div style={{ textAlign: "right" }}>
          <DataViewLayoutOptions
            layout={layout}
            onChange={(e) => setLayout(e.value)}
          />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div
      className={classNames(
        "gallery-display-items",
        { "grid-view-dataview": layout === "grid" },
        { "list-view-dataview": layout === "list" }
      )}
    >
      <div className="card">
        <DataView
          value={items}
          layout={layout}
          header={header}
          itemTemplate={itemTemplate}
          paginator
          rows={9}
        />
      </div>
    </div>
  );
}
