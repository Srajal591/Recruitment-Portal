import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, Ticket } from "lucide-react";
import { jobService } from "../../services/job.service";
import {
  EmptyState,
  ErrorState,
  JobListCard,
  LoadingState,
  PageFrame,
  PageHero,
  StatTile,
  formatDate,
} from "./PublicPageShell";

const AdmitCards = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-admit-cards"],
    queryFn: () =>
      jobService.getPublicJobs({
        limit: 20,
        sortBy: "examDate",
        sortOrder: "asc",
      }),
  });

  const jobs = (data?.jobs || []).filter((job) => job.examDate);

  return (
    <PageFrame>
      <PageHero
        eyebrow="Admit Cards"
        title="Exam Schedule and Admit Card Access"
        description="Public admit card information is connected to job exam dates. Candidates can download released admit cards after logging into their dashboard."
      >
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Scheduled Exams" value={jobs.length || "-"} />
          <StatTile label="Active Jobs" value={data?.pagination?.totalItems ?? "-"} />
        </div>
      </PageHero>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
        {isLoading && <LoadingState label="Loading exam schedules..." />}
        {error && <ErrorState message={error.message} />}

        {!isLoading && !error && jobs.length === 0 && (
          <EmptyState
            icon={Ticket}
            title="No admit card releases scheduled"
            description="No active jobs currently have public exam dates attached. When departments publish exam schedules, they will appear here."
          />
        )}

        <div className="space-y-4">
          {jobs.map((job) => (
            <JobListCard
              key={job._id}
              job={job}
              meta={`Exam date: ${formatDate(job.examDate)}. Admit card download is available from the candidate dashboard after release.`}
              actionLabel="View Job"
            />
          ))}
        </div>

        <div className="bg-white border border-[#e0d7cd] rounded-lg p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CalendarCheck2 className="w-6 h-6 text-orange-600 shrink-0" />
            <div>
              <h2 className="font-black text-[#1f1d1b]">
                Already applied?
              </h2>
              <p className="mt-1 text-sm text-[#6d6761]">
                Login to check application status and released admit cards.
              </p>
            </div>
          </div>
          <Link
            to="/candidate/admit-card"
            className="inline-flex h-11 items-center justify-center rounded bg-[#e46a1d] px-5 text-white text-xs uppercase tracking-[0.12em] font-black hover:bg-[#cb5d16]"
          >
            Candidate Admit Card
          </Link>
        </div>
      </section>
    </PageFrame>
  );
};

export default AdmitCards;
