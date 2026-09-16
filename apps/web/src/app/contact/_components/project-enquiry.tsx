"use client";

import type { SubmitEvent } from "react";
import { useState } from "react";

import { ContactArrow } from "@/app/contact/_components/contact-arrow";

const PROJECT_TYPES = [
  "Website",
  "Online shop",
  "Web application",
  "Design",
  "Care & support",
  "Something else",
];

const formText = (data: FormData, name: string): string => {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
};

export const ProjectEnquiry = ({ email }: { email: string | null }) => {
  const [selectionError, setSelectionError] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [copyState, setCopyState] = useState("");
  const [brief, setBrief] = useState("");

  const prepareEnquiry = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const projects = data
      .getAll("project")
      .filter((value): value is string => typeof value === "string");

    if (projects.length === 0) {
      setSelectionError(true);
      form.querySelector<HTMLInputElement>('input[name="project"]')?.focus();
      return;
    }

    const name = formText(data, "name");
    const replyTo = formText(data, "email");
    const description = formText(data, "description");

    if (!name || !description) {
      const field = form.elements.namedItem(
        description ? "name" : "description"
      );
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.setCustomValidity("Please add a few words here.");
        field.reportValidity();
      }
      return;
    }

    const body = `Hello Helvetic Studio,\n\nI'm interested in: ${projects.join(", ")}.\n\n${description}\n\nFrom: ${name}\nEmail: ${replyTo}`;
    setBrief(body);
    setDraftReady(true);
    setCopyState("");

    if (email !== null) {
      const subject = encodeURIComponent(
        `Project enquiry — ${projects.join(", ")}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(body)}`;
    }
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("Project brief copied.");
    } catch {
      setCopyState("Select and copy the brief below.");
    }
  };

  return (
    <form
      className="contact-form"
      onSubmit={prepareEnquiry}
      onChange={() => {
        setDraftReady(false);
        setCopyState("");
      }}
    >
      <header className="contact-form-header">
        <div>
          <p className="contact-form-eyebrow">Your next chapter</p>
          <h2>Let’s make it happen.</h2>
        </div>
        <span className="contact-duration">About 2 minutes</span>
      </header>
      <fieldset className="contact-section">
        <legend>
          <span className="contact-number">01</span> What can we help you with?
        </legend>
        <p id="project-hint" className="contact-hint">
          Pick one, or a few.
        </p>
        <div
          className="contact-projects"
          aria-describedby={selectionError ? "project-error" : "project-hint"}
        >
          {PROJECT_TYPES.map((project) => (
            <label className="contact-project" key={project}>
              <input
                className="contact-project-input"
                type="checkbox"
                name="project"
                value={project}
                aria-invalid={selectionError}
                aria-describedby={
                  selectionError ? "project-error" : "project-hint"
                }
                onChange={() => {
                  setSelectionError(false);
                }}
              />
              <span className="contact-project-face">
                {project}
                <span className="contact-project-mark" aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path className="contact-project-plus" d="M8 3v10M3 8h10" />
                    <path className="contact-project-check" d="m3 8 3 3 7-7" />
                  </svg>
                </span>
              </span>
            </label>
          ))}
        </div>
        {selectionError ? (
          <p id="project-error" className="contact-error" role="alert">
            Choose a project type. “Something else” is fine, too.
          </p>
        ) : null}
      </fieldset>
      <div className="contact-section">
        <label className="contact-section-title" htmlFor="project-description">
          <span className="contact-number">02</span> A little about your idea
        </label>
        <p id="description-hint" className="contact-hint">
          The rough version is more than enough.
        </p>
        <div className="contact-input-shell">
          <textarea
            className="contact-input"
            id="project-description"
            name="description"
            required
            maxLength={1200}
            rows={4}
            aria-describedby="description-hint"
            placeholder="What are you working on, and where could we help?"
            onInput={(event) => {
              event.currentTarget.setCustomValidity("");
            }}
          />
        </div>
      </div>
      <fieldset className="contact-section contact-details-section">
        <legend>
          <span className="contact-number">03</span> And a little about you
        </legend>
        <div className="contact-fields">
          <label className="contact-field" htmlFor="contact-name">
            Your name
            <span className="contact-input-shell">
              <input
                className="contact-input"
                id="contact-name"
                name="name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Alex Taylor"
                onInput={(event) => {
                  event.currentTarget.setCustomValidity("");
                }}
              />
            </span>
          </label>
          <label className="contact-field" htmlFor="contact-email">
            Email address
            <span className="contact-input-shell">
              <input
                className="contact-input"
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="alex@company.com"
              />
            </span>
          </label>
        </div>
      </fieldset>
      <div className="contact-submit-row">
        <p>
          A starting point.
          <br className="contact-submit-break" />
          No commitment needed.
        </p>
        <button className="contact-submit" type="submit">
          {email === null ? "Prepare your enquiry" : "Create email enquiry"}
          <span>
            <ContactArrow />
          </span>
        </button>
      </div>
      <p className="contact-delivery-note">
        {email === null
          ? "Put your thoughts together in a brief you can keep."
          : "Opens your email app with your brief ready to send."}
      </p>
      {draftReady ? (
        <div className="contact-draft">
          <output>
            {email === null
              ? "Your brief is ready. Direct enquiries will open once our contact details are available."
              : "Your email draft is ready. Send it from your email app to get in touch."}
          </output>
          <details>
            <summary>View your project brief</summary>
            <pre>{brief}</pre>
          </details>
          <button
            type="button"
            onClick={() => {
              void copyBrief();
            }}
          >
            Copy project brief <span aria-hidden="true">↗</span>
          </button>
          <output>{copyState}</output>
        </div>
      ) : null}
    </form>
  );
};
