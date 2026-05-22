import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { HelpPanel, PageFrame, PageHero, ResourceCard } from "./PublicPageShell";

const Contact = () => (
  <PageFrame>
    <PageHero
      eyebrow="Support"
      title="Contact the Recruitment Helpdesk"
      description="Use the official support channels for application, payment, document, and portal access queries. Logged-in candidates can also raise support tickets from their dashboard."
    />

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-5 md:grid-cols-2">
          <ResourceCard
            icon={Phone}
            title="Helpline"
            description="1800-123-4567, available Monday to Friday between 9:00 AM and 6:00 PM."
            to="/faq"
          />
          <ResourceCard
            icon={Mail}
            title="Email Support"
            description="support@recruitment.gov.in for technical and application related assistance."
            to="/faq"
          />
          <ResourceCard
            icon={MapPin}
            title="Office"
            description="Recruitment Portal Helpdesk, New Delhi, India."
            to="/about"
          />
          <ResourceCard
            icon={Send}
            title="Candidate Ticket"
            description="Login to submit a tracked support ticket for your application."
            to="/candidate/support"
          />
        </div>

        <aside className="space-y-5">
          <HelpPanel />
          <Link
            to="/auth/candidate-login"
            className="flex h-12 items-center justify-center rounded bg-[#e46a1d] text-white text-xs uppercase tracking-[0.12em] font-black hover:bg-[#cb5d16]"
          >
            Login for Ticket Support
          </Link>
        </aside>
      </div>
    </section>
  </PageFrame>
);

export default Contact;
