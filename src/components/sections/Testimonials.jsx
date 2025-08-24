import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import Avatar from "../ui/Avatar";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Button from "../ui/Button";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "Job Lander's AI matched me with my dream job at Google in just 2 weeks. The interview prep was game-changing!",
      rating: 5,
      initials: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Netflix",
      content: "The resume optimization feature helped me land 3x more interviews. I got my Netflix offer within a month!",
      rating: 5,
      initials: "MJ"
    },
    {
      name: "Elena Rodriguez",
      role: "Data Scientist",
      company: "Tesla",
      content: "Job Lander's AI insights showed me exactly what skills Tesla was looking for. I'm now living my dream!",
      rating: 5,
      initials: "ER"
    },
    {
      name: "David Kim",
      role: "UX Designer",
      company: "Airbnb",
      content: "The application tracking kept me organized, and the AI suggestions were spot on. Highly recommend!",
      rating: 5,
      initials: "DK"
    },
    {
      name: "Priya Patel",
      role: "Marketing Director",
      company: "Spotify",
      content: "From job search to offer letter in 3 weeks. Job Lander made the impossible possible!",
      rating: 5,
      initials: "PP"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-primary/5 via-white to-primary-glow/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Loved by{" "}
            <span className="gradient-text">Job Seekers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs with Job Lander's AI assistance.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <Card className="card-glow border-0 shadow-2xl shadow-primary/10">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar 
                    className="w-20 h-20 border-4 border-primary/20"
                    fallback={testimonials[currentIndex].initials}
                    size="xl"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <Quote className="w-8 h-8 text-primary/30 mb-4 mx-auto md:mx-0" />
                  
                  <blockquote className="text-lg md:text-xl leading-relaxed text-foreground mb-6">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <div className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
            onClick={nextTestimonial}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2 weeks</div>
            <div className="text-sm text-muted-foreground">Avg. Time to Hire</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
