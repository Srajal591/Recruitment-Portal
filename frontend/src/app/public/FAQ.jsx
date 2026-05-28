import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { jobService } from "../../services/job.service";
import {
  ErrorState,
  LoadingState,
  PageFrame,
  PageHero,
  SearchInput,
  StatTile,
} from "./PublicPageShell";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

const baseFaqs = [
  {
    question: "How do I apply for a job?",
    answer:
      "Open an active job, review eligibility, login or register as a candidate, complete all application steps, pay any applicable fee, and submit before the deadline.",
  },
  {
    question: "Can I resume a draft application?",
    answer:
      "Yes. Login as a candidate and open My Applications. Draft applications can be resumed from the saved step.",
  },
  {
    question: "Where do I download admit cards?",
    answer:
      "Admit card availability depends on the job's exam schedule. Login to your candidate dashboard when the recruitment authority releases it.",
  },
  {
    question: "How are fees shown?",
    answer:
      "Application fees are pulled from the job configuration published by the department. Always verify the amount on the job detail page before applying.",
  },
  {
    question: "What if no jobs are visible?",
    answer:
      "The public API only shows active jobs with open deadlines. Check back later or use filters to broaden your search.",
  },
];

const FAQ = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-faq-stats"],
    queryFn: jobService.getPublicStats,
  });

  const faqs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return baseFaqs;
    return baseFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term),
    );
  }, [search]);

  return (
    <PageFrame>
      <PageHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Find answers for registration, active jobs, applications, admit cards, payments, and candidate support."
      >
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Active Jobs" value={data?.totalActiveJobs ?? "-"} />
          <StatTile label="Open Posts" value={data?.totalVacancies ?? "-"} />
        </div>
      </PageHero>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">
        {isLoading && <LoadingState />}
        {error && <ErrorState message={error.message} />}

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search questions..."
        />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.details
              key={faq.question}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="group bg-white border border-[#e0d7cd] rounded-lg p-5"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-black text-[#1f1d1b]">
                <span>{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-orange-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-sm leading-6 text-[#6d6761]">
                {faq.answer}
              </p>
            </motion.details>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="bg-white border border-[#e0d7cd] rounded-lg p-8 text-center">
            <HelpCircle className="w-10 h-10 text-[#c7bdb3] mx-auto mb-3" />
            <p className="font-bold text-[#1f1d1b]">No matching questions</p>
          </div>
        )}
      </section>
    </PageFrame>
  );
};

export default FAQ;
