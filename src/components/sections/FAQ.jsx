import { HelpCircle, ChevronDown } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How does Job Lander's AI matching work?",
      answer: "Our AI analyzes your skills, experience, career goals, and preferences to match you with relevant job opportunities. It considers factors like company culture, growth potential, salary expectations, and location preferences to find the best fits for your career."
    },
    {
      question: "Is Job Lander really free to start?",
      answer: "Yes! Our Starter plan is completely free and includes 5 AI job matches per month, basic resume scanning, community access, and email support. You can upgrade to Professional or Enterprise plans anytime for more features."
    },
    {
      question: "How accurate is the resume optimization feature?",
      answer: "Our AI resume optimizer has a 95% success rate in improving resume performance. It analyzes job descriptions, industry standards, and ATS requirements to suggest improvements that increase your chances of getting interviews."
    },
    {
      question: "Can I practice interviews for specific companies?",
      answer: "Absolutely! Our AI interview practice feature includes company-specific questions and scenarios. You can practice for companies like Google, Amazon, Microsoft, and many others, with real-time feedback on your responses."
    },
    {
      question: "How does the application tracking work?",
      answer: "Our application tracker automatically organizes all your job applications, sends reminders for follow-ups, tracks application status, and provides insights on your job search progress. You can also add notes and set custom reminders."
    },
    {
      question: "Is my personal data secure with Job Lander?",
      answer: "Yes, security is our top priority. We use enterprise-grade encryption, comply with GDPR and CCPA regulations, and never share your personal information without your explicit consent. You maintain full control over your data."
    },
    {
      question: "What's included in the Professional plan?",
      answer: "The Professional plan includes unlimited AI job matches, advanced resume optimization, mock interview practice, application tracking, salary insights, industry reports, and priority support. Perfect for serious job seekers."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no cancellation fees. If you cancel, you'll continue to have access to premium features until the end of your billing period, then automatically switch to the free plan."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, reach out to our support team.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="border border-gray-200 rounded-lg px-6 bg-gradient-card shadow-sm hover:shadow-md transition-shadow group"
            >
              <summary className="flex items-center justify-between py-6 cursor-pointer text-left font-semibold text-foreground hover:text-primary list-none">
                <span>{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <div className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center space-y-4 bg-gradient-to-r from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/20 px-8 py-6">
            <h3 className="text-xl font-semibold text-foreground">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">Our support team is here to help you succeed.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a 
                href="mailto:support@joblander.ai" 
                className="text-primary hover:text-primary-dark font-medium"
              >
                support@joblander.ai
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a 
                href="#" 
                className="text-primary hover:text-primary-dark font-medium"
              >
                Live Chat Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
