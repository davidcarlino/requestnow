import { lazy } from "react";

// use lazy for better code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AdminAllUsers = lazy(() => import("@/pages/AdminAllUsers"));
const Attributes = lazy(() => import("@/pages/Attributes"));
const ChildAttributes = lazy(() => import("@/pages/ChildAttributes"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Category = lazy(() => import("@/pages/Category"));
const ChildCategory = lazy(() => import("@/pages/ChildCategory"));
const Staff = lazy(() => import("@/pages/Staff"));
const Leads = lazy(() => import("@/pages/Leads"));
const Twofactor = lazy(() => import("@/pages/twofactor"));
const CustomerOrder = lazy(() => import("@/pages/CustomerOrder"));
const Orders = lazy(() => import("@/pages/Orders"));
const MyEvents = lazy(() => import("@/pages/MyEvents"));
const MyInvoices = lazy(() => import("@/pages/MyInvoices"));
const Venues = lazy(() => import("@/pages/Venue"));
const EventDetails = lazy(() => import("@/pages/EventDetails"));
const SongRequest = lazy(() => import("@/pages/SongRequest"))
const OrderInvoice = lazy(() => import("@/pages/OrderInvoice"));
const Coupons = lazy(() => import("@/pages/Coupons"));
// const Setting = lazy(() => import("@/pages/Setting"));
const Page404 = lazy(() => import("@/pages/404"));
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const Languages = lazy(() => import("@/pages/Languages"));
const Currencies = lazy(() => import("@/pages/Currencies"));
const Setting = lazy(() => import("@/pages/Setting"));
const StoreHome = lazy(() => import("@/pages/StoreHome"));
const StoreSetting = lazy(() => import("@/pages/StoreSetting"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const CompanyDashboard = lazy(() => import("@/pages/CompanyDashboard"));
const LeadsDetails = lazy(() => import("@/pages/LeadsDetails"));
const InvoiceDetails = lazy(() => import("@/pages/InvoiceDetails"));
/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/products",
    component: Products,
  },
  {
    path: "/attributes",
    component: Attributes,
  },
  {
    path: "/attributes/:id",
    component: ChildAttributes,
  },
  {
    path: "/product/:id",
    component: ProductDetails,
  },
  {
    path: "/categories",
    component: Category,
  },
  {
    path: "/languages",
    component: Languages,
  },
  {
    path: "/currencies",
    component: Currencies,
  },

  {
    path: "/categories/:id",
    component: ChildCategory,
  },
  {
    path: "/Leads",
    component: Leads,
  },
  {
    path: "/customer-order/:id",
    component: CustomerOrder,
  },
  {
    path: "/our-staff",
    component: Staff,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/event",
    component: MyEvents,
  },
  {
    path: "/invoices",
    component: MyInvoices,
  },
  {
    path: "/venue",
    component: Venues,
  },
  {
    path: "/event/:id/dashboard",
    component: EventDetails,
  },
  {
    path: "/scan/:id",
    component: SongRequest,
  },
  {
    path: "/twofactor",
    component: Twofactor,
  },
  {
    path: "/order/:id",
    component: OrderInvoice,
  },
  {
    path: "/coupons",
    component: Coupons,
  },
  { path: "/settings", component: Setting },
  {
    path: "/store/customization",
    component: StoreHome,
  },
  {
    path: "/store/store-settings",
    component: StoreSetting,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/coming-soon",
    component: ComingSoon,
  },
  {
    path: "/edit-profile",
    component: EditProfile,
  },
  {
    path: "/notifications",
    component: Notifications,
  },
  {
    path: "/admin/all-users",
    component: AdminAllUsers,
  },
  {
    path: "/company-dashboard",
    component: CompanyDashboard,
  },
  {
    path: "/leads/:id/dashboard",
    component: LeadsDetails,
  },
  {
    path: "/event/:id/dashboard/invoice/:id",
    component: InvoiceDetails,
  },
  {
    path: "/invoices/:id/dashboard",
    component: InvoiceDetails,
  },

];

export default routes;
