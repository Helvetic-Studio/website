"use client";

import type { SubmitEvent } from "react";
import { useState } from "react";

import { ButtonIcon } from "@/app/_components/button-icon";
import { BEZEL_CORE, buttonClass, FOCUS_RING } from "@/app/_components/styles";
import { ContactArrow } from "@/app/contact/_components/contact-arrow";

const PROJECT_TYPES = [
  "Website",
  "Online shop",
  "Web application",
  "Design",
  "Care & support",
  "Something else",
];

const SECTION = "m-0 min-w-0 border-0 p-0";
const SECTION_TITLE =
  "flex items-baseline gap-3 p-0 text-[16px] font-semibold tracking-[-0.02em]";
const NUMBER = "text-[11px] font-semibold text-brand-text tabular-nums";
const HINT = "mt-1.5 mb-3.5 text-[13.5px] leading-[1.55] text-ink-muted";

/** A field sits in a tinted tray that lights up red around it while it has focus. */
const INPUT_SHELL =
  "block rounded-[16px] bg-ink/4 p-[3px] shadow-[inset_0_0_0_1px_oklch(0.2393_0_0/0.05)] transition-shadow duration-200 ease-[ease] focus-within:shadow-[inset_0_0_0_1px_oklch(0.5684_0.2129_25.98/0.35),0_0_0_4px_oklch(0.5684_0.2129_25.98/0.12)]";
// 16px on a phone, so focusing a field never zooms the page.
const INPUT =
  "box-border block w-full min-w-0 rounded-[13px] border-0 bg-white px-3.5 py-[13px] text-[15px] leading-[1.55] text-ink shadow-[0_1px_2px_oklch(0.35_0.08_30/0.06)] outline-none placeholder:text-[#7c726c] placeholder:opacity-100 max-md:text-[16px]";
const FIELD = "flex flex-col gap-2 text-[13.5px] font-medium text-ink-soft";

/**
 * A project type is a checkbox dressed as a chip. Checked, it turns red and its plus turns into a
 * tick: one crossfades out as the other draws in.
 */
