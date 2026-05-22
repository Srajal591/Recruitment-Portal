import { Link } from "react-router-dom";
import { CheckCircle2, CreditCard, FileCheck2, UserPlus } from "lucide-react";
import {
  HelpPanel,
  PageFrame,
  PageHero,
  ResourceCard,
} from "./PublicPageShell";

const steps = [
  {
    icon: UserPlus,
    title: "Register or Login",
    description:
      "Create a candidate account, verify OTP, and keep your profile details updated.",
  },
  {
    icon: FileCheck2,
    title: "Choose an Active Job",
    description:
      "Open the job detail page, review eligibility, documents, fee, and deadline.",
  },
  {
    icon: CheckCircle2,
    title: "Complete Application",
    description:
      "Fill personal, education, address, document, and post preference sections.",
  },
  {
    icon: CreditCard,
    title: "Submit and Track",
    description:
      "Pay the applicable fee, submit the form, and track status from the dashboard.",
  },
];

const HowToApply = () => (
  <PageFrame>
    <PageHero
      eyebrow="Candidate Guide"
      title="How to Apply"
      description="Follow the official application flow from registration to final submission. The same steps are used by every active job published on this portal."
    />

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-white border border-[#e0d7cd] rounded-lg p-6 flex gap-5"
            >
              <div className="w-12 h-12 rounded bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] font-black text-[#9a8f86]">
                  Step {index + 1}
                </p>
                <h2 className="mt-1 text-xl font-black text-[#1f1d1b]">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#6d6761]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-5">
          <ResourceCard
            title="Browse Active Jobs"
            description="Start from the dynamic job listing and select the recruitment you want to apply for."
            to="/jobs"
          />
          <HelpPanel />
          <Link
            to="/auth/register"
            className="flex h-12 items-center justify-center rounded bg-[#e46a1d] text-white text-xs uppercase tracking-[0.12em] font-black hover:bg-[#cb5d16]"
          >
            Register Now
          </Link>
        </aside>
      </div>
    </section>
  </PageFrame>
);

export default HowToApply;
