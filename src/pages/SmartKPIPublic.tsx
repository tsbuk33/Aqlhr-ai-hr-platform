import React from 'react';

const SmartKPIPublic = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Smart KPI Tool</h1>
          <p className="text-xl text-muted-foreground">
            Advanced AI-powered KPI analytics and insights for your organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
            <p className="text-muted-foreground">
              Monitor your KPIs in real-time with advanced analytics and predictive insights.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground">
              Leverage artificial intelligence to discover patterns and optimize performance.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Custom Dashboards</h3>
            <p className="text-muted-foreground">
              Create personalized dashboards tailored to your specific business needs.
            </p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Advanced data visualization and reporting
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Predictive analytics and forecasting
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Integration with multiple data sources
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Automated alerts and notifications
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              Mobile-responsive design
            </li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Ready to transform your KPI management?
          </p>
          <a 
            href="/en/auth" 
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default SmartKPIPublic;

