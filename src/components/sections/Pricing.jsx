import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Check, Star, Zap } from "lucide-react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for job seekers just getting started",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "5 AI job matches per month",
        "Basic resume scan",
        "Community access",
        "Email support"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline-hero",
      popular: false
    },
    {
      name: "Professional",
      description: "For serious job seekers who want premium features",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        "Unlimited AI job matches",
        "Advanced resume optimization",
        "Mock interview practice",
        "Application tracking",
        "Salary insights",
        "Priority support"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "hero",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For teams and organizations",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline-hero",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Choose Your{" "}
            <span className="gradient-text">Success Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and upgrade when you're ready. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center space-x-4 bg-gray-100 rounded-full p-1">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yearly
              <Badge className="ml-2 bg-success text-success-foreground">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative card-glow transition-all duration-500 scale-in ${
                plan.popular 
                  ? "ring-2 ring-primary shadow-2xl shadow-primary/20 scale-105" 
                  : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-4 py-1 text-sm font-semibold">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-primary">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <div className="text-sm text-muted-foreground">
                      ${Math.round((plan.yearlyPrice / 12) * 10) / 10}/month billed annually
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Button 
                  className={plan.buttonVariant === "hero" ? "btn-hero w-full" : "btn-outline-hero w-full"}
                  onClick={handleGetStarted}
                >
                  {plan.buttonText}
                </Button>

                <ul className="space-y-3 mt-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary/5 to-primary-dark/5 rounded-2xl border border-primary/20 px-8 py-4">
            <span className="text-sm text-muted-foreground">Need a custom solution?</span>
            <Button variant="ghost" className="text-primary hover:text-primary-dark">
              Contact our team →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
