/**
 * Test Suite for EligibleJobs Component
 * Tests the smart eligibility filter functionality
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EligibleJobs from "../EligibleJobs";
import * as jobService from "../../../services/job.service";

// Mock the job service
vi.mock("../../../services/job.service");
vi.mock("../../../services/auth.service", () => ({
  getStoredUser: vi.fn(() => ({ role: "candidate", category: "general" })),
}));

const mockJobs = [
  {
    _id: "1",
    title: "Software Engineer",
    postCode: "SE-2025-001",
    department: "IT",
    category: "Technical",
    totalPosts: 50,
    workLocation: "Delhi",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationFee: { general: 500, obc: 250, scSt: 0 },
    ageLimit: { min: 21, max: 40 },
    education: { essential: [{ degree: "B.Tech" }] },
    salaryRange: { min: 50000, max: 100000 },
    applicableFee: 500,
    daysLeft: 30,
  },
  {
    _id: "2",
    title: "Data Analyst",
    postCode: "DA-2025-001",
    department: "Analytics",
    category: "Technical",
    totalPosts: 20,
    workLocation: "Mumbai",
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    applicationFee: { general: 400, obc: 200, scSt: 0 },
    ageLimit: { min: 22, max: 35 },
    education: { essential: [{ degree: "Graduation" }] },
    salaryRange: { min: 40000, max: 80000 },
    applicableFee: 400,
    daysLeft: 15,
  },
];

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>,
  );
};

describe("EligibleJobs Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the page with title", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: mockJobs,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    await waitFor(() => {
      expect(screen.getByText("Eligible Jobs for You")).toBeInTheDocument();
    });
  });

  it("should display job cards with correct information", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: mockJobs,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("Data Analyst")).toBeInTheDocument();
      expect(screen.getByText("SE-2025-001")).toBeInTheDocument();
    });
  });

  it("should handle search filter", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: [mockJobs[0]],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    const searchInput =
      await screen.findByPlaceholderText("Job title, code...");
    fireEvent.change(searchInput, { target: { value: "Engineer" } });

    await waitFor(() => {
      expect(jobService.getEligibleJobs).toHaveBeenCalledWith(
        expect.objectContaining({
          q: "Engineer",
        }),
      );
    });
  });

  it("should handle qualification filter", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: mockJobs,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    const qualSelect = await screen.findByDisplayValue("All Levels");
    fireEvent.change(qualSelect, { target: { value: "Graduation" } });

    await waitFor(() => {
      expect(jobService.getEligibleJobs).toHaveBeenCalledWith(
        expect.objectContaining({
          qualification: "Graduation",
        }),
      );
    });
  });

  it("should handle age filter", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: mockJobs,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    const ageInput = await screen.findByPlaceholderText("Your age");
    fireEvent.change(ageInput, { target: { value: "28" } });

    await waitFor(() => {
      expect(jobService.getEligibleJobs).toHaveBeenCalledWith(
        expect.objectContaining({
          age: "28",
        }),
      );
    });
  });

  it("should handle category filter", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: mockJobs,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    const categorySelect = await screen.findByDisplayValue("General");
    fireEvent.change(categorySelect, { target: { value: "obc" } });

    await waitFor(() => {
      expect(jobService.getEligibleJobs).toHaveBeenCalledWith(
        expect.objectContaining({
          candidateCategory: "obc",
        }),
      );
    });
  });

  it("should display loading state", () => {
    jobService.getEligibleJobs.mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );
    jobService.getDepartments.mockResolvedValue({ departments: [] });

    renderWithProviders(<EligibleJobs />);

    expect(screen.getByText("Loading eligible jobs...")).toBeInTheDocument();
  });

  it("should display error state", async () => {
    jobService.getEligibleJobs.mockRejectedValue(new Error("API Error"));
    jobService.getDepartments.mockResolvedValue({ departments: [] });

    renderWithProviders(<EligibleJobs />);

    await waitFor(() => {
      expect(screen.getByText("Error Loading Jobs")).toBeInTheDocument();
    });
  });

  it("should display empty state when no jobs found", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({ departments: ["IT"] });

    renderWithProviders(<EligibleJobs />);

    await waitFor(() => {
      expect(screen.getByText("No Jobs Found")).toBeInTheDocument();
    });
  });

  it("should handle pagination", async () => {
    const page1Jobs = mockJobs.slice(0, 1);
    const page2Jobs = mockJobs.slice(1);

    jobService.getEligibleJobs.mockImplementation(({ page }) => {
      if (page === 2) {
        return Promise.resolve({
          jobs: page2Jobs,
          pagination: {
            currentPage: 2,
            totalPages: 2,
            totalItems: 2,
            itemsPerPage: 1,
          },
        });
      }
      return Promise.resolve({
        jobs: page1Jobs,
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalItems: 2,
          itemsPerPage: 1,
        },
      });
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Data Analyst")).toBeInTheDocument();
    });
  });

  it("should reset filters", async () => {
    jobService.getEligibleJobs.mockResolvedValue({
      jobs: mockJobs,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 12,
      },
    });
    jobService.getDepartments.mockResolvedValue({
      departments: ["IT", "Analytics"],
    });

    renderWithProviders(<EligibleJobs />);

    const qualSelect = await screen.findByDisplayValue("All Levels");
    fireEvent.change(qualSelect, { target: { value: "Graduation" } });

    await waitFor(() => {
      expect(screen.getByText("Reset Filters")).toBeInTheDocument();
    });

    const resetButton = screen.getByText("Reset Filters");
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(jobService.getEligibleJobs).toHaveBeenCalledWith(
        expect.objectContaining({
          qualification: undefined,
        }),
      );
    });
  });
});
