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
const sidebar = (adminInfo) => {
  // List of admin emails that should see the admin menu
  const adminEmails = [
    'david.carlino20+admin@gmail.com',
    'chetan_admin@gmail.com'
  ];

  const isAdmin = adminEmails.includes(adminInfo?.email);

  const sidebarItems = [
    {
      path: "/dashboard",
      icon: FiGrid,
      name: "Dashboard",
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
      path: "/company-dashboard",
      icon: FiUser,
      name: "Company Dashboard",
    },
    {
      path: "/settings?settingTab=common-settings",
      icon: FiSettings,
      name: "Settings",
    },
  ];

  // Only add admin menu if user has admin email
  if (isAdmin) {
    sidebarItems.push({
      icon: FiSlack,
      name: "Tech Admin",
      routes: [
        {
          path: "/admin/all-users",
          name: "All Users",
        },
      ],
    });
  }

  return sidebarItems;
};

export default sidebar;
