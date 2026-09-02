import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail, User, MessageSquare, Send } from 'lucide-react';

const MotionDiv = motion.div;

const CONTACT_INFO = {
  email: "novapriminus@gmail.com",
  website: "",
  location: "Coimbatore, Tamil Nadu, India",
};

const footerContent = {
  eyebrow: 'About us',
  title: 'Turning career gaps into clear learning paths.',
  description:
    'Skill Gap Analyzer is designed to help learners understand where they stand today and what they should learn next. By analyzing a resume against a selected target role, the platform identifies existing strengths, highlights missing skills, and turns those gaps into a structured learning journey.',
  links: [
    { label: 'Website', href: CONTACT_INFO.website || '#', icon: Globe },
    { label: 'Email', href: `mailto:${CONTACT_INFO.email}`, icon: Mail },
  ],
};

function FooterSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all fields.');
      return;
    }
    
    const subject = encodeURIComponent(`New message from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="relative overflow-hidden px-5 pb-12 pt-8 sm:px-8 lg:px-10 lg:pb-16">
      <div className="mx-auto max-w-[1380px] rounded-[2.3rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,252,245,1),rgba(255,247,232,0.92))] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16"
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
            
            <p className="mt-8 text-sm font-medium text-[var(--color-muted)] flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {CONTACT_INFO.location}
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-white/74 p-6 sm:p-8 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
              GET IN TOUCH
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-[var(--color-muted)]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(255,252,247,0.95)] py-3 pl-12 pr-4 text-base text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-[var(--color-muted)]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  className="w-full rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(255,252,247,0.95)] py-3 pl-12 pr-4 text-base text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  required
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-[var(--color-muted)]" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full resize-none rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(255,252,247,0.95)] py-3 pl-12 pr-4 text-base text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--color-accent-strong),var(--color-accent))] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-strong)] focus:ring-offset-2 focus:ring-offset-[rgba(255,252,245,1)]"
              >
                Send Message
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </MotionDiv>
      </div>
    </footer>
  );
}

export default FooterSection;
