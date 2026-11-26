import React, { useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Menu, X } from 'lucide-react';
import PortfolioChatbot from './components/PortfolioChatbot';

interface ProjectItem {
  id: string;
  title: string;
  category: 'Websites' | 'Design Systems';
  sector: string;
  year: string;
  outcome: string;
  summary: string;
  deliverables: string;
}

const SERVICES = [
  {
    number: '01.',
    title: 'Clear Information Architecture',
    description:
      'Focused page structures that help visitors understand what you offer within seconds, without maze-like navigation or unnecessary clutter.',
  },
  {
    number: '02.',
    title: 'Editorial Typography & Layout',
    description:
      'Readable proportions, calm neutral surfaces, and deliberate spacing designed to hold attention across desktop and mobile screens.',
  },
  {
    number: '03.',
    title: 'Fast, Accessible Implementation',
    description:
      'Semantic markup, keyboard-friendly controls, and lightweight front-end code that loads promptly on any connection.',
  },
];

const PROJECTS: ProjectItem[] = [
  {
    id: 'kestrel-press',
    title: 'Kestrel Press',
    category: 'Websites',
    sector: 'Independent Publishing',
    year: '2026',
    outcome: '+38% direct book pre-orders in 90 days',
    summary:
      'Redesigned the catalog and reading room for an independent architectural publisher, replacing a slow multi-step store with a single readable index.',
    deliverables: 'Editorial catalog, reading room archive, checkout flow',
  },
  {
    id: 'alder-acoustics',
    title: 'Alder Acoustics',
    category: 'Design Systems',
    sector: 'Audio Hardware',
    year: '2026',
    outcome: '14 product pages unified under 1 component library',
    summary:
      'Built a compact typographic and component system for studio monitor specifications, acoustic charts, and dealer documentation.',
    deliverables: 'Design tokens, spec tables, documentation templates',
  },
  {
    id: 'harbor-civic',
    title: 'Harbor Civic Trust',
    category: 'Websites',
    sector: 'Non-Profit',
    year: '2025',
    outcome: '2.1s faster median page load across rural networks',
    summary:
      'Created a plain-language public portal for grant applications, annual reports, and community meeting schedules.',
    deliverables: 'Public portal, accessible grant forms, annual report layout',
  },
];

