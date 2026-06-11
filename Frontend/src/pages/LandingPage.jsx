import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BarChart3, AlertCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight mb-4">
          ATS Resume Grader
        </h1>
        
        {/* Description */}
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
          Upload your resume in PDF format to evaluate it against standard Applicant Tracking System (ATS) rules. Get an instant score and feedback.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to="/upload" className="btn-primary">
            Start Free Analysis
          </Link>
          <Link to="/analysis/demo" className="btn-secondary">
            View Sample Report
          </Link>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Instant Scoring</h3>
            <p className="text-sm text-text-muted">
              Get a matching score out of 100 based on standard ATS parsing algorithms.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Keyword Detection</h3>
            <p className="text-sm text-text-muted">
              Find missing skills and important keywords required for your target job descriptions.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">AI Suggestions</h3>
            <p className="text-sm text-text-muted">
              Receive smart bullet-point updates to make your experience section look stronger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
