import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { Briefcase, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handlePrivacyPolicy = () => {
    navigate('/privacy-policy');
  };

  const handleTermsOfService = () => {
    navigate('/terms-of-service');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Job Lander</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering job seekers with AI-powered tools to land their dream careers. 
              Join thousands of professionals who found success with Job Lander.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10 p-0">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10 p-0">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10 p-0">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 w-10 h-10 p-0">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  AI Job Matching
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Resume Builder
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Interview Prep
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Press Kit
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Affiliate Program
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact & Support</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@joblander.ai</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>
                  123 Innovation Drive<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Live Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Status Page
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Get job search tips, industry insights, and product updates delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button className="btn-hero">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Job Lander. All rights reserved.{" "}
              <a href="https://logo.dev" title="Logo API" className="hover:text-white transition-colors">
                Logos provided by Logo.dev
              </a>
            </div>
            <div className="flex space-x-6 text-sm">
              <button 
                onClick={handlePrivacyPolicy}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={handleTermsOfService}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
