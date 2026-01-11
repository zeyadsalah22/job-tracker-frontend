import { Card, CardContent } from "../ui/Card";
import { 
  Brain, 
  FileText, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Building2, 
  TrendingUp, 
  MessageSquare,
  FileBarChart,
  Sparkles,
  Send,
  UsersRound
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Target,
      title: "Application Tracking",
      description: "Track all your job applications in one organized dashboard. Monitor stages, statuses, and never miss a follow-up with smart reminders.",
      color: "from-primary to-primary-dark"
    },
    {
      icon: Brain,
      title: "Mock Interviews",
      description: "Practice with AI-powered mock interviews. Get real-time feedback, improve your answers, and build confidence for the real thing.",
      color: "from-primary to-purple-500"
    },
    {
      icon: UsersRound,
      title: "Community & Support",
      description: "Connect with fellow job seekers, share experiences, get advice, and support each other throughout your job search journey.",
      color: "from-primary to-primary-glow"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Visualize your job search progress with detailed charts and statistics. Track acceptance rates, application trends, and optimize your strategy.",
      color: "from-primary-glow to-primary"
    },
    {
      icon: Send,
      title: "Auto Apply",
      description: "Automatically apply to relevant job postings that match your profile. Save time and apply to more opportunities effortlessly.",
      color: "from-primary-dark to-purple-500"
    },
    {
      icon: MessageSquare,
      title: "AI Chatbot Assistant",
      description: "Get instant answers about your applications, personalized advice, and insights powered by AI to help you throughout your job search.",
      color: "from-primary-dark to-primary-glow"
    },
    {
      icon: Sparkles,
      title: "Resume Matching",
      description: "AI analyzes your resume against job descriptions to calculate ATS scores and provide optimization suggestions for better matches.",
      color: "from-purple-500 to-primary-dark"
    },
    {
      icon: Building2,
      title: "Company Management",
      description: "Research and save companies you're interested in. Add personal notes, track interest levels, and organize your target companies.",
      color: "from-primary-glow to-primary"
    },
    {
      icon: Users,
      title: "Employee Networking",
      description: "Keep track of employees you've contacted at different companies. Manage your professional connections and referral opportunities.",
      color: "from-primary-dark to-primary-glow"
    },
    {
      icon: FileText,
      title: "Question Bank",
      description: "Build your own question bank with interview questions, coding challenges, and preparation notes. Mark favorites and track your progress.",
      color: "from-purple-500 to-primary"
    },
    {
      icon: FileBarChart,
      title: "Resume Management",
      description: "Store and manage multiple versions of your resume. Track which CV you used for each application and monitor ATS scores.",
      color: "from-purple-500 to-primary"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data is encrypted and secure. Complete control over your information with GDPR compliance and data export options.",
      color: "from-primary-glow to-purple-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Organize Your Job Search</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform designed to streamline your job search process and help you land your dream job faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-glow group hover:shadow-xl transition-all duration-500 border-0 scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Feature Icon */}
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Feature Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-2xl shadow-lg px-8 py-4 border border-gray-200/50">
            <span className="text-sm text-muted-foreground">Ready to streamline your job search?</span>
            <span className="font-semibold text-primary">Join us today!</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
