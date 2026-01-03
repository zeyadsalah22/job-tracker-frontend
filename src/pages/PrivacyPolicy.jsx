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
              <strong>Effective Date:</strong> January 1, 2026
            </p>

            <p className="text-base leading-relaxed mb-6">
              Job Lander ("we", "our", "us", or "the Platform") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our job application tracking and career management platform. By accessing or using Job Lander, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">1. Information We Collect</h2>
              <p className="text-base leading-relaxed mb-4">We collect various types of information to provide and improve our services:</p>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">1.1 Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Account Information:</strong> Name, email address, password (encrypted), and account credentials</li>
                <li><strong>Profile Information:</strong> Professional details, contact information, and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">1.2 Job Search Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Application Tracking:</strong> Job applications, company information, position details, application status, and notes</li>
                <li><strong>Interview Data:</strong> Interview schedules, questions, answers, recordings (if you choose to record), and feedback</li>
                <li><strong>Resumes and CVs:</strong> Documents you upload for storage, analysis, or matching</li>
                <li><strong>Company Data:</strong> Information about companies you track or interact with</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">1.3 AI Interaction Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Chat Conversations:</strong> Messages, prompts, and queries submitted to our AI chatbot assistant</li>
                <li><strong>AI Feature Usage:</strong> Resume matching requests, mock interview sessions, and career guidance interactions</li>
                <li><strong>Generated Content:</strong> AI-generated suggestions, recommendations, and analysis results</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">1.4 Technical and Usage Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns, and interaction history</li>
                <li><strong>Analytics Data:</strong> Collected via Google Analytics and similar tools to understand platform performance</li>
                <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, and analytics cookies (see Cookie Policy below)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">1.5 Email Integration Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Gmail API Integration:</strong> If you connect your Gmail account, we may access job-related emails with your explicit consent</li>
                <li><strong>Email Communications:</strong> Records of emails we send you and your responses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">2. How We Use Your Information</h2>
              <p className="text-base leading-relaxed mb-4">We process your data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Service Provision:</strong> To create and manage your account, provide job tracking features, and deliver core platform functionality</li>
                <li><strong>AI-Powered Features:</strong> To provide resume analysis, mock interviews, career guidance, and personalized job matching through AI technology</li>
                <li><strong>Personalization:</strong> To customize your experience, recommend relevant features, and improve user interface based on your preferences</li>
                <li><strong>Communication:</strong> To send notifications, updates, reminders, support responses, and administrative messages</li>
                <li><strong>Analytics and Improvement:</strong> To analyze usage patterns, identify bugs, enhance features, and improve platform performance</li>
                <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, security threats, and abuse of the platform</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and enforceable governmental requests</li>
                <li><strong>Business Operations:</strong> To manage subscriptions, process payments, provide customer support, and conduct internal operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">3. Legal Basis for Processing (GDPR)</h2>
              <p className="text-base leading-relaxed mb-4">For users in the European Economic Area (EEA), United Kingdom, and Switzerland, we process your personal data based on the following legal grounds:</p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Contract Performance:</strong> Processing necessary to provide services you've requested and fulfill our contractual obligations</li>
                <li><strong>Consent:</strong> Where you have explicitly agreed to specific processing activities (e.g., email marketing, Gmail integration)</li>
                <li><strong>Legitimate Interest:</strong> To improve our services, ensure security, analyze usage, and conduct business operations where not overridden by your rights</li>
                <li><strong>Legal Obligation:</strong> To comply with laws and regulations applicable to our business</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">4. Information Sharing and Disclosure</h2>
              <p className="text-base leading-relaxed mb-4"><strong>We do not sell your personal information to third parties.</strong> We may share your data only in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">4.1 Third-Party Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>AI Service Providers:</strong> OpenAI and similar services to power our chatbot, resume analysis, and mock interview features</li>
                <li><strong>Cloud Infrastructure:</strong> Hosting and storage providers (e.g., AWS, Google Cloud) that store your data securely</li>
                <li><strong>Analytics Services:</strong> Google Analytics and similar tools to understand platform usage and performance</li>
                <li><strong>Email Services:</strong> Email delivery providers to send notifications, updates, and communications</li>
                <li><strong>Payment Processors:</strong> For processing subscription payments (if applicable)</li>
              </ul>
              <p className="text-base leading-relaxed mb-4">All service providers are contractually bound to protect your data and use it only for the purposes we specify.</p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">4.2 Legal Requirements</h3>
              <p className="text-base leading-relaxed mb-4">We may disclose your information when required by law or in response to:</p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li>Legal processes (subpoenas, court orders)</li>
                <li>Governmental or regulatory requests</li>
                <li>Requests to protect rights, property, or safety of Job Lander, users, or the public</li>
                <li>Enforcement of our Terms of Service or investigation of potential violations</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">4.3 Business Transfers</h3>
              <p className="text-base leading-relaxed mb-4">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change.</p>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">4.4 With Your Consent</h3>
              <p className="text-base leading-relaxed mb-4">We may share your information with other parties when you explicitly consent to such sharing.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">5. International Data Transfers</h2>
              <p className="text-base leading-relaxed mb-4">
                Job Lander operates from Egypt and may transfer, store, and process your data in Egypt and other countries where our service providers operate. These countries may have data protection laws different from your country. When we transfer data internationally, we implement appropriate safeguards including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Standard contractual clauses approved by the European Commission</li>
                <li>Ensuring service providers adhere to recognized data protection frameworks</li>
                <li>Implementing technical and organizational security measures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">6. Data Security</h2>
              <p className="text-base leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Encryption:</strong> Data is encrypted in transit (TLS/SSL) and at rest</li>
                <li><strong>Access Controls:</strong> Strict authentication and authorization mechanisms limit data access to authorized personnel only</li>
                <li><strong>Regular Security Audits:</strong> Periodic reviews and updates of our security practices</li>
                <li><strong>Secure Infrastructure:</strong> Use of reputable cloud providers with robust security certifications</li>
                <li><strong>Password Protection:</strong> Passwords are hashed using industry-standard algorithms</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                However, no method of transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">7. Data Retention</h2>
              <p className="text-base leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to provide you services. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li><strong>Active Accounts:</strong> We retain your data for the duration of your account's existence</li>
                <li><strong>Deleted Accounts:</strong> When you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law</li>
                <li><strong>Legal Obligations:</strong> Some data may be retained longer to comply with legal, tax, or regulatory requirements</li>
                <li><strong>Backup Systems:</strong> Data in backup systems may persist for up to 90 days after deletion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">8. Your Privacy Rights</h2>
              <p className="text-base leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">8.1 Rights for All Users</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Access:</strong> Request access to your personal data and receive a copy</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails at any time</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">8.2 Additional Rights (GDPR - EEA/UK/Switzerland)</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
                <li><strong>Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">8.3 Additional Rights (CCPA - California)</h3>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Know:</strong> Right to know what personal information is collected, used, shared, or sold</li>
                <li><strong>Delete:</strong> Right to request deletion of personal information</li>
                <li><strong>Opt-Out:</strong> Right to opt-out of the sale of personal information (note: we do not sell personal information)</li>
                <li><strong>Non-Discrimination:</strong> Right not to receive discriminatory treatment for exercising privacy rights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#231a4c]">8.4 How to Exercise Your Rights</h3>
              <p className="text-base leading-relaxed mb-4">
                To exercise any of these rights, please contact us at <a href="mailto:job.lander.egy@gmail.com" className="text-[#5336cc] underline hover:text-[#7571f9]">job.lander.egy@gmail.com</a>. We will respond to your request within 30 days. You may also manage many of these settings directly through your account dashboard.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">9. Cookies and Tracking Technologies</h2>
              <p className="text-base leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience and collect usage data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base mb-4">
                <li><strong>Essential Cookies:</strong> Required for basic platform functionality (authentication, security)</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform (Google Analytics)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Functional Cookies:</strong> Enable enhanced features and personalization</li>
              </ul>
              <p className="text-base leading-relaxed mb-4">
                You can control cookies through your browser settings. Note that disabling certain cookies may limit platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">10. Children's Privacy</h2>
              <p className="text-base leading-relaxed">
                Job Lander is not intended for users under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected data from a child under 16, we will take steps to delete such information promptly. If you believe we have collected information from a child under 16, please contact us immediately at <a href="mailto:job.lander.egy@gmail.com" className="text-[#5336cc] underline hover:text-[#7571f9]">job.lander.egy@gmail.com</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">11. Third-Party Links and Services</h2>
              <p className="text-base leading-relaxed">
                Our platform may contain links to third-party websites, applications, or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">12. Do Not Track Signals</h2>
              <p className="text-base leading-relaxed">
                Some browsers support "Do Not Track" (DNT) signals. Currently, our platform does not respond to DNT signals. We will update this policy if we implement DNT support in the future.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">13. Changes to This Privacy Policy</h2>
              <p className="text-base leading-relaxed mb-4">
                We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-base">
                <li>Update the "Effective Date" at the top of this policy</li>
                <li>Notify you via email to the address associated with your account</li>
                <li>Display a prominent notice on the platform</li>
                <li>Request your consent if required by applicable law</li>
              </ul>
              <p className="text-base leading-relaxed mt-4">
                Your continued use of Job Lander after such changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">14. Governing Law and Jurisdiction</h2>
              <p className="text-base leading-relaxed">
                This Privacy Policy is governed by the laws of Egypt. Any disputes arising from this policy or our privacy practices shall be subject to the exclusive jurisdiction of the courts of Egypt, except where applicable law grants you the right to bring claims in your country of residence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#231a4c]">15. Contact Us</h2>
              <p className="text-base leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[#eef0ff] p-4 rounded-lg">
                <p className="text-base"><strong>Email:</strong> <a href="mailto:job.lander.egy@gmail.com" className="text-[#5336cc] underline hover:text-[#7571f9]">job.lander.egy@gmail.com</a></p>
                <p className="text-base mt-2"><strong>Company Name:</strong> Job Lander</p>
                <p className="text-base mt-2"><strong>Location:</strong> Egypt</p>
              </div>
              <p className="text-base leading-relaxed mt-4">
                We will respond to all legitimate requests within 30 days or as required by applicable law.
              </p>
            </section>

            <section className="mb-8">
              <p className="text-base leading-relaxed italic text-[#5336cc]">
                By using Job Lander, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 
