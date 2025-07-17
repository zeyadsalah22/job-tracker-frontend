import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#f9f8fc]" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e9e6f4] px-10 py-3 bg-white">
        <div className="flex items-center gap-4 text-[#100d1c]">
          <div className="w-4 h-4">
            <img src="/logo2.png" alt="Job Lander Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-[#100d1c] text-lg font-bold leading-tight tracking-[-0.015em]">Job Lander</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={goBack}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e9e6f4] text-[#100d1c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d3cee9] transition-colors"
          >
            <span className="truncate">Go Back</span>
          </button>
          <button
            onClick={goHome}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#7e5ffa] text-[#f9f8fc] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#6d4ee6] transition-colors"
          >
            <span className="truncate">Home</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-[#e9e6f4] p-8">
          <h1 className="text-[#100d1c] text-4xl font-black leading-tight tracking-[-0.033em] mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none text-[#100d1c]">
            <p className="text-[#59479e] text-base mb-6">
              <strong>Last updated:</strong> July, 2025
            </p>

            <p className="text-base leading-relaxed mb-6">
              By using Job Lander, you agree to the following terms and conditions. Please read them carefully.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">1. Eligibility</h2>
              <p className="text-base leading-relaxed">
                You must be at least 16 years old to use our services. By using the platform, you confirm you meet this requirement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">2. Use of the Service</h2>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>You agree to use the platform for lawful job-seeking purposes only.</li>
                <li>You are responsible for maintaining the confidentiality of your account.</li>
                <li>You may not attempt to reverse-engineer, copy, or misuse the platform.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">3. AI-Generated Content</h2>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>The platform provides AI-generated suggestions (e.g., interview questions, resume analysis).</li>
                <li>These are for guidance only and do not guarantee job outcomes.</li>
                <li>You are solely responsible for the use of AI content.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">4. User-Generated Content</h2>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>You retain ownership of the content you upload (e.g., resumes, interview notes).</li>
                <li>You grant us a license to store and use this data to provide the service to you.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">5. Account Termination</h2>
              <p className="text-base leading-relaxed mb-4">We reserve the right to suspend or terminate your account if:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>You violate these terms</li>
                <li>You misuse the platform in any unlawful or harmful way</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">6. Limitation of Liability</h2>
              <p className="text-base leading-relaxed">
                Job Lander is provided "as-is". We are not liable for any job losses, missed opportunities, or issues resulting from platform use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">7. Modifications</h2>
              <p className="text-base leading-relaxed">
                We may update these terms periodically. Continued use of the platform after changes means you accept the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#100d1c]">8. Contact</h2>
              <p className="text-base leading-relaxed">
                If you have any questions, please contact us at [your email address].
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 