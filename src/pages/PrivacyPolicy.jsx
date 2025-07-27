import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#eef0ff]" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e0e3ff] px-10 py-3 bg-white">
        <div className="flex items-center gap-4 text-[#231a4c]">
          <div className="w-4 h-4">
            <img src="/logo2.png" alt="Job Lander Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-[#231a4c] text-lg font-bold leading-tight tracking-[-0.015em]">Job Lander</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={goBack}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e0e3ff] text-[#231a4c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#c6cbff] transition-colors"
          >
            <span className="truncate">Go Back</span>
          </button>
          <button
            onClick={goHome}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#7571f9] text-[#eef0ff] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#6144e7] transition-colors"
          >
            <span className="truncate">Home</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-[#e0e3ff] p-8">
          <h1 className="text-[#231a4c] text-4xl font-black leading-tight tracking-[-0.033em] mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-[#231a4c]">
            <p className="text-[#5336cc] text-base mb-6">
              <strong>Last updated:</strong> July, 2025
            </p>

            <p className="text-base leading-relaxed mb-6">
              Job Lander ("we", "our", or "us") respects your privacy and is committed to protecting the personal information you provide while using our platform.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">1. Information We Collect</h2>
              <p className="text-base leading-relaxed mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Personal Data:</strong> Name, email address, and account credentials.</li>
                <li><strong>Job Application Data:</strong> Companies, roles, resumes, interview questions, answers, and notes.</li>
                <li><strong>Usage Data:</strong> Interaction with the platform, log files, and analytics via tools like Google Analytics.</li>
                <li><strong>AI Queries:</strong> Messages and documents submitted to AI features (e.g., resume matching, mock interviews).</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">2. How We Use Your Data</h2>
              <p className="text-base leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Provide and improve our services</li>
                <li>Personalize your job-seeking experience</li>
                <li>Deliver AI-generated insights and assistance</li>
                <li>Communicate with you (e.g., updates, reminders, support)</li>
                <li>Ensure account security and fraud prevention</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">3. Data Sharing</h2>
              <p className="text-base leading-relaxed mb-4">We do not sell your personal information. We only share your data:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>With trusted service providers (e.g., cloud storage, analytics) under strict confidentiality</li>
                <li>As required by law or legal requests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">4. Data Security</h2>
              <p className="text-base leading-relaxed">
                We use industry-standard security measures (encryption, access control) to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">5. Your Rights</h2>
              <p className="text-base leading-relaxed mb-4">You may:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Access or update your personal data</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                To exercise your rights, contact us at [your email address].
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">6. Changes to this Policy</h2>
              <p className="text-base leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notices.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 
