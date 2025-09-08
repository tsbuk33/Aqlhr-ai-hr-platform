"""
AQLHR Executive Dashboard - C-Suite Interface
============================================

This module implements the executive dashboard interface for C-suite executives,
providing strategic insights, Vision 2030 tracking, and AI-powered decision support.
"""

from flask import Flask, render_template, jsonify, request
from datetime import datetime, timedelta
import json
from typing import Dict, List, Any
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)


class StrategicMetrics:
    """Strategic metrics for executive dashboard"""
    
    @staticmethod
    async def get_workforce_roi() -> Dict[str, Any]:
        """Get workforce ROI metrics"""
        return {
            'current_roi': 146,
            'change_percentage': 15,
            'trend': 'increasing',
            'target': 160,
            'description': 'Productivity improvement'
        }
    
    @staticmethod
    async def get_revenue_per_employee() -> Dict[str, Any]:
        """Get revenue per employee metrics"""
        return {
            'current_value': 180000,
            'currency': 'SAR',
            'optimization_percentage': 80,
            'trend': 'stable',
            'benchmark': 200000
        }
    
    @staticmethod
    async def get_saudization_rate() -> Dict[str, Any]:
        """Get Saudization rate metrics"""
        return {
            'current_rate': 64,
            'target_rate': 70,
            'nitaqat_status': 'Green',
            'trend': 'increasing',
            'vision_2030_aligned': True
        }
    
    @staticmethod
    async def get_strategic_readiness() -> Dict[str, Any]:
        """Get strategic readiness score"""
        return {
            'readiness_score': 45,
            'compliance_percentage': 94,
            'areas_for_improvement': [
                'Digital transformation',
                'Talent development',
                'Process automation'
            ]
        }


class Vision2030Tracker:
    """Vision 2030 KPI tracking"""
    
    @staticmethod
    async def get_vision_2030_kpis() -> Dict[str, Any]:
        """Get Vision 2030 KPIs"""
        return {
            'overall_alignment': 78,
            'kpis': {
                'women_participation': {
                    'current': 34.2,
                    'target': 35,
                    'status': 'on_track'
                },
                'saudization_rate': {
                    'current': 64,
                    'target': 70,
                    'status': 'needs_improvement'
                },
                'digital_transformation': {
                    'current': 82,
                    'target': 90,
                    'status': 'on_track'
                },
                'employee_satisfaction': {
                    'current': 87,
                    'target': 85,
                    'status': 'exceeding'
                }
            }
        }


class AIDecisionSummary:
    """AI decision summary for executives"""
    
    @staticmethod
    async def get_recent_ai_decisions() -> List[Dict[str, Any]]:
        """Get recent AI decisions"""
        return [
            {
                'id': 'ai_decision_001',
                'timestamp': datetime.now() - timedelta(hours=2),
                'decision': 'Automated workforce planning optimization',
                'impact': 'Potential 340% ROI increase',
                'confidence': 94,
                'status': 'implemented',
                'category': 'strategic'
            },
            {
                'id': 'ai_decision_002',
                'timestamp': datetime.now() - timedelta(hours=6),
                'decision': 'Compliance risk mitigation',
                'impact': 'Reduced compliance risk by 23%',
                'confidence': 89,
                'status': 'in_progress',
                'category': 'compliance'
            },
            {
                'id': 'ai_decision_003',
                'timestamp': datetime.now() - timedelta(days=1),
                'decision': 'Talent acquisition optimization',
                'impact': 'Improved hiring efficiency by 45%',
                'confidence': 92,
                'status': 'completed',
                'category': 'operational'
            }
        ]


class ExecutiveReports:
    """Board-ready reports for executives"""
    
    @staticmethod
    async def generate_board_report() -> Dict[str, Any]:
        """Generate board-ready report"""
        return {
            'report_id': 'board_report_' + datetime.now().strftime('%Y%m%d'),
            'generated_at': datetime.now(),
            'executive_summary': {
                'key_achievements': [
                    'Achieved 94% compliance score',
                    'Increased workforce ROI by 15%',
                    'Improved Saudization rate to 64%'
                ],
                'strategic_initiatives': [
                    'Vision 2030 alignment program',
                    'Digital transformation roadmap',
                    'Talent development strategy'
                ],
                'risk_factors': [
                    'Skill gap in emerging technologies',
                    'Regulatory changes impact',
                    'Market competition for talent'
                ]
            },
            'financial_metrics': {
                'cost_savings': 1875000,
                'roi_improvement': 15,
                'efficiency_gains': 23
            },
            'operational_metrics': {
                'employee_satisfaction': 87,
                'retention_rate': 92,
                'productivity_index': 146
            }
        }


class PredictiveAnalytics:
    """Predictive analytics for strategic planning"""
    
    @staticmethod
    async def get_workforce_predictions() -> Dict[str, Any]:
        """Get workforce predictions"""
        return {
            'next_quarter_forecast': {
                'headcount_change': '+12%',
                'skill_requirements': [
                    'Data Analytics',
                    'AI/ML Engineering',
                    'Digital Marketing',
                    'Cybersecurity'
                ],
                'budget_impact': 2400000,
                'confidence': 87
            },
            'annual_projections': {
                'saudization_target': 70,
                'expected_achievement': 68,
                'gap_analysis': 'Need 45 additional Saudi hires',
                'recommended_actions': [
                    'Enhance graduate recruitment program',
                    'Partner with local universities',
                    'Implement mentorship programs'
                ]
            }
        }


@app.route('/')
async def executive_dashboard():
    """Main executive dashboard route"""
    return render_template('executive_dashboard.html')


@app.route('/api/strategic-metrics')
async def get_strategic_metrics():
    """API endpoint for strategic metrics"""
    try:
        metrics = {
            'workforce_roi': await StrategicMetrics.get_workforce_roi(),
            'revenue_per_employee': await StrategicMetrics.get_revenue_per_employee(),
            'saudization_rate': await StrategicMetrics.get_saudization_rate(),
            'strategic_readiness': await StrategicMetrics.get_strategic_readiness()
        }
        return jsonify(metrics)
    except Exception as e:
        logger.error(f"Error fetching strategic metrics: {str(e)}")
        return jsonify({'error': 'Failed to fetch metrics'}), 500


@app.route('/api/vision-2030')
async def get_vision_2030_data():
    """API endpoint for Vision 2030 data"""
    try:
        vision_data = await Vision2030Tracker.get_vision_2030_kpis()
        return jsonify(vision_data)
    except Exception as e:
        logger.error(f"Error fetching Vision 2030 data: {str(e)}")
        return jsonify({'error': 'Failed to fetch Vision 2030 data'}), 500


@app.route('/api/ai-decisions')
async def get_ai_decisions():
    """API endpoint for AI decisions"""
    try:
        decisions = await AIDecisionSummary.get_recent_ai_decisions()
        # Convert datetime objects to strings for JSON serialization
        for decision in decisions:
            decision['timestamp'] = decision['timestamp'].isoformat()
        return jsonify(decisions)
    except Exception as e:
        logger.error(f"Error fetching AI decisions: {str(e)}")
        return jsonify({'error': 'Failed to fetch AI decisions'}), 500


@app.route('/api/board-report')
async def get_board_report():
    """API endpoint for board report"""
    try:
        report = await ExecutiveReports.generate_board_report()
        # Convert datetime objects to strings for JSON serialization
        report['generated_at'] = report['generated_at'].isoformat()
        return jsonify(report)
    except Exception as e:
        logger.error(f"Error generating board report: {str(e)}")
        return jsonify({'error': 'Failed to generate board report'}), 500


@app.route('/api/predictive-analytics')
async def get_predictive_analytics():
    """API endpoint for predictive analytics"""
    try:
        predictions = await PredictiveAnalytics.get_workforce_predictions()
        return jsonify(predictions)
    except Exception as e:
        logger.error(f"Error fetching predictive analytics: {str(e)}")
        return jsonify({'error': 'Failed to fetch predictions'}), 500


@app.route('/api/real-time-updates')
async def get_real_time_updates():
    """API endpoint for real-time updates"""
    try:
        updates = {
            'timestamp': datetime.now().isoformat(),
            'system_status': 'operational',
            'active_users': 1847,
            'ai_processes': 26,
            'government_integrations': 22,
            'recent_activities': [
                {
                    'type': 'ai_decision',
                    'message': 'AI recommended workforce optimization',
                    'timestamp': (datetime.now() - timedelta(minutes=5)).isoformat()
                },
                {
                    'type': 'compliance_update',
                    'message': 'GOSI integration completed successfully',
                    'timestamp': (datetime.now() - timedelta(minutes=12)).isoformat()
                },
                {
                    'type': 'performance_alert',
                    'message': 'Saudization rate improved by 1.2%',
                    'timestamp': (datetime.now() - timedelta(minutes=18)).isoformat()
                }
            ]
        }
        return jsonify(updates)
    except Exception as e:
        logger.error(f"Error fetching real-time updates: {str(e)}")
        return jsonify({'error': 'Failed to fetch updates'}), 500


