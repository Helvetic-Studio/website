import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";

import { ProjectEnquiry } from "./project-enquiry";

const fillBrief = async () => {
  const user = userEvent.setup();
  render(<ProjectEnquiry email={null} />);
  await user.type(
    screen.getByLabelText(/A little about your idea/u),
    "A website for our architecture studio."
  );
  await user.type(screen.getByLabelText("Your name"), "Alex Taylor");
  await user.type(screen.getByLabelText("Email address"), "alex@example.com");
  return user;
};

describe(ProjectEnquiry, () => {
  it("requires a project selection and moves focus to the choices", async () => {
    const user = await fillBrief();
    await user.click(
      screen.getByRole("button", { name: "Prepare your enquiry" })
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose a project type"
    );
    expect(screen.getByRole("checkbox", { name: "Website" })).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("checkbox", { name: "Website" })).toBeChecked();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("prepares and copies all selected services and the visitor's details without claiming delivery", async () => {
    const user = await fillBrief();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();
    await user.click(screen.getByRole("checkbox", { name: "Website" }));
    await user.click(screen.getByRole("checkbox", { name: "Design" }));
    await user.click(
      screen.getByRole("button", { name: "Prepare your enquiry" })
    );
    expect(screen.getByText(/Direct enquiries will open/u)).toBeVisible();
    await user.click(
      screen.getByRole("button", { name: /Copy project brief/u })
    );
    expect(writeText).toHaveBeenCalledWith(
      "Hello Helvetic Studio,\n\nI'm interested in: Website, Design.\n\nA website for our architecture studio.\n\nFrom: Alex Taylor\nEmail: alex@example.com"
    );
    expect(screen.getByText("Project brief copied.")).toBeVisible();
    await user.type(screen.getByLabelText("Your name"), " Smith");
    expect(
      screen.queryByRole("button", { name: /Copy project brief/u })
    ).not.toBeInTheDocument();
  });

  it("offers manual copying when clipboard permission is denied", async () => {
    const user = await fillBrief();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Clipboard denied")
    );
    await user.click(screen.getByRole("checkbox", { name: "Something else" }));
    await user.click(
      screen.getByRole("button", { name: "Prepare your enquiry" })
    );
    await user.click(
      screen.getByRole("button", { name: /Copy project brief/u })
    );
    expect(screen.getByText("Select and copy the brief below.")).toBeVisible();
    await user.click(screen.getByText("View your project brief"));
    expect(
      screen.getByText(/I'm interested in: Something else/u)
    ).toBeVisible();
  });

  it("rejects a whitespace-only brief and allows the visitor to correct it", async () => {
    const user = await fillBrief();
    const description = screen.getByLabelText(/A little about your idea/u);
    await user.clear(description);
    await user.type(description, "   ");
    await user.click(screen.getByRole("checkbox", { name: "Website" }));
    await user.click(
      screen.getByRole("button", { name: "Prepare your enquiry" })
    );
    expect(description).toBeInvalid();
    expect(
      screen.queryByRole("button", { name: /Copy project brief/u })
    ).not.toBeInTheDocument();
    await user.type(description, "A portfolio.");
    await user.click(
      screen.getByRole("button", { name: "Prepare your enquiry" })
    );
    expect(description).toBeValid();
    expect(
      screen.getByRole("button", { name: /Copy project brief/u })
    ).toBeVisible();
  });
});
