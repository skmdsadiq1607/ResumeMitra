import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, ClipboardList, BarChart3, Brain, Code } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    { icon: Upload, title: '1. Upload Resume', desc: 'Select and upload your resume in PDF format.' },
    { icon: ClipboardList, title: '2. Paste Job Description', desc: 'Paste the target job description to match skills.' },
    { icon: BarChart3, title: '3. Scan & Score', desc: 'Our grading script extracts text and calculates a match percentage.' },
    { icon: Brain, title: '4. AI Feedback', desc: 'Receive bullet rephrase recommendations powered by Google Gemini.' },
    { icon: Code, title: '5. Export LaTeX', desc: 'Generate copy-pasteable LaTeX code for an ATS-safe layout.' }
  ];

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            How It Works
          </h1>
          <p className="text-lg text-text-secondary">
            Follow this simple process to check and improve your resume score.
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto mb-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="p-6 rounded-lg border border-surface-border bg-surface-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">{step.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/upload" className="btn-primary">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}
