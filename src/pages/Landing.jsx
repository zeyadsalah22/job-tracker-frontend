import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotScene } from '../components/ui/robot-scene';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/');
  };

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

  // Test if component renders
  if (false) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Lander</h1>
          <p className="text-gray-600 mb-8">Your All-in-One AI Job Search Assistant</p>
          <button 
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4"
          >
            Get Started
          </button>
          <button 
            onClick={handleLogin}
            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-full min-h-screen flex-col bg-[#eef0ff] overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e0e3ff] px-10 py-3">
          <div className="flex items-center gap-4 text-[#231a4c]">
            <div className="w-4 h-4">
              <img src="/logo2.png" alt="Job Lander Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-[#231a4c] text-lg font-bold leading-tight tracking-[-0.015em]">Job Lander</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <button 
                className="text-[#231a4c] text-sm font-medium leading-normal cursor-pointer hover:text-[#7571f9] transition-colors"
                onClick={() => scrollToSection('features')}
              >
                Features
              </button>
              <button 
                className="text-[#231a4c] text-sm font-medium leading-normal cursor-pointer hover:text-[#7571f9] transition-colors"
                onClick={() => scrollToSection('how-it-works')}
              >
                How it Works
              </button>
              <button 
                className="text-[#231a4c] text-sm font-medium leading-normal cursor-pointer hover:text-[#7571f9] transition-colors"
                onClick={() => scrollToSection('pricing')}
              >
                Pricing
              </button>
              <button 
                className="text-[#231a4c] text-sm font-medium leading-normal cursor-pointer hover:text-[#7571f9] transition-colors"
                onClick={() => scrollToSection('faq')}
              >
                FAQ
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleGetStarted}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#7571f9] text-[#eef0ff] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#6144e7] transition-colors"
              >
                <span className="truncate">Get Started</span>
              </button>
              <button
                onClick={handleLogin}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e0e3ff] text-[#231a4c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#c6cbff] transition-colors"
              >
                <span className="truncate">Login</span>
              </button>
            </div>
          </div>
        </header>
        <div className="px-8 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1400px] flex-1">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-[600px] px-4 py-20 gap-12">
              {/* Left Content - Text and CTA */}
              <div className="flex-1 max-w-[600px] lg:pr-8">
                <div className="flex flex-col gap-6 text-left">
                  {/* Main Headline */}
                  <div className="flex flex-col gap-3">
                    <h1 className="text-[#231a4c] text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                      Your AI-Powered
                      <span className="block text-[#7571f9]">Job Search</span>
                      <span className="block">Assistant</span>
                    </h1>
                    
                    {/* Slogan */}
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-12 h-[2px] bg-gradient-to-r from-[#7571f9] to-[#a4a8fd]"></div>
                      <p className="text-[#7571f9] text-xl font-bold tracking-wider uppercase">
                        Land Your Dream
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#5336cc] text-lg leading-relaxed max-w-[500px]">
                    Job Lander leverages cutting-edge AI to streamline your entire job application process. From intelligent resume matching to AI-powered mock interviews, we ensure you stand out from the competition and land your dream career.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <button
                      onClick={handleGetStarted}
                      className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-[#7571f9] text-[#eef0ff] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#6144e7] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="truncate">Get Started Free</span>
                    </button>
                    <button
                      onClick={() => scrollToSection('how-it-works')}
                      className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 border-2 border-[#7571f9] text-[#7571f9] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#7571f9] hover:text-[#eef0ff] transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="truncate">See How It Works</span>
                    </button>
                  </div>

                  {/* Stats or Features Preview */}
                  <div className="flex items-center gap-8 mt-8 pt-8 border-t border-[#e0e3ff]">
                    <div className="text-center">
                      <div className="text-[#231a4c] text-2xl font-black">10K+</div>
                      <div className="text-[#5336cc] text-sm">Jobs Matched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#231a4c] text-2xl font-black">95%</div>
                      <div className="text-[#5336cc] text-sm">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#231a4c] text-2xl font-black">24/7</div>
                      <div className="text-[#5336cc] text-sm">AI Support</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content - 3D Robot Scene */}
              <div className="flex-1 max-w-[700px] h-[600px] lg:h-[700px]">
                <RobotScene 
                  className="w-full h-full" 
                  robotStyle="moodyBlue"  // Options: 'default', 'bright', 'colorful', 'purple', 'moodyBlue'
                  animation={true}        // Set to false to disable animations
                  waveOnLoad={true}       // Waves 2 seconds after page loads
                />
              </div>
            </div>
            <div id="features" className="flex flex-col gap-10 px-4 py-10">
              <div className="flex flex-col gap-4">
                <h1
                  className="text-[#231a4c] tracking-tight text-[32px] font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-[720px]"
                >
                  Key Features
                </h1>
                <p className="text-[#231a4c] text-base font-normal leading-normal max-w-[720px]">
                  Job Lander offers a comprehensive suite of tools to enhance your job search journey.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 p-0">
                <div className="flex flex-1 gap-3 rounded-lg border border-[#c6cbff] bg-[#eef0ff] p-4 flex-col">
                  <div className="text-[#231a4c]" data-icon="File" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#231a4c] text-base font-bold leading-tight">Application Tracking</h2>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">Effortlessly manage and track all your job applications in one place.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#c6cbff] bg-[#eef0ff] p-4 flex-col">
                  <div className="text-[#231a4c]" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#231a4c] text-base font-bold leading-tight">Resume Matching</h2>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">Tailor your resume to match specific job descriptions for optimal results.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#c6cbff] bg-[#eef0ff] p-4 flex-col">
                  <div className="text-[#231a4c]" data-icon="Microphone" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V232a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#231a4c] text-base font-bold leading-tight">Mock Interviews</h2>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">Practice your interview skills with AI-powered mock interviews and feedback.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#c6cbff] bg-[#eef0ff] p-4 flex-col">
                  <div className="text-[#231a4c]" data-icon="Robot" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-28,16v24H120V152ZM80,164a12,12,0,0,1,12-12h12v24H92A12,12,0,0,1,80,164Zm84,12H152V152h12a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#231a4c] text-base font-bold leading-tight">AI Job Assistant</h2>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">Get personalized job recommendations and application assistance from our AI.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#c6cbff] bg-[#eef0ff] p-4 flex-col">
                  <div className="text-[#231a4c]" data-icon="Users" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#231a4c] text-base font-bold leading-tight">Job Seekers Community</h2>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">Connect with other job seekers, share tips, and support each other.</p>
                  </div>
                </div>
                <div className="flex flex-1 gap-3 rounded-lg border border-[#c6cbff] bg-[#eef0ff] p-4 flex-col">
                  <div className="text-[#231a4c]" data-icon="Bell" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-[#231a4c] text-base font-bold leading-tight">Notifications System</h2>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">Stay informed with timely notifications about job openings and application updates.</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 id="how-it-works" className="text-[#231a4c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">How It Works</h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-2 px-4">
              <div className="flex flex-col items-center gap-1 pt-5">
                <div className="w-2 h-2 rounded-full bg-[#231a4c]"></div>
                <div className="w-[1.5px] bg-[#c6cbff] h-4 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#231a4c] text-base font-medium leading-normal">Sign Up</p>
                <p className="text-[#5336cc] text-base font-normal leading-normal">Create your free account in minutes.</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1.5px] bg-[#c6cbff] h-4"></div>
                <div className="w-2 h-2 rounded-full bg-[#231a4c]"></div>
                <div className="w-[1.5px] bg-[#c6cbff] h-4 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#231a4c] text-base font-medium leading-normal">Upload Your Resume</p>
                <p className="text-[#5336cc] text-base font-normal leading-normal">Upload your current resume to get started.</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-[1.5px] bg-[#c6cbff] h-4"></div>
                <div className="w-2 h-2 rounded-full bg-[#231a4c]"></div>
                <div className="w-[1.5px] bg-[#c6cbff] h-4 grow"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#231a4c] text-base font-medium leading-normal">Search and Apply</p>
                <p className="text-[#5336cc] text-base font-normal leading-normal">Browse job openings and apply with AI-enhanced applications.</p>
              </div>
              <div className="flex flex-col items-center gap-1 pb-3">
                <div className="w-[1.5px] bg-[#c6cbff] h-4"></div>
                <div className="w-2 h-2 rounded-full bg-[#231a4c]"></div>
              </div>
              <div className="flex flex-1 flex-col py-3">
                <p className="text-[#231a4c] text-base font-medium leading-normal">Track Your Progress</p>
                <p className="text-[#5336cc] text-base font-normal leading-normal">Monitor your application status and receive updates.</p>
              </div>
            </div>
            <h2 className="text-[#231a4c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Testimonials</h2>
            <div className="flex flex-col gap-8 overflow-x-hidden bg-[#eef0ff] p-4">
              <div className="flex flex-col gap-3 bg-[#eef0ff]">
                <div className="flex items-center gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGynKgu1Fnhsh49Rj4fojTrLEG6LL55k8BMI76uKrDCNmTxVFwnTQ_-dET6rK1icB_4SzRpFiHIcssd5TDyOO0up8rXla_mM2hHb1tYOH433-kaSg-63QvrrM_62e75ry38oFvh_6Edi-Gfosi6MNEijISDnodQpj8vWYmKolQCVm71rMoXsJTIiCBhYUker6wxDLc91jtty6gNtXXwEyg8pvtVOEdytAZNdBIY9qoLLrLXPWyYTd4ZVoOUwhjp7kSMLRJS-rCGK0")' }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-[#231a4c] text-base font-medium leading-normal">Sarah M.</p>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">2023-08-15</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[#231a4c] text-base font-normal leading-normal">
                  Job Lander transformed my job search! The AI-powered resume matching helped me land interviews I wouldn't have gotten otherwise.
                </p>
                <div className="flex gap-9 text-[#5336cc]">
                  <button className="flex items-center gap-2">
                    <div className="text-inherit" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-inherit">12</p>
                  </button>
                  <button className="flex items-center gap-2">
                    <div className="text-inherit" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-inherit">1</p>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-[#eef0ff]">
                <div className="flex items-center gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdYe1Kh_702VbHWFYRoXIeQN_FwekyQ1pqmo2RpXWZ2B5T0vHJfSyZLPzl20oWgueqEWukHANM2txPhweWhH0BD32eKhJ8Wc5cD-EZmIj0WEu3dJ8Ck4vwN_ODuX_Oo2vF0JOrQY5sXmgK7RxHulm008HnX2a4ug5RhMdBgvlNuxzVZKJ0t8Fov3e6ALhsvG1OYtW17W3V_gUfLn1WwW9VmrOvFu0fzr5GwGEQj4VaxOf8xWQGacYCX21Ew0Hc-tk5Qq0UVng35Qo")' }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-[#231a4c] text-base font-medium leading-normal">David L.</p>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">2023-09-22</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#a4a8fd]" data-icon="Star" data-size="20px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[#231a4c] text-base font-normal leading-normal">
                  The mock interviews were incredibly helpful in preparing me for real interviews. I felt much more confident.
                </p>
                <div className="flex gap-9 text-[#5336cc]">
                  <button className="flex items-center gap-2">
                    <div className="text-inherit" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-inherit">8</p>
                  </button>
                  <button className="flex items-center gap-2">
                    <div className="text-inherit" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-inherit">2</p>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-[#eef0ff]">
                <div className="flex items-center gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCARwk2-5OfXT446u-DapItT4uA44xH5ShozHEu7Lc8AzwarDuj8RTpVgbfxe8sxLN3B6SCOTg_298_z-m8VcNF42yD-X53QxwHbmmVy__Q25beXi-YsDzNqt6y8x1uqqb6Lfro8Pj_JpoTBihUXxobONJD-r8Grx9EJq9fLX0PTYD6GlSkY296vxW373Jg9WEIrzLt7gR3fxeSaytVGDU2OS8NaOsi_2rUyRDxNBEKB3_fHtjAaZJg2dIEKeFTWPxTYQiIzTCO44s")' }}
                  ></div>
                  <div className="flex-1">
                    <p className="text-[#231a4c] text-base font-medium leading-normal">Emily R.</p>
                    <p className="text-[#5336cc] text-sm font-normal leading-normal">2023-10-10</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-[#7571f9]" data-icon="Star" data-size="20px" data-weight="fill">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="text-[#231a4c] text-base font-normal leading-normal">
                  I love the application tracking feature. It keeps me organized and on top of all my applications. Highly recommend!
                </p>
                <div className="flex gap-9 text-[#5336cc]">
                  <button className="flex items-center gap-2">
                    <div className="text-inherit" data-icon="ThumbsUp" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-inherit">15</p>
                  </button>
                  <button className="flex items-center gap-2">
                    <div className="text-inherit" data-icon="ThumbsDown" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"
                        ></path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <h2 id="pricing" className="text-[#231a4c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5 px-4 py-3">
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-solid border-[#c6cbff] bg-[#eef0ff] p-6">
                <div className="flex flex-col gap-1">
                  <h1 className="text-[#231a4c] text-base font-bold leading-tight">Free</h1>
                  <p className="flex items-baseline gap-1 text-[#231a4c]">
                    <span className="text-[#231a4c] text-4xl font-black leading-tight tracking-[-0.033em]">$0</span>
                    <span className="text-[#231a4c] text-base font-bold leading-tight">/month</span>
                  </p>
                </div>
                <button
                  onClick={handleGetStarted}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e0e3ff] text-[#231a4c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#c6cbff] transition-colors"
                >
                  <span className="truncate">Get Started</span>
                </button>
                <div className="flex flex-col gap-2">
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    Application Tracking
                  </div>
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    Resume Matching (Limited)
                  </div>
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    Community Access
                  </div>
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    Basic Support
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 rounded-xl border border-solid border-[#c6cbff] bg-[#eef0ff] p-6">
                <div className="flex flex-col gap-1">
                  <h1 className="text-[#231a4c] text-base font-bold leading-tight">Premium</h1>
                  <p className="flex items-baseline gap-1 text-[#231a4c]">
                    <span className="text-[#231a4c] text-4xl font-black leading-tight tracking-[-0.033em]">$19</span>
                    <span className="text-[#231a4c] text-base font-bold leading-tight">/month</span>
                  </p>
                </div>
                <button
                  onClick={handleGetStarted}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e0e3ff] text-[#231a4c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#c6cbff] transition-colors"
                >
                  <span className="truncate">Upgrade Now</span>
                </button>
                <div className="flex flex-col gap-2">
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    All Free Features
                  </div>
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    Resume Matching (Unlimited)
                  </div>
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    Mock Interviews
                  </div>
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    AI Job Assistant
                  </div>
                  <div className="text-[13px] font-normal leading-normal flex gap-3 text-[#231a4c]">
                    <div className="text-[#231a4c]" data-icon="Check" data-size="20px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                    Priority Support
                  </div>
                </div>
              </div>
            </div>
            <h2 id="faq" className="text-[#231a4c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">FAQ</h2>
            <div className="flex flex-col p-4 gap-3">
                              <details className="flex flex-col rounded-xl border border-[#c6cbff] bg-[#eef0ff] px-[15px] py-[7px]" open>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-[#231a4c] text-sm font-medium leading-normal">What is Job Lander?</p>
                  <div className="text-[#231a4c] " data-icon="CaretDown" data-size="20px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </summary>
                <p className="text-[#5336cc] text-sm font-normal leading-normal pb-2">
                  Job Lander is an AI-powered platform designed to help job seekers streamline their job application process and increase their chances of landing their dream job.
                  It offers features like application tracking, resume matching, mock interviews, and an AI job assistant.
                </p>
              </details>
              <details className="flex flex-col rounded-xl border border-[#c6cbff] bg-[#eef0ff] px-[15px] py-[7px]">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-[#231a4c] text-sm font-medium leading-normal">How does the AI Job Assistant work?</p>
                  <div className="text-[#231a4c] " data-icon="CaretDown" data-size="20px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </summary>
                <p className="text-[#5336cc] text-sm font-normal leading-normal pb-2">
                  Job Lander is an AI-powered platform designed to help job seekers streamline their job application process and increase their chances of landing their dream job.
                  It offers features like application tracking, resume matching, mock interviews, and an AI job assistant.
                </p>
              </details>
              <details className="flex flex-col rounded-xl border border-[#c6cbff] bg-[#eef0ff] px-[15px] py-[7px]">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                  <p className="text-[#231a4c] text-sm font-medium leading-normal">Is my data secure?</p>
                  <div className="text-[#231a4c] " data-icon="CaretDown" data-size="20px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </summary>
                <p className="text-[#5336cc] text-sm font-normal leading-normal pb-2">
                  Job Lander is an AI-powered platform designed to help job seekers streamline their job application process and increase their chances of landing their dream job.
                  It offers features like application tracking, resume matching, mock interviews, and an AI job assistant.
                </p>
              </details>
            </div>
            <div className="@container">
              <div className="flex flex-col justify-end gap-6 px-4 py-10 sm:gap-8 sm:px-10 sm:py-20">
                <div className="flex flex-col gap-2 text-center">
                  <h1
                    className="text-[#231a4c] tracking-tight text-[32px] font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-[720px]"
                  >
                    Ready to take your job search to the next level?
                  </h1>
                  <p className="text-[#231a4c] text-base font-normal leading-normal max-w-[720px">Sign up for Job Lander today and start your journey towards your dream career.</p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center">
                    <button
                      onClick={handleGetStarted}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 sm:h-12 sm:px-5 bg-[#7571f9] text-[#eef0ff] text-sm font-bold leading-normal tracking-[0.015em] sm:text-base sm:font-bold sm:leading-normal sm:tracking-[0.015em] grow hover:bg-[#6144e7] transition-colors"
                    >
                      <span className="truncate">Get Started</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <footer className="flex flex-col gap-6 px-5 py-10 text-center">
              <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-row sm:justify-around">
                <button 
                  className="text-[#5336cc] text-base font-normal leading-normal min-w-40 hover:text-[#7571f9] transition-colors cursor-pointer"
                  onClick={handleTermsOfService}
                >
                  Terms of Service
                </button>
                <button 
                  className="text-[#5336cc] text-base font-normal leading-normal min-w-40 hover:text-[#7571f9] transition-colors cursor-pointer"
                  onClick={handlePrivacyPolicy}
                >
                  Privacy Policy
                </button>
                <a className="text-[#5336cc] text-base font-normal leading-normal min-w-40" href="#">Contact Us</a>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#">
                  <div className="text-[#5336cc]" data-icon="TwitterLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"
                      ></path>
                    </svg>
                  </div>
                </a>
                <a href="#">
                  <div className="text-[#5336cc]" data-icon="LinkedinLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"
                      ></path>
                    </svg>
                  </div>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61578679794076#">
                  <div className="text-[#5336cc]" data-icon="FacebookLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"
                      ></path>
                    </svg>
                  </div>
                </a>
              </div>
              <p className="text-[#5336cc] text-base font-normal leading-normal">© 2024 Job Lander. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
