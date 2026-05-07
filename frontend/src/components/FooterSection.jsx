import { motion } from 'framer-motion';
import { AtSign, Globe, Mail } from 'lucide-react';

const MotionDiv = motion.div;

const footerContent = {
  eyebrow: 'About us',
  title: 'A placeholder team story you can rewrite later.',
  description:
    'We are building a more thoughtful way to understand career readiness. The goal is to turn resume information into concrete next steps that feel actionable, motivating, and clear.',
  links: [
    { label: 'Website', href: '#', icon: Globe },
    { label: 'LinkedIn', href: '#', icon: AtSign },
    { label: 'Email', href: '#', icon: Mail },
  ],
  contact: ['hello@skillgapanalyzer.ai', '+91 90000 00000', 'Bengaluru, India'],
};

function FooterSection() {
  return (
    <footer className="relative overflow-hidden px-5 pb-12 pt-8 sm:px-8 lg:px-10 lg:pb-16">
      <div className="mx-auto max-w-[1380px] rounded-[2.3rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,252,245,1),rgba(255,247,232,0.92))] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
              {footerContent.eyebrow}
            </p>
            <h3 className="font-display mt-5 text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
              {footerContent.title}
            </h3>
            <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
              {footerContent.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {footerContent.links.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white/82 px-4 py-3 text-sm font-semibold text-[var(--color-ink-soft)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent-strong)]"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/74 p-6 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
              Contact placeholder
            </p>
            <div className="mt-6 space-y-4">
              {footerContent.contact.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(255,252,247,0.95)] px-4 py-4 text-base text-[var(--color-ink-soft)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>
      </div>
    </footer>
  );
}

export default FooterSection;