export default function App() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Websites' | 'Design Systems'>('All');
  const [expandedId, setExpandedId] = useState<string | null>('kestrel-press');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeFilter);

  const scrollToContact = () => {
    setMobileMenuOpen(false);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => {
        nameInputRef.current?.focus();
      }, 350);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setFormError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setFormError('Please include a brief note (at least 10 characters).');
      return;
    }

    setFormError(null);
    setSubmitted(true);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setFormError(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-emerald-900 selection:text-white">
      {/* Top Bar: 3-zone contract */}
      <header className="sticky top-0 z-30 bg-neutral-50/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-xl font-semibold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800 rounded-sm"
          >
            Northward
          </a>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600"
          >
            <a
              href="#services"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Services
            </a>
            <a
              href="#work"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Work
            </a>
            <a
              href="#about"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              About
            </a>
            <a
              href="#contact"
              className="hover:text-neutral-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={scrollToContact}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
            >
              Start a project
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-4">
            <nav aria-label="Mobile" className="flex flex-col gap-3 text-sm font-medium text-neutral-700">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-neutral-900"
              >
                Services
              </a>
              <a
                href="#work"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-neutral-900"
              >
                Work
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-neutral-900"
              >
                About
              </a>
              <button
                type="button"
                onClick={scrollToContact}
                className="mt-1 w-full px-4 py-2.5 text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-md text-center cursor-pointer"
              >
                Start a project
              </button>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl">
            <p className="text-sm text-neutral-500 mb-4">
              Independent Web Studio · Portland, Oregon
            </p>
            <h1
              className="font-display font-medium tracking-tight text-neutral-900 leading-[1.08] mb-6"
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
                textWrap: 'balance',
              }}
            >
              Calm, durable websites built for clarity and speed.
            </h1>
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8">
              We design and build straightforward websites for studios, publishers, and small
              teams. No bloated templates, no noisy popups—just clear writing, balanced layout, and
              reliable code.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={scrollToContact}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
              >
                Start a project
              </button>
              <a
                href="#work"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-800 hover:text-emerald-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-2"
              >
                See selected work
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <figure className="mt-12 md:mt-16">
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              {!imageError ? (
                <img
                  src="/src/assets/images/studio_minimal_workspace_1795661190548.jpg"
                  alt="Daylit architectural studio workspace with a pale oak table, notebook, and steel-framed window"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-600">
                  <span className="font-display text-lg font-medium text-neutral-800">
                    Northward Studio
                  </span>
                  <span className="text-sm text-neutral-500 mt-1">
                    Portland, Oregon · Daylight Workspace
                  </span>
                </div>
              )}
            </div>
            <figcaption className="mt-3 text-xs text-neutral-500">
              Our workspace in Portland, where every project begins on paper before a single line
              of code is written.
            </figcaption>
          </figure>
        </section>

        {/* Services Section */}
        <section id="services" className="border-t border-neutral-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4">
                <h2
                  className="font-display text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mb-3"
                  style={{ textWrap: 'balance' }}
                >
                  What we focus on
                </h2>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                  Three disciplines, handled directly from first sketch to production deployment.
                </p>
              </div>

              <div className="lg:col-span-8 divide-y divide-neutral-200 border-t border-b border-neutral-200">
                {SERVICES.map((service) => (
                  <div
                    key={service.number}
                    className="py-7 first:pt-6 last:pb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
                  >
                    <div className="sm:col-span-5 flex items-baseline gap-3">
                      <span className="text-sm font-medium text-neutral-400 tabular-nums">
                        {service.number}
                      </span>
                      <h3 className="text-base md:text-lg font-semibold text-neutral-900">
                        {service.title}
                      </h3>
                    </div>
                    <p className="sm:col-span-7 text-sm md:text-base text-neutral-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Selected Work Section */}
        <section id="work" className="border-t border-neutral-200 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
              <div>
                <h2
                  className="font-display text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mb-2"
                  style={{ textWrap: 'balance' }}
                >
                  Selected work
                </h2>
                <p className="text-sm md:text-base text-neutral-600">
                  Recent sites and component systems shipped with measurable results.
                </p>
              </div>

              <div
                role="group"
                aria-label="Filter projects by category"
                className="inline-flex items-center gap-1 p-1 bg-neutral-200/70 rounded-lg self-start sm:self-auto"
              >
                {(['All', 'Websites', 'Design Systems'] as const).map((category) => {
                  const isActive = activeFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setActiveFilter(category);
                        setExpandedId(null);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-200">
              {filteredProjects.map((project) => {
                const isExpanded = expandedId === project.id;
                return (
                  <div key={project.id} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : project.id)}
                      aria-expanded={isExpanded}
                      className="w-full text-left px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/80 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-emerald-800"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-1">
                          <span>{project.sector}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{project.year}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">{project.title}</h3>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <span className="text-sm font-medium text-emerald-900 tabular-nums">
                          {project.outcome}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-150 ${
                            isExpanded ? 'rotate-180 text-neutral-700' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-1 text-sm text-neutral-600 border-t border-neutral-100 bg-neutral-50/40">
                        <p className="leading-relaxed max-w-3xl mb-3">{project.summary}</p>
                        <p className="text-xs text-neutral-500">
                          <span className="font-medium text-neutral-700">Deliverables:</span>{' '}
                          {project.deliverables}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* About & Contact Section */}
        <section id="about" className="border-t border-neutral-200 bg-white">
          <div id="contact" className="max-w-6xl mx-auto px-6 py-20 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5">
                <h2
                  className="font-display text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 mb-4"
                  style={{ textWrap: 'balance' }}
                >
                  A small practice by design
                </h2>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-4">
                  Northward takes on two client projects per quarter so every engagement receives
                  senior attention from kickoff to launch.
                </p>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-8">
                  Typical timelines run four to six weeks for a full marketing website or compact
                  design system.
                </p>

                <dl className="border-t border-neutral-200 pt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-500">Direct email</dt>
                    <dd className="font-medium text-neutral-900">hello@northward.example</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-500">Availability</dt>
                    <dd className="font-medium text-neutral-900">Booking Q1 2027</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-neutral-500">Location</dt>
                    <dd className="font-medium text-neutral-900">Portland, Oregon</dd>
                  </div>
                </dl>
              </div>

              <div className="lg:col-span-7 bg-neutral-50 border border-neutral-200 rounded-lg p-6 md:p-8">
                {submitted ? (
                  <div className="py-6">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 mb-2">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>Inquiry received</span>
                    </div>
                    <h3 className="font-display text-xl font-medium text-neutral-900 mb-2">
                      Thank you, {name.trim()}.
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                      We have noted your message and will reply to{' '}
                      <span className="font-medium text-neutral-900">{email.trim()}</span> within
                      two business days.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                    >
                      Send another note
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <h3 className="font-display text-xl font-medium text-neutral-900 mb-1">
                        Send a brief note
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Share what you are building and your rough timeline.
                      </p>
                    </div>

                    {formError && (
                      <div
                        role="alert"
                        className="px-4 py-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md"
                      >
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-medium text-neutral-700 mb-1.5"
                        >
                          Name
                        </label>
                        <input
                          ref={nameInputRef}
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Clara Jensen"
                          className="w-full px-3.5 py-2.5 text-sm text-neutral-900 bg-white border border-neutral-200 rounded-md placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-medium text-neutral-700 mb-1.5"
                        >
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="clara@company.com"
                          className="w-full px-3.5 py-2.5 text-sm text-neutral-900 bg-white border border-neutral-200 rounded-md placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium text-neutral-700 mb-1.5"
                      >
                        Project note
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="We are launching a new product catalog in early spring and need a clean website."
                        className="w-full px-3.5 py-2.5 text-sm text-neutral-900 bg-white border border-neutral-200 rounded-md placeholder:text-neutral-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 resize-y"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <span className="text-xs text-neutral-500">
                        Reply within two business days.
                      </span>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
                      >
                        Send inquiry
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-medium text-neutral-900">Northward</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 All rights reserved</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#services" className="hover:text-neutral-900 transition-colors">
              Services
            </a>
            <a href="#work" className="hover:text-neutral-900 transition-colors">
              Work
            </a>
            <a href="#about" className="hover:text-neutral-900 transition-colors">
              About
            </a>
            <a href="#top" className="hover:text-neutral-900 transition-colors">
              Back to top
            </a>
          </div>
        </div>
      </footer>

      <PortfolioChatbot />
    </div>
  );
}
