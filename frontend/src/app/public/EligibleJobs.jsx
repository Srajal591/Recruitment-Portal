import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { jobService } from "../../services/job.service";
import {
  EmptyState,
  ErrorState,
  JobListCard,
  LoadingState,
  PageFrame,
  PageHero,
  StatTile,
} from "./PublicPageShell";

const normalizeQualification = (value = "") => {
  const text = value.toLowerCase();
  if (text.includes("post")) return "Post Graduation";
  if (text.includes("graduation")) return "Graduation";
  if (text.includes("12")) return "12th";
  if (text.includes("10")) return "10th";
  return value;
};

const getAge = (value = "") => {
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : "";
};

const isAgeEligible = (job, age) => {
  if (!age || !job.ageLimit?.min || !job.ageLimit?.max) return true;
  return age >= job.ageLimit.min && age <= job.ageLimit.max;
};

const EligibleJobs = () => {
  const location = useLocation();
  const incoming = location.state || {};

  const [filters, setFilters] = useState({
    qualification: normalizeQualification(incoming.qualification || ""),
    age: getAge(incoming.age || ""),
    category: incoming.category || "",
    search: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["eligible-jobs", filters.qualification, filters.search],
    queryFn: () =>
      jobService.searchJobs({
        q: filters.search || undefined,
        qualification: filters.qualification || undefined,
      }),
  });

  const jobs = useMemo(() => {
    const source = data?.jobs || [];
    return source.filter((job) => isAgeEligible(job, Number(filters.age)));
  }, [data, filters.age]);

  return (
    <PageFrame>
      <PageHero
        eyebrow="Eligibility"
        title="Eligible Jobs"
        description="Match active public jobs using qualification and age filters connected to the backend search API."
      >
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Matches" value={jobs.length || "-"} />
          <StatTile label="API Source" value="Live" />
        </div>
      </PageHero>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="bg-white border border-[#e0d7cd] rounded-lg p-5 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-5 h-5 text-orange-600" />
              <h2 className="font-black text-[#1f1d1b]">Eligibility Filter</h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#6d6761]">
                  Search
                </span>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8179]" />
                  <input
                    value={filters.search}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        search: event.target.value,
                      }))
                    }
                    className="w-full h-11 pl-10 pr-3 rounded border border-[#d8cec4] text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Job title or department"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#6d6761]">
                  Qualification
                </span>
                <select
                  value={filters.qualification}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      qualification: event.target.value,
                    }))
                  }
                  className="mt-2 w-full h-11 rounded border border-[#d8cec4] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Any Qualification</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#6d6761]">
                  Age
                </span>
                <input
                  type="number"
                  min="0"
                  value={filters.age}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      age: event.target.value,
                    }))
                  }
                  className="mt-2 w-full h-11 rounded border border-[#d8cec4] px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter age"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#6d6761]">
                  Candidate Category
                </span>
                <select
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  className="mt-2 w-full h-11 rounded border border-[#d8cec4] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">General / Not selected</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="PwD">PwD</option>
                </select>
              </label>

              <Link
                to="/jobs"
                className="flex h-11 items-center justify-center gap-2 rounded bg-[#e46a1d] text-white text-xs uppercase tracking-[0.12em] font-black hover:bg-[#cb5d16]"
              >
                <Filter className="w-4 h-4" />
                Browse All Jobs
              </Link>
            </div>
          </aside>

          <div className="space-y-4">
            {isLoading && <LoadingState label="Finding eligible jobs..." />}
            {error && <ErrorState message={error.message} />}

            {!isLoading && !error && jobs.length === 0 && (
              <EmptyState
                title="No matching eligible jobs"
                description="Try changing qualification, age, or search terms. The backend only returns active jobs with open deadlines."
              />
            )}

            {jobs.map((job) => (
              <JobListCard
                key={job._id}
                job={job}
                meta="Eligibility match is based on active backend filters and available job criteria."
                actionLabel="View Details"
              />
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
};

export default EligibleJobs;
