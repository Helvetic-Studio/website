import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vite-plus/test";

import { Button } from "./button";

test("calls the click handler when activated", async () => {
  const handleClick = vi.fn<() => void>();
  const user = userEvent.setup();

  render(<Button onClick={handleClick}>Save changes</Button>);

  const button = screen.getByRole("button", { name: "Save changes" });

  expect(button).toBeEnabled();
  await user.click(button);
  expect(handleClick).toHaveBeenCalledOnce();
});
