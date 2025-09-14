
import { render, screen } from "@testing-library/react";
import ScheduleBuilder from "../ScheduleBuilder";


jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    replace: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/"
  }),
}));

const mockProps = {
  scheduleItems: [],
  activeDays: ["saturday", "sunday"],
  onUpdateItem: jest.fn(),
  onRemoveItem: jest.fn(),
  onAddActivity: jest.fn(),
  onAddActivityToSlot: jest.fn(),
  theme: "lazy",
  editingPlan: null,
  isEditMode: false,
  autoGeneratePlan: jest.fn(),
  setShowSmartIntegrations: jest.fn(),
  setShowPosterGenerator: jest.fn(),
};

test("renders schedule header", () => {
  render(<ScheduleBuilder {...mockProps} />);
  const header = screen.getByTestId("schedule-header");
  expect(header).toBeInTheDocument();
});



