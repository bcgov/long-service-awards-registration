/*!
 * API services (React)
 * File: api.services.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import axios from "axios";
import temp from "./temp.json";

const api = axios.create({
  baseURL: import.meta.env.LSA_APPS_API_URL,
  headers: {
    "Content-Type": "application/json",
    dataType: "json",
  },
  withCredentials: true,
});

export default api;

export async function getUserData() {
  return {
    id: "512350",
    username: "testing",
    idir: "BBEST",
  };
}

export async function getRegistrationData(userData) {
  if (userData.idir === "BBEST") {
    return temp;
  } else {
    return {};
  }
}

export async function getPecsfData(userData) {
  if (userData.idir === "BBEST") {
    return temp;
  } else {
    return {};
  }
}

export async function getAvailableAwards(milestone) {
  //testing options, to make actual api call later
  const index = `options${milestone}`;
  const allOptions = {
    options25: [
      {
        id: 1002,
        vendor: "zz21cz3c1",
        label: "Blue Band",
        description: "Product Description",
        image_url: "https://picsum.photos/200",
        options: [],
      },
      {
        id: 1000,
        vendor: "f230fh0g3",
        label: "PECSF Donation",
        description: "PECSF Donation Options",
        image_url: "https://picsum.photos/200",
        options: [
          {
            id: "",
            type: "radio",
            name: "donation-choice",
            required: true,
            value: "",
            description: "Please select type donation",
            customizable: false,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "firstcharity",
            required: true,
            value: "",
            description: "Select charity.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "secondcharity",
            required: true,
            value: "",
            description: "Select charity.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "firstregion",
            required: true,
            value: "",
            description: "Select region.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "dropdown",
            name: "secondregion",
            required: true,
            value: "",
            description: "Select charity.",
            customizable: true,
            options: [],
          },
          {
            id: "",
            type: "text",
            name: "donation-certificate",
            required: true,
            value: "",
            description: "What would you like your certificate to say?",
            customizable: true,
          },
        ],
      },
      {
        id: 1001,
        vendor: "nvklal433",
        label: "Whale Tail Painting",
        description: "Whale Tail Painting",
        image_url: "https://picsum.photos/200",
        options: [
          {
            id: "",
            type: "text",
            name: "inscription",
            required: true,
            value: "",
            description: "What would you like the inscription to say.",
            customizable: true,
          },
          {
            id: "",
            type: "dropdown",
            name: "paintingtype",
            required: true,
            value: "",
            description: "Select type of painting.",
            customizable: true,
            options: ["oil", "watercolour"],
          },
          {
            id: "",
            type: "multiselect",
            name: "paintingtools",
            required: true,
            value: "",
            description: "Select tools used in painting.",
            customizable: false,
            options: ["fork", "brush", "spoon"],
          },
          {
            id: "",
            type: "radio",
            name: "whaletype",
            required: true,
            value: "",
            description: "Please select type of whale",
            customizable: false,
            options: ["orca", "grey"],
          },
        ],
      },
    ],
    options30: [
      {
        id: 1001,
        vendor: "nvklal433",
        label: "Whale Tail Painting",
        description: "Whale Tail Painting",
        image_url: "https://picsum.photos/200",
        options: [
          {
            id: "",
            type: "text",
            name: "inscription",
            required: true,
            value: "",
            description: "What would you like the inscription to say.",
            customizable: true,
          },
          {
            id: "",
            type: "dropdown",
            name: "paintingtype",
            required: true,
            value: "",
            description: "Select type of painting.",
            customizable: true,
            options: ["oil", "watercolour"],
          },
          {
            id: "",
            type: "multiselect",
            name: "paintingtools",
            required: true,
            value: "",
            description: "Select tools used in painting.",
            customizable: false,
            options: ["fork", "brush", "spoon"],
          },
          {
            id: "",
            type: "radio",
            name: "whaletype",
            required: true,
            value: "",
            description: "Please select type of whale",
            customizable: false,
            options: ["orca", "grey"],
          },
        ],
      },
      {
        id: 1002,
        vendor: "zz21cz3c1",
        label: "Blue Band",
        description: "Product Description",
        image_url: "https://picsum.photos/200",
        options: [],
      },
      {
        id: 1003,
        vendor: "244wgerg2",
        label: "Blue T-Shirt",
        description: "Product Description",
        image_url: "https://picsum.photos/200",
        options: [],
      },
    ],
  };

  return milestone ? allOptions[index] : [];
}
