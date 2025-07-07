import React from 'react';
import { PartnerLogo } from '@/components/PartnerLogo';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-8 bg-background min-h-full">
      {/* Hero Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">About SanadHR</h1>
          <p className="text-white/90 text-lg">
            Empowering Saudi Arabia's workforce transformation through innovative HR technology solutions
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To revolutionize human resource management in Saudi Arabia by providing comprehensive, 
            AI-powered solutions that streamline operations, ensure compliance, and drive organizational excellence.
          </p>
        </div>
        
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To be the leading HR technology platform that enables Saudi organizations to build 
            world-class workforces aligned with Vision 2030's transformation goals.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-surface rounded-xl p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">What Makes Us Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-primary mb-2">85+</div>
            <div className="text-sm text-muted-foreground">Integrated Modules</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-accent mb-2">8</div>
            <div className="text-sm text-muted-foreground">Government Integrations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-status-success mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
          </div>
        </div>
      </div>

      {/* Partners & Alignment Section */}
      <div className="bg-surface rounded-xl p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Partners & Alignment</h2>
        <div className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            SanadHR is proud to align with Saudi Arabia's national transformation initiatives. 
            Our platform directly supports Vision 2030 objectives by enabling organizations to build 
            diverse, skilled workforces. We're committed to supporting the Kingdom's preparation for 
            Expo 2030 Riyadh and the FIFA World Cup 2034, ensuring workforce readiness for these 
            landmark events.
          </p>
          
          <p className="text-muted-foreground leading-relaxed">
            Through our comprehensive HR solutions, we help organizations achieve Nitaqat compliance, 
            support Saudization goals, and implement best practices in talent management that align 
            with the Kingdom's strategic vision for economic diversification and human capital development.
          </p>
          
          {/* National Initiatives Logos */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Supporting National Initiatives
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-12">
              <div className="flex items-center justify-center">
                <img
                  src="/partners/vision2030.svg"
                  alt="Saudi Vision 2030"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/partners/expo2030.png"
                  alt="Expo 2030 Riyadh"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/partners/worldcup2034.png"
                  alt="FIFA World Cup 2034 Saudi Arabia"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-surface rounded-xl p-8 border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Headquarters</h3>
            <p className="text-muted-foreground">Riyadh, Saudi Arabia</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground">info@sanadhr.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Phone</h3>
            <p className="text-muted-foreground">+966 11 XXX XXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;