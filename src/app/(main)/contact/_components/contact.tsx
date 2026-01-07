"use client";

import { useState } from "react";

interface ContactSalesFormValues {
  fullName: string;
  workEmail: string;
  company: string;
  role: string;
  message: string;
}

const SALES_EMAIL_ADDRESS = "contact@sentra.app";

const Contact = () => {
  const [formValues, setFormValues] = useState<ContactSalesFormValues>({
    fullName: "",
    workEmail: "",
    company: "",
    role: "",
    message: "",
  });
  const [didAttemptSubmit, setDidAttemptSubmit] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = "Contact Sales — Sentra";
    const body = [
      `Name: ${formValues.fullName}`,
      `Work email: ${formValues.workEmail}`,
      `Company: ${formValues.company}`,
      formValues.role ? `Role: ${formValues.role}` : null,
      "",
      formValues.message ? formValues.message : "(No additional context provided.)",
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n");

    const mailtoUrl = `mailto:${SALES_EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setDidAttemptSubmit(true);
  };

  return (
    <div className="w-full px-4">
      <div className="border border-foreground/15 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 md:p-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground">
              Contact Sales
            </h2>
            <p className="text-base md:text-lg text-foreground/70">
              Tell us a bit about your team and what you&apos;re trying to accomplish. We&apos;ll follow up quickly.
            </p>
            <div className="text-sm text-foreground/70">
              Prefer email?{" "}
              <a
                className="text-foreground underline hover:no-underline"
                href={`mailto:${SALES_EMAIL_ADDRESS}?subject=${encodeURIComponent("Contact Sales — Sentra")}`}
              >
                {SALES_EMAIL_ADDRESS}
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-foreground/80">Full name</span>
              <input
                name="fullName"
                value={formValues.fullName}
                onChange={(event) => setFormValues({ ...formValues, fullName: event.target.value })}
                className="w-full bg-background text-foreground border border-foreground/20 px-4 py-3 text-sm focus:outline-none focus:border-foreground/60"
                autoComplete="name"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-foreground/80">Work email</span>
              <input
                name="workEmail"
                value={formValues.workEmail}
                onChange={(event) => setFormValues({ ...formValues, workEmail: event.target.value })}
                className="w-full bg-background text-foreground border border-foreground/20 px-4 py-3 text-sm focus:outline-none focus:border-foreground/60"
                autoComplete="email"
                type="email"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-foreground/80">Company</span>
              <input
                name="company"
                value={formValues.company}
                onChange={(event) => setFormValues({ ...formValues, company: event.target.value })}
                className="w-full bg-background text-foreground border border-foreground/20 px-4 py-3 text-sm focus:outline-none focus:border-foreground/60"
                autoComplete="organization"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-foreground/80">Role (optional)</span>
              <input
                name="role"
                value={formValues.role}
                onChange={(event) => setFormValues({ ...formValues, role: event.target.value })}
                className="w-full bg-background text-foreground border border-foreground/20 px-4 py-3 text-sm focus:outline-none focus:border-foreground/60"
                autoComplete="organization-title"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-foreground/80">What are you looking for?</span>
              <textarea
                name="message"
                value={formValues.message}
                onChange={(event) => setFormValues({ ...formValues, message: event.target.value })}
                className="w-full min-h-32 bg-background text-foreground border border-foreground/20 px-4 py-3 text-sm focus:outline-none focus:border-foreground/60 resize-y"
                placeholder="Example: We want a system that captures decisions across meetings and Slack, and makes them searchable for new hires."
              />
            </label>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="inline-flex justify-center items-center bg-foreground text-background px-6 py-3 text-sm font-medium hover:brightness-110 active:scale-95 duration-200"
              >
                Contact Sales
              </button>
              {didAttemptSubmit && (
                <p className="text-xs text-foreground/60">
                  If your email client didn&apos;t open, email{" "}
                  <a
                    className="text-foreground underline hover:no-underline"
                    href={`mailto:${SALES_EMAIL_ADDRESS}?subject=${encodeURIComponent("Contact Sales — Sentra")}`}
                  >
                    {SALES_EMAIL_ADDRESS}
                  </a>
                  .
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
