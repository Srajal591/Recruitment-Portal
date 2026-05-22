import { useQuery } from "@tanstack/react-query";
import { Download, FileText, ListChecks } from "lucide-react";
import { jobService } from "../../services/job.service";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageFrame,
  PageHero,
  ResourceCard,
  StatTile,
} from "./PublicPageShell";

const Downloads = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-downloads"],
    queryFn: () =>
      jobService.getPublicJobs({
        limit: 12,
        sortBy: "publishedAt",
        sortOrder: "desc",
      }),
  });

  const jobs = data?.jobs || [];

  return (
    <PageFrame>
      <PageHero
        eyebrow="Downloads"
        title="Forms, Notices, and Job Resources"
        description="Downloadable resources are connected to active recruitment records. Open a job to view its official requirements, document checklist, dates, and fee configuration."
      >
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Active Jobs" value={data?.pagination?.totalItems ?? "-"} />
          <StatTile label="Resources" value={jobs.length || "-"} />
        </div>
      </PageHero>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          <ResourceCard
            icon={ListChecks}
            title="Document Checklist"
            description="Review common documents needed for public recruitment applications."
            to="/how-to-apply"
          />
          <ResourceCard
            icon={FileText}
            title="Application Guide"
            description="Step-by-step guide for registration, application, payment, and tracking."
            to="/how-to-apply"
          />
          <ResourceCard
            icon={Download}
            title="Latest Job Notices"
            description="Open active job notices directly from backend-published records."
            to="/notices"
          />
        </div>

        {isLoading && <LoadingState label="Loading job resources..." />}
        {error && <ErrorState message={error.message} />}

        {!isLoading && !error && jobs.length === 0 && (
          <EmptyState
            icon={Download}
            title="No active downloadable job resources"
            description="No active jobs are available right now, so job-specific resources are empty."
          />
        )}

        {jobs.length > 0 && (
          <div className="bg-white border border-[#e0d7cd] rounded-lg p-6">
            <h2 className="text-xl font-black text-[#1f1d1b]">
              Job-Specific Resources
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <ResourceCard
                  key={job._id}
                  icon={FileText}
                  title={job.title}
                  description={`Open details for ${job.department || "department"} to view eligibility, dates, fees, and document requirements.`}
                  to={`/jobs/${job._id}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </PageFrame>
  );
};

export default Downloads;
