import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCompass,
  FiSettings,
  FiSlack,
  FiGlobe,
  FiTarget,
  FiMapPin,
} from "react-icons/fi";

/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const sidebar = [
  {
    path: "/dashboard", // the url
    icon: FiGrid, // icon
    name: "Dashboard", // name that appear in Sidebar
  },

  

  {
    path: "/leads",
    icon: FiUsers,
    name: "My Leads",
  },
  {
    path: "/event",
    icon: FiCompass,
    name: "My Events",
  },

  {
    path: "/venue",
    icon: FiMapPin,
    name: "Venues",
  },

  {
    path: "/our-staff",
    icon: FiUser,
    name: "Staff",
  },

  {
    path: "/settings?settingTab=common-settings",
    icon: FiSettings,
    name: "Settings",
  },

  {
    icon: FiSlack,
    name: "Tech Admin",
    routes: [
      {
        path: "/admin/all-users",
       
        name: "All Users",
      },
    ],
  },



];

export default sidebar;
