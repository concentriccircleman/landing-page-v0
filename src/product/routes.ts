export interface AppRoute {
  path: string;
  name: string;
  auth: boolean;
  flow: string;
}

export const routes: AppRoute[] = [
  { path: "/login", name: "Login", auth: false, flow: "auth" },
  { path: "/signup", name: "Sign Up", auth: false, flow: "auth" },
  { path: "/create-account", name: "Create Account", auth: false, flow: "auth" },
  { path: "/signup-success", name: "Sign Up Success", auth: false, flow: "auth" },
  { path: "/forgot-password", name: "Forgot Password", auth: false, flow: "auth" },
  { path: "/reset-password", name: "Reset Password", auth: false, flow: "auth" },
  { path: "/employee-onboarding", name: "Employee Onboarding", auth: true, flow: "onboarding" },
  { path: "/meeting/:id", name: "Meeting Details", auth: true, flow: "meetings" },
  { path: "/meeting-memory", name: "Meeting Memory", auth: true, flow: "meetings" },
  { path: "/meeting-room", name: "Meeting Room", auth: true, flow: "meetings" },
  { path: "/voice-meeting", name: "Voice Meeting Room", auth: true, flow: "meetings" },
  { path: "/report/:id", name: "Public Report View", auth: false, flow: "reports" },
  { path: "/app/memory", name: "Memory", auth: true, flow: "app" },
  { path: "/app/weekly-reports", name: "Weekly Reports", auth: true, flow: "app" },
  { path: "/app/risk-radar", name: "Risk Radar", auth: true, flow: "app" },
  { path: "/app/meeting-notes", name: "Meeting Notes", auth: true, flow: "app" },
  { path: "/app/deep-research", name: "Deep Research", auth: true, flow: "app" },
  { path: "/app/apps", name: "Apps", auth: true, flow: "app" },
  { path: "/app/todos", name: "Todos", auth: true, flow: "app" },
  { path: "/app/settings", name: "Settings", auth: true, flow: "app" },
];
