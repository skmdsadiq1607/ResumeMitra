import React from 'react';
import { Target, Lightbulb, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            About ResumeMitra
          </h1>
          <p className="text-lg text-text-secondary">
            Our goal is to help job seekers understand how automated hiring systems scan resumes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Our Mission</h3>
            <p className="text-text-muted leading-relaxed">
              We provide transparent feedback on your resume structure and matching metrics, giving you insights into what hiring managers actually want to see.
            </p>
          </div>

          <div className="p-8 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Our Vision</h3>
            <p className="text-text-muted leading-relaxed">
              We aim to make resume tools free, accessible, and simple so candidates can focus on building skills rather than figuring out formatting tricks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto text-center">
          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <Users className="mx-auto text-blue-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-text-primary">10k+</div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Resumes Graded</div>
          </div>
          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <Globe className="mx-auto text-blue-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-text-primary">100% Free</div>
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">Open Source Tool</div>
          </div>
        </div>
      </div>
    </div>
  );
}