# HTML Template for Executive Dashboard
EXECUTIVE_DASHBOARD_HTML = """
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AQLHR Executive Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .dashboard-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            color: #2c3e50;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            color: #7f8c8d;
            font-size: 1.2em;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .metric-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
        }
        
        .metric-title {
            font-size: 1.1em;
            color: #2c3e50;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .metric-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #27ae60;
            margin-bottom: 10px;
        }
        
        .metric-change {
            font-size: 0.9em;
            color: #27ae60;
        }
        
        .metric-change.negative {
            color: #e74c3c;
        }
        
        .vision-2030-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .section-title {
            font-size: 1.5em;
            color: #2c3e50;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .kpi-item {
            padding: 15px;
            border-radius: 10px;
            background: #f8f9fa;
            border-left: 4px solid #3498db;
        }
        
        .kpi-name {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .kpi-value {
            font-size: 1.3em;
            font-weight: bold;
            color: #27ae60;
        }
        
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: 10px;
        }
        
        .status-on-track {
            background-color: #27ae60;
        }
        
        .status-needs-improvement {
            background-color: #f39c12;
        }
        
        .status-exceeding {
            background-color: #2ecc71;
        }
        
        .ai-decisions-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .decision-item {
            padding: 15px;
            border-radius: 10px;
            background: #f8f9fa;
            margin-bottom: 15px;
            border-left: 4px solid #9b59b6;
        }
        
        .decision-title {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .decision-impact {
            color: #27ae60;
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .decision-meta {
            font-size: 0.9em;
            color: #7f8c8d;
        }
        
        .confidence-badge {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-left: 10px;
        }
        
        .loading {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
        }
        
        @media (max-width: 768px) {
            .dashboard-container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="header">
            <h1>🏢 AQLHR Executive Dashboard</h1>
            <p class="subtitle">Strategic Intelligence & Vision 2030 Tracking</p>
        </div>
        
        <div class="metrics-grid" id="strategicMetrics">
            <div class="loading">Loading strategic metrics...</div>
        </div>
        
        <div class="vision-2030-section">
            <h2 class="section-title">🇸🇦 Vision 2030 KPIs</h2>
            <div class="kpi-grid" id="vision2030KPIs">
                <div class="loading">Loading Vision 2030 data...</div>
            </div>
        </div>
        
        <div class="ai-decisions-section">
            <h2 class="section-title">🤖 Recent AI Decisions</h2>
            <div id="aiDecisions">
                <div class="loading">Loading AI decisions...</div>
            </div>
        </div>
    </div>

    <script>
        // Fetch and display strategic metrics
        async function loadStrategicMetrics() {
            try {
                const response = await fetch('/api/strategic-metrics');
                const metrics = await response.json();
                
                const container = document.getElementById('strategicMetrics');
                container.innerHTML = `
                    <div class="metric-card">
                        <div class="metric-title">Workforce ROI</div>
                        <div class="metric-value">${metrics.workforce_roi.current_roi}%</div>
                        <div class="metric-change">+${metrics.workforce_roi.change_percentage}% ${metrics.workforce_roi.description}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-title">Revenue per Employee</div>
                        <div class="metric-value">${metrics.revenue_per_employee.current_value.toLocaleString()} ${metrics.revenue_per_employee.currency}</div>
                        <div class="metric-change">${metrics.revenue_per_employee.optimization_percentage}% cost optimized</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-title">Saudization Rate</div>
                        <div class="metric-value">${metrics.saudization_rate.current_rate}%</div>
                        <div class="metric-change">Vision 2030 aligned</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-title">Strategic Readiness</div>
                        <div class="metric-value">${metrics.strategic_readiness.readiness_score}%</div>
                        <div class="metric-change">${metrics.strategic_readiness.compliance_percentage}% compliant</div>
                    </div>
                `;
            } catch (error) {
                console.error('Error loading strategic metrics:', error);
            }
        }
        
        // Fetch and display Vision 2030 KPIs
        async function loadVision2030KPIs() {
            try {
                const response = await fetch('/api/vision-2030');
                const data = await response.json();
                
                const container = document.getElementById('vision2030KPIs');
                let html = '';
                
                for (const [key, kpi] of Object.entries(data.kpis)) {
                    const statusClass = `status-${kpi.status.replace('_', '-')}`;
                    html += `
                        <div class="kpi-item">
                            <div class="kpi-name">${key.replace('_', ' ').toUpperCase()}</div>
                            <div class="kpi-value">${kpi.current}%<span class="status-indicator ${statusClass}"></span></div>
                        </div>
                    `;
                }
                
                container.innerHTML = html;
            } catch (error) {
                console.error('Error loading Vision 2030 KPIs:', error);
            }
        }
        
        // Fetch and display AI decisions
        async function loadAIDecisions() {
            try {
                const response = await fetch('/api/ai-decisions');
                const decisions = await response.json();
                
                const container = document.getElementById('aiDecisions');
                let html = '';
                
                decisions.forEach(decision => {
                    html += `
                        <div class="decision-item">
                            <div class="decision-title">${decision.decision}</div>
                            <div class="decision-impact">${decision.impact}</div>
                            <div class="decision-meta">
                                ${decision.category.toUpperCase()} • ${decision.status.toUpperCase()}
                                <span class="confidence-badge">${decision.confidence}% confidence</span>
                            </div>
                        </div>
                    `;
                });
                
                container.innerHTML = html;
            } catch (error) {
                console.error('Error loading AI decisions:', error);
            }
        }
        
        // Load all data on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadStrategicMetrics();
            loadVision2030KPIs();
            loadAIDecisions();
            
            // Refresh data every 30 seconds
            setInterval(() => {
                loadStrategicMetrics();
                loadVision2030KPIs();
                loadAIDecisions();
            }, 30000);
        });
    </script>
</body>
</html>
"""

# Create templates directory and save HTML template
import os
templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
os.makedirs(templates_dir, exist_ok=True)

with open(os.path.join(templates_dir, 'executive_dashboard.html'), 'w', encoding='utf-8') as f:
    f.write(EXECUTIVE_DASHBOARD_HTML)


if __name__ == '__main__':
    logger.info("Starting AQLHR Executive Dashboard...")
    app.run(host='0.0.0.0', port=5000, debug=True)

