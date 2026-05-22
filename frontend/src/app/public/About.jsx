import { useQuery } from "@tanstack/react-query";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { jobService } from "../../services/job.service";
import {
  ErrorState,
  LoadingState,
  PageFrame,
  PageHero,
  ResourceCard,
  StatTile,
} from "./PublicPageShell";

const About = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-about-stats"],
    queryFn: jobService.getPublicStats,
  });

  return (
    <PageFrame>
      <PageHero
        eyebrow="About Portal"
        title="Transparent public recruitment in one place"
        description="The Recruitment Portal brings active public sector opportunities, application tracking, notifications, and candidate support into a single digital workflow."
      >
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Active Jobs" value={data?.totalActiveJobs ?? "-"} />
          <StatTile label="Open Posts" value={data?.totalVacancies ?? "-"} />
        </div>
      </PageHero>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {isLoading && <LoadingState label="Loading portal statistics..." />}
        {error && <ErrorState message={error.message} />}

        <div className="grid gap-5 md:grid-cols-3">
          <ResourceCard
            icon={ShieldCheck}
            title="Verified Recruitment"
            description="Only active jobs published by authorized departments are shown to candidates."
            to="/jobs"
          />
          <ResourceCard
            icon={Users}
            title="Candidate First"
            description="Candidates can apply, resume drafts, track applications, and receive updates from their dashboard."
            to="/how-to-apply"
          />
          <ResourceCard
            icon={Building2}
            title="Department Coverage"
            description="Browse opportunities across active departments and recruitment projects."
            to="/jobs"
          />
        </div>

        {data?.departmentStats?.length > 0 && (
          <div className="bg-white border border-[#e0d7cd] rounded-lg p-6">
            <h2 className="text-xl font-black text-[#1f1d1b]">
              Active Departments
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {data.departmentStats.map((department) => (
                <div
                  key={department._id}
                  className="flex items-center justify-between rounded border border-[#ece3da] px-4 py-3"
                >
                  <span className="font-semibold text-[#3f3a36]">
                    {department._id || "Department"}
                  </span>
                  <span className="text-sm text-[#6d6761]">
                    {department.jobCount} jobs / {department.totalPosts} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageFrame>
  );
};

export default About;
