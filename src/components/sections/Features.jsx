import { Card, CardContent } from "../ui/Card";
import { Brain, FileText, Users, Target, Zap, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Job Matching",
      description: "Our advanced AI analyzes your skills, experience, and preferences to find perfect job matches tailored just for you.",
      color: "from-primary to-primary-dark"
    },
    {
      icon: FileText,
      title: "Resume Optimization",
      description: "AI-powered resume analysis and optimization ensures your resume stands out and passes ATS systems.",
      color: "from-primary-glow to-primary"
    },
    {
      icon: Users,
      title: "Interview Preparation",
      description: "Practice with AI-powered mock interviews and get real-time feedback to ace your next interview.",
      color: "from-primary-dark to-primary-glow"
    },
    {
      icon: Target,
      title: "Application Tracking",
      description: "Keep track of all your applications in one place with smart reminders and follow-up suggestions.",
      color: "from-purple-500 to-primary"
    },
    {
      icon: Zap,
      title: "Instant Insights",
      description: "Get real-time market insights, salary data, and company information to make informed decisions.",
      color: "from-primary to-purple-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is encrypted and secure. We never share your information without your explicit consent.",
      color: "from-primary-glow to-primary-dark"
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
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive suite of AI-powered tools gives you the competitive edge in today's job market.
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
            <span className="text-sm text-muted-foreground">Ready to get started?</span>
            <span className="font-semibold text-primary">Join 10,000+ job seekers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
