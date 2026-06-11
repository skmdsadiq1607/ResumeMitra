import React from 'react';
import { BarChart3, Code, Target, Brain } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Features
          </h1>
          <p className="text-lg text-text-secondary">
            A simple set of tools designed to analyze and grade your resume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Resume Scoring</h3>
            <p className="text-sm text-text-muted">
              Get an overall compatibility rating based on formatting, structure, and text content scans.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Target size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Keyword Matching</h3>
            <p className="text-sm text-text-muted">
              Paste a job description to extract required keywords and match them against your resume.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Brain size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">AI Bullet Suggestion</h3>
            <p className="text-sm text-text-muted">
              Use Gemini AI to get action-verb suggestions for updating weak bullet points.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-surface-border bg-surface-card">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
              <Code size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">LaTeX Resume Support</h3>
            <p className="text-sm text-text-muted">
              Compile your edited resume profile into clean LaTeX format for a completely ATS-friendly layout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
