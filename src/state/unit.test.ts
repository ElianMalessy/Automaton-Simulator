import Input from '../components/Input.svelte';

import { render, screen, fireEvent } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';


describe("Input", () => {
  // other stuff

   test("accepted when last 3 char are 000", async () => {
    render(Input);

    await userEvent.type(screen.getByLabelText("input"), "10100101000");
    expect(screen.getByText("declined")).toBeInTheDocument();
  });
});   