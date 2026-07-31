import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import {
  createCompletedRunId,
  createDistanceMeters,
  createDurationSeconds,
  createIanaTimeZone,
  createUserId,
  createUtcDateTime,
  type CompletedRun,
} from "../domain/training";
import Analyze from "./Analyze";

vi.mock("framer-motion", () => ({ motion: { div: "div" } }));

const timestamp = createUtcDateTime("2026-08-05T14:00:00Z");
const run: CompletedRun = {
  id: createCompletedRunId("run-1"),
  userId: createUserId("runner-1"),
  startedAt: timestamp,
  timeZone: createIanaTimeZone("America/Los_Angeles"),
  distance: createDistanceMeters(8_047),
  duration: createDurationSeconds(2_400),
  createdAt: timestamp,
  updatedAt: timestamp,
};

it("shows analytics calculated from completed runs", () => {
  render(<Analyze runs={[run]} now={new Date("2026-08-06T12:00:00Z")} />);

  expect(screen.getByText("Total Mileage")).toBeInTheDocument();
  expect(screen.getAllByText("5 mi")).toHaveLength(2);
  expect(screen.getByText("Average Pace")).toBeInTheDocument();
  expect(screen.getByText("8:00 /mi")).toBeInTheDocument();
  expect(screen.getByText("Total Runs")).toBeInTheDocument();
  expect(screen.getAllByText("1")).toHaveLength(2);
});

it("shows sensible values for an empty history", () => {
  render(<Analyze runs={[]} now={new Date("2026-08-06T12:00:00Z")} />);

  expect(screen.getByText(/log your first run/i)).toBeInTheDocument();
  expect(screen.getAllByText("0 mi")).toHaveLength(2);
  expect(screen.getByText("Not enough data")).toBeInTheDocument();
});
