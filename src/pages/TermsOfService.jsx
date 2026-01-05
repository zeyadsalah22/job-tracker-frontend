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
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none text-[#231a4c]">
            <p className="text-[#5336cc] text-base mb-6">
              <strong>Effective Date:</strong> January 1, 2026
            </p>

            <p className="text-base leading-relaxed mb-6">
              Welcome to Job Lander. These Terms of Service ("Terms", "Agreement") constitute a legally binding agreement between you ("User", "you", or "your") and Job Lander ("we", "us", "our", or "the Platform") governing your access to and use of our job application tracking and career management platform. By creating an account, accessing, or using Job Lander, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use the Platform.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">1. Acceptance of Terms</h2>
              <p className="text-base leading-relaxed mb-4">
                By accessing or using Job Lander, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>You have read and understood these Terms</li>
                <li>You agree to be bound by these Terms and all applicable laws and regulations</li>
                <li>Your use of the Platform does not violate any applicable law or regulation</li>
                <li>All information you provide is accurate, current, and complete</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                These Terms apply to all visitors, users, and others who access or use the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">2. Eligibility</h2>
              <p className="text-base leading-relaxed mb-4">
                You must meet the following eligibility requirements to use Job Lander:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Age Requirement:</strong> You must be at least 16 years of age to create an account and use the Platform</li>
                <li><strong>Legal Capacity:</strong> You must have the legal capacity to enter into binding contracts</li>
                <li><strong>Account Authenticity:</strong> You must provide accurate, truthful information and maintain the accuracy of your account information</li>
                <li><strong>Compliance:</strong> You must not be prohibited from using the Platform under applicable laws</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                If you are using the Platform on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">3. Description of Service</h2>
              <p className="text-base leading-relaxed mb-4">
                Job Lander is a comprehensive job application tracking and career management platform that provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Application Tracking:</strong> Tools to track job applications, companies, positions, and application statuses</li>
                <li><strong>Interview Management:</strong> Schedule, prepare for, and record interview sessions with notes and feedback</li>
                <li><strong>Company Database:</strong> Organize and manage information about companies and contacts</li>
                <li><strong>AI-Powered Features:</strong> AI chatbot assistant, resume analysis and matching, mock interview practice, and career guidance</li>
                <li><strong>Document Management:</strong> Upload, store, and manage resumes, CVs, and other career documents</li>
                <li><strong>Email Integration:</strong> Optional Gmail integration for tracking job-related communications</li>
                <li><strong>Analytics and Insights:</strong> Track your job search progress and receive personalized recommendations</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue any feature or aspect of the Platform at any time without prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">4. Account Registration and Security</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">4.1 Account Creation</h3>
              <p className="text-base leading-relaxed mb-4">
                To use Job Lander, you must create an account by providing accurate and complete information, including a valid email address and secure password. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li>Provide true, accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your account credentials</li>
                <li>Not share your account with others or allow others to access your account</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">4.2 Account Responsibility</h3>
              <p className="text-base leading-relaxed mb-4">
                You are solely responsible for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to maintain account security. You agree to immediately notify us of any unauthorized use of your account.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">4.3 One Account Per User</h3>
              <p className="text-base leading-relaxed mb-4">
                Each user may maintain only one account. Creating multiple accounts may result in suspension or termination of all accounts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">5. Subscription Plans and Payment</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">5.1 Service Tiers</h3>
              <p className="text-base leading-relaxed mb-4">
                Job Lander operates on a freemium model with both free and paid subscription tiers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Free Tier:</strong> Provides access to basic job tracking features with certain limitations on storage, AI usage, and advanced features</li>
                <li><strong>Premium Tier:</strong> Offers unlimited access to all features, enhanced AI capabilities, priority support, and additional storage</li>
              </ul>
              <p className="text-base leading-relaxed mb-4">
                Specific features and limitations for each tier are described on our pricing page and may be updated from time to time.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">5.2 Subscription Fees</h3>
              <p className="text-base leading-relaxed mb-4">
                Premium subscriptions require payment of fees as specified on our pricing page. By subscribing to a paid plan, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li>Pay all applicable subscription fees</li>
                <li>Provide accurate and complete payment information</li>
                <li>Authorize us to charge your payment method for recurring subscription fees</li>
                <li>Pay any applicable taxes</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">5.3 Billing and Renewal</h3>
              <p className="text-base leading-relaxed mb-4">
                Subscriptions automatically renew at the end of each billing cycle unless canceled before the renewal date. You will be charged the then-current subscription rate. We will provide reasonable notice of any price changes.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">5.4 Cancellation and Refunds</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of the current billing period</li>
                <li><strong>Refunds:</strong> Subscription fees are generally non-refundable. Refunds may be provided at our sole discretion in cases of technical issues, billing errors, or as required by law</li>
                <li><strong>Downgrade:</strong> If you downgrade from a premium to a free plan, premium features will remain accessible until the end of your paid period</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">5.5 Price Changes</h3>
              <p className="text-base leading-relaxed mb-4">
                We reserve the right to change subscription prices at any time. Price changes will not affect your current subscription period but will apply to subsequent renewal periods. We will provide at least 30 days' notice of any price increases.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">6. Acceptable Use Policy</h2>
              <p className="text-base leading-relaxed mb-4">
                You agree to use Job Lander only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Use the Platform in any way that violates applicable laws or regulations</li>
                <li>Use the Platform to engage in fraudulent, deceptive, or misleading activities</li>
                <li>Upload, post, or transmit any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Impersonate any person or entity or falsely state or misrepresent your affiliation</li>
                <li>Attempt to gain unauthorized access to any portion of the Platform or other users' accounts</li>
                <li>Interfere with or disrupt the Platform's operation or servers</li>
                <li>Use any automated system (bots, scrapers, spiders) to access the Platform without our written permission</li>
                <li>Reverse engineer, decompile, disassemble, or attempt to discover the source code of the Platform</li>
                <li>Remove, alter, or obscure any copyright, trademark, or other proprietary rights notices</li>
                <li>Use the Platform to send spam, unsolicited communications, or engage in any form of harassment</li>
                <li>Upload viruses, malware, or any malicious code</li>
                <li>Collect or harvest personal information about other users</li>
                <li>Use the Platform in any manner that could damage, disable, overburden, or impair our servers</li>
                <li>Share your account credentials or allow others to use your account</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                Violation of this Acceptable Use Policy may result in immediate suspension or termination of your account and potential legal action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">7. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">7.1 Platform Ownership</h3>
              <p className="text-base leading-relaxed mb-4">
                Job Lander and all content, features, functionality, design, software, code, text, graphics, logos, and other materials on the Platform (excluding User Content) are owned by Job Lander and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">7.2 Limited License to Users</h3>
              <p className="text-base leading-relaxed mb-4">
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Platform for your personal, non-commercial job search purposes.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">7.3 User Content Ownership</h3>
              <p className="text-base leading-relaxed mb-4">
                You retain ownership of all content you upload, submit, or create on the Platform ("User Content"), including resumes, CVs, notes, interview recordings, and other materials. However, by submitting User Content, you grant Job Lander:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li>A worldwide, non-exclusive, royalty-free license to use, store, display, reproduce, and process your User Content solely to provide and improve our services</li>
                <li>The right to use anonymized and aggregated data derived from your usage for analytics, research, and service improvement</li>
              </ul>
              <p className="text-base leading-relaxed mb-4">
                This license terminates when you delete your User Content or account, except where we are required to retain data for legal or regulatory purposes.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">7.4 Trademark Rights</h3>
              <p className="text-base leading-relaxed mb-4">
                "Job Lander" and associated logos are trademarks of Job Lander. You may not use these trademarks without our prior written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">8. AI-Generated Content and Features</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">8.1 AI Features</h3>
              <p className="text-base leading-relaxed mb-4">
                Job Lander provides AI-powered features including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li>AI chatbot assistant for career guidance and job search support</li>
                <li>Resume analysis and matching against job descriptions</li>
                <li>Mock interview question generation and practice</li>
                <li>Personalized recommendations and insights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">8.2 Disclaimers and Limitations</h3>
              <p className="text-base leading-relaxed mb-4">
                You acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Guidance Only:</strong> AI-generated content is provided for informational and guidance purposes only and should not be considered professional career advice</li>
                <li><strong>No Guarantees:</strong> We make no guarantees about the accuracy, completeness, reliability, or suitability of AI-generated content</li>
                <li><strong>No Job Outcomes:</strong> AI features do not guarantee job offers, interview success, or any specific employment outcomes</li>
                <li><strong>User Responsibility:</strong> You are solely responsible for verifying and evaluating all AI-generated suggestions before using them</li>
                <li><strong>Third-Party AI:</strong> We may use third-party AI services (e.g., OpenAI) to provide these features, subject to their terms and policies</li>
                <li><strong>Limitations:</strong> AI may produce errors, inaccuracies, or inappropriate content. Report any issues to us immediately</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">9. User Content Responsibilities</h2>
              <p className="text-base leading-relaxed mb-4">
                You are solely responsible for your User Content and the consequences of posting or publishing it. You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>You own or have the necessary rights to all User Content you submit</li>
                <li>Your User Content does not violate any third-party rights (copyright, trademark, privacy, publicity, etc.)</li>
                <li>Your User Content complies with these Terms and all applicable laws</li>
                <li>You have obtained all necessary consents and permissions for any personal data included in your User Content</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                We reserve the right (but have no obligation) to review, monitor, or remove User Content that violates these Terms or is otherwise objectionable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">10. Third-Party Services and Links</h2>
              <p className="text-base leading-relaxed mb-4">
                The Platform may contain links to third-party websites, applications, or services, or integrate with third-party APIs (e.g., Gmail). These third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Are not under our control and we are not responsible for their content, practices, or availability</li>
                <li>Have their own terms of service and privacy policies that govern your use</li>
                <li>May collect data independently from Job Lander</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                We do not endorse or assume any liability for third-party services. Your use of third-party services is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">11. Disclaimers of Warranties</h2>
              <p className="text-base leading-relaxed mb-4 uppercase font-semibold">
                THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-base leading-relaxed mb-4">
                To the fullest extent permitted by law, Job Lander disclaims all warranties, express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Warranties regarding accuracy, reliability, availability, or timeliness of the Platform or content</li>
                <li>Warranties that the Platform will be uninterrupted, secure, or error-free</li>
                <li>Warranties that defects will be corrected or that the Platform is free of viruses or harmful components</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                We do not guarantee that the Platform will meet your requirements or achieve any specific results, including job offers or career advancement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">12. Limitation of Liability</h2>
              <p className="text-base leading-relaxed mb-4 uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, JOB LANDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR OPPORTUNITIES.
              </p>
              <p className="text-base leading-relaxed mb-4">
                Specifically, we are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Loss of job opportunities, interviews, or employment</li>
                <li>Errors or inaccuracies in AI-generated content or recommendations</li>
                <li>Unauthorized access to or loss of your data despite our security measures</li>
                <li>Platform downtime, interruptions, or technical issues</li>
                <li>Actions taken by you based on Platform content or features</li>
                <li>Third-party conduct or content</li>
                <li>Any damages arising from your violation of these Terms</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                Our total aggregate liability to you for all claims arising from or related to the Platform shall not exceed the greater of: (a) the amount you paid us in the 12 months preceding the claim, or (b) $100 USD.
              </p>
              <p className="text-base leading-relaxed mt-4">
                Some jurisdictions do not allow the exclusion or limitation of certain damages, so these limitations may not apply to you to the extent prohibited by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">13. Indemnification</h2>
              <p className="text-base leading-relaxed mb-4">
                You agree to indemnify, defend, and hold harmless Job Lander, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Your use or misuse of the Platform</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party, including intellectual property rights</li>
                <li>Your User Content</li>
                <li>Your violation of any applicable laws or regulations</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                We reserve the right to assume exclusive defense and control of any matter subject to indemnification, at your expense.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">14. Account Termination and Suspension</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">14.1 Termination by You</h3>
              <p className="text-base leading-relaxed mb-4">
                You may terminate your account at any time by accessing your account settings or contacting us. Upon termination, your access to the Platform will cease, but certain provisions of these Terms will survive.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">14.2 Termination by Us</h3>
              <p className="text-base leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and access to the Platform at any time, with or without notice, for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li>Violation of these Terms or our policies</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Extended periods of inactivity</li>
                <li>Request by law enforcement or government agencies</li>
                <li>Technical or security issues</li>
                <li>Discontinuation of the Platform</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">14.3 Effect of Termination</h3>
              <p className="text-base leading-relaxed mb-4">
                Upon termination:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Your right to access and use the Platform immediately ceases</li>
                <li>We may delete your User Content and account data in accordance with our Privacy Policy</li>
                <li>You remain liable for any obligations incurred prior to termination</li>
                <li>Provisions regarding intellectual property, disclaimers, limitations of liability, indemnification, and dispute resolution survive termination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">15. Dispute Resolution and Governing Law</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">15.1 Governing Law</h3>
              <p className="text-base leading-relaxed mb-4">
                These Terms and any disputes arising from or related to the Platform shall be governed by and construed in accordance with the laws of Egypt, without regard to its conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">15.2 Jurisdiction</h3>
              <p className="text-base leading-relaxed mb-4">
                You agree to submit to the exclusive jurisdiction of the courts located in Egypt for the resolution of any disputes, except where applicable law grants you the right to bring claims in your country of residence.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">15.3 Informal Resolution</h3>
              <p className="text-base leading-relaxed mb-4">
                Before filing a formal claim, you agree to contact us at <a href="mailto:job.lander.egy@gmail.com" className="text-[#5336cc] underline hover:text-[#7571f9]">job.lander.egy@gmail.com</a> to attempt to resolve the dispute informally. We will make reasonable efforts to resolve disputes amicably.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">15.4 Time Limitation</h3>
              <p className="text-base leading-relaxed mb-4">
                Any claim or cause of action arising from or related to these Terms or the Platform must be filed within one (1) year after the claim or cause of action arose, or it will be forever barred.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">16. Changes to Terms of Service</h2>
              <p className="text-base leading-relaxed mb-4">
                We reserve the right to modify, amend, or update these Terms at any time at our sole discretion. When we make material changes, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Update the "Effective Date" at the top of these Terms</li>
                <li>Notify you via email or through a prominent notice on the Platform</li>
                <li>Provide a reasonable opportunity to review the changes</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                Your continued use of the Platform after the effective date of revised Terms constitutes your acceptance of the changes. If you do not agree to the modified Terms, you must stop using the Platform and may terminate your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">17. General Provisions</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">17.1 Entire Agreement</h3>
              <p className="text-base leading-relaxed mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Job Lander regarding your use of the Platform and supersede all prior agreements and understandings.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">17.2 Severability</h3>
              <p className="text-base leading-relaxed mb-4">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">17.3 Waiver</h3>
              <p className="text-base leading-relaxed mb-4">
                Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">17.4 Assignment</h3>
              <p className="text-base leading-relaxed mb-4">
                You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms at any time without restriction.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">17.5 No Agency</h3>
              <p className="text-base leading-relaxed mb-4">
                No agency, partnership, joint venture, or employment relationship is created between you and Job Lander as a result of these Terms or your use of the Platform.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">17.6 Force Majeure</h3>
              <p className="text-base leading-relaxed mb-4">
                We shall not be liable for any failure or delay in performing our obligations due to circumstances beyond our reasonable control, including natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, network infrastructure failures, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">18. Contact Information</h2>
              <p className="text-base leading-relaxed mb-4">
                If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:
              </p>
              <div className="bg-[#eef0ff] p-4 rounded-lg">
                <p className="text-base"><strong>Email:</strong> <a href="mailto:job.lander.egy@gmail.com" className="text-[#5336cc] underline hover:text-[#7571f9]">job.lander.egy@gmail.com</a></p>
                <p className="text-base mt-2"><strong>Company Name:</strong> Job Lander</p>
                <p className="text-base mt-2"><strong>Location:</strong> Egypt</p>
              </div>
              <p className="text-base leading-relaxed mt-4">
                We will respond to all legitimate inquiries within a reasonable timeframe.
              </p>
            </section>

            <section className="mb-8">
              <p className="text-base leading-relaxed italic text-[#5336cc]">
                By creating an account or using Job Lander, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. Thank you for choosing Job Lander for your career journey.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 