const CHIP_FACE =
  "flex min-h-11 items-center gap-2.5 rounded-full bg-ink/4 py-2 pr-[9px] pl-4 text-[14px] font-medium shadow-[inset_0_0_0_1px_oklch(0.2393_0_0/0.06)] [transition:scale_160ms_var(--ease-out),background-color_200ms_ease,box-shadow_200ms_ease,color_200ms_ease] pointer-fine:group-hover/project:bg-ink/7 peer-checked:bg-brand/9 peer-checked:text-brand-text peer-checked:shadow-[inset_0_0_0_1px_oklch(0.5684_0.2129_25.98/0.3)] pointer-fine:group-hover/project:peer-checked:bg-brand/13 peer-focus-visible:shadow-focus group-active/project:duration-100 motion-safe:group-active/project:scale-[0.97] motion-reduce:transition-none";

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
      className={`${BEZEL_CORE} p-[clamp(24px,3vw,38px)] max-md:px-5 max-md:py-6`}
      onSubmit={prepareEnquiry}
      onChange={() => {
        setDraftReady(false);
        setCopyState("");
      }}
    >
      <header className="mb-7 flex items-start justify-between gap-3 pb-[26px] shadow-[0_1px_0_var(--color-hairline)] max-md:flex-col max-md:gap-3.5 md:max-[1051px]:flex-col md:max-[1051px]:items-start">
        <div>
          <p className="text-[11px] leading-[1.5] font-semibold tracking-[0.12em] text-ink-muted uppercase">
            Your next chapter
          </p>
          <h2 className="mt-2 text-[clamp(26px,2.6vw,32px)] leading-[1.1] font-semibold tracking-[-0.05em]">
            Let’s make it happen.
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-ink/5 px-[11px] py-1.5 text-[12px] font-medium text-ink-muted">
          About 2 minutes
        </span>
      </header>
      <fieldset className={SECTION}>
        <legend className={SECTION_TITLE}>
          <span className={NUMBER}>01</span> What can we help you with?
        </legend>
        <p id="project-hint" className={HINT}>
          Pick one, or a few.
        </p>
        <div
          className="flex flex-wrap gap-2"
          aria-describedby={selectionError ? "project-error" : "project-hint"}
        >
          {PROJECT_TYPES.map((project) => (
            <label
              className="group/project relative inline-flex cursor-pointer [-webkit-tap-highlight-color:transparent]"
              key={project}
            >
              <input
                className="peer absolute m-0 size-px opacity-0"
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
              <span className={CHIP_FACE}>
                {project}
                <span
                  className="grid size-6 place-items-center rounded-full bg-white shadow-[0_2px_6px_-3px_oklch(0.35_0.08_30/0.4)] transition-[background-color] duration-200 ease-[ease] group-has-checked/project:bg-brand group-has-checked/project:text-white"
                  aria-hidden="true"
                >
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
                    <path
                      className="transition-opacity duration-[160ms] ease-[ease] group-has-checked/project:opacity-0"
                      d="M8 3v10M3 8h10"
                    />
                    <path
                      className="opacity-0 transition-opacity duration-200 ease-[ease] group-has-checked/project:opacity-100"
                      d="m3 8 3 3 7-7"
                    />
                  </svg>
                </span>
              </span>
            </label>
          ))}
        </div>
        {selectionError ? (
          <p
            id="project-error"
            className="mt-2.5 text-[13.5px] leading-[1.55] text-brand-text"
            role="alert"
          >
            Choose a project type. “Something else” is fine, too.
          </p>
        ) : null}
      </fieldset>
      <div className={`${SECTION} mt-[30px]`}>
        <label className={SECTION_TITLE} htmlFor="project-description">
          <span className={NUMBER}>02</span> A little about your idea
        </label>
        <p id="description-hint" className={HINT}>
          The rough version is more than enough.
        </p>
        <div className={INPUT_SHELL}>
          <textarea
            className={`${INPUT} min-h-[120px] resize-y`}
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
      <fieldset className={`${SECTION} mt-[30px]`}>
        <legend className={SECTION_TITLE}>
          <span className={NUMBER}>03</span> And a little about you
        </legend>
        <div className="mt-4 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
          <label className={FIELD} htmlFor="contact-name">
            Your name
            <span className={INPUT_SHELL}>
              <input
                className={INPUT}
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
          <label className={FIELD} htmlFor="contact-email">
            Email address
            <span className={INPUT_SHELL}>
              <input
                className={INPUT}
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
      <div className="mt-8 flex items-center justify-between gap-4 max-md:flex-col-reverse max-md:items-stretch md:max-[1051px]:flex-col md:max-[1051px]:items-start">
        <p className="text-[13px] leading-[1.6] text-ink-muted">
          A starting point. <br className="max-md:hidden" />
          No commitment needed.
        </p>
        <button
          className={`${buttonClass("primary")} max-md:justify-between`}
          type="submit"
        >
          {email === null ? "Prepare your enquiry" : "Create email enquiry"}
          <ButtonIcon>
            <ContactArrow />
          </ButtonIcon>
        </button>
      </div>
      <p className="mt-3.5 text-right text-[12.5px] leading-[1.5] text-ink-muted max-[1051px]:text-left">
        {email === null
          ? "Put your thoughts together in a brief you can keep."
          : "Opens your email app with your brief ready to send."}
      </p>
      {draftReady ? (
        <div className="mt-[22px] rounded-[18px] bg-ink/4 px-5 py-[18px] text-[14px] leading-[1.65]">
          <output className="block">
            {email === null
              ? "Your brief is ready. Direct enquiries will open once our contact details are available."
              : "Your email draft is ready. Send it from your email app to get in touch."}
          </output>
          <details className="mt-3">
            <summary className={`cursor-pointer font-medium ${FOCUS_RING}`}>
              View your project brief
            </summary>
            <pre className="mt-2.5 [font:inherit] whitespace-pre-wrap text-ink-soft wrap-anywhere select-text">
              {brief}
            </pre>
          </details>
          <button
            type="button"
            className={`min-h-11 cursor-pointer border-0 bg-transparent p-0 font-semibold text-brand-text ${FOCUS_RING}`}
            onClick={() => {
              void copyBrief();
            }}
          >
            Copy project brief <span aria-hidden="true">↗</span>
          </button>
          <output className="block">{copyState}</output>
        </div>
      ) : null}
    </form>
  );
};
