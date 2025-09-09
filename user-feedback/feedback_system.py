#!/usr/bin/env python3
"""
AQLHR User Feedback Loop System
Comprehensive feedback collection, analysis, and improvement implementation
"""

import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import uuid
from dataclasses import dataclass, asdict
from enum import Enum
import logging

class FeedbackType(Enum):
    BUG_REPORT = "bug_report"
    FEATURE_REQUEST = "feature_request"
    USABILITY_ISSUE = "usability_issue"
    PERFORMANCE_ISSUE = "performance_issue"
    GENERAL_FEEDBACK = "general_feedback"
    SATISFACTION_SURVEY = "satisfaction_survey"

class FeedbackPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class FeedbackStatus(Enum):
    NEW = "new"
    IN_REVIEW = "in_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

@dataclass
class UserFeedback:
    id: str
    user_id: str
    user_role: str
    feedback_type: FeedbackType
    title: str
    description: str
    priority: FeedbackPriority
    status: FeedbackStatus
    module: str  # Which AQLHR module (Executive Center, HR Core, etc.)
    created_at: datetime
    updated_at: datetime
    resolution: Optional[str] = None
    assigned_to: Optional[str] = None
    tags: List[str] = None
    satisfaction_rating: Optional[int] = None  # 1-5 scale
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []

class AQLHRFeedbackSystem:
    def __init__(self, db_path: str = "aqlhr_feedback.db"):
        self.db_path = db_path
        self.logger = self._setup_logging()
        self._init_database()
        
    def _setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('aqlhr_feedback.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger('AQLHRFeedback')

    def _init_database(self):
        """Initialize SQLite database for feedback storage"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS feedback (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    user_role TEXT NOT NULL,
                    feedback_type TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    priority TEXT NOT NULL,
                    status TEXT NOT NULL,
                    module TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    resolution TEXT,
                    assigned_to TEXT,
                    tags TEXT,
                    satisfaction_rating INTEGER
                )
            ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS feedback_analytics (
                    id TEXT PRIMARY KEY,
                    metric_name TEXT NOT NULL,
                    metric_value TEXT NOT NULL,
                    calculated_at TEXT NOT NULL
                )
            ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS improvement_actions (
                    id TEXT PRIMARY KEY,
                    feedback_id TEXT NOT NULL,
                    action_description TEXT NOT NULL,
                    action_type TEXT NOT NULL,
                    priority TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    completed_at TEXT,
                    FOREIGN KEY (feedback_id) REFERENCES feedback (id)
                )
            ''')
            
            conn.commit()
            self.logger.info("✅ Database initialized successfully")

    def submit_feedback(self, feedback: UserFeedback) -> str:
        """Submit new user feedback"""
        feedback.id = str(uuid.uuid4())
        feedback.created_at = datetime.now()
        feedback.updated_at = datetime.now()
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                INSERT INTO feedback (
                    id, user_id, user_role, feedback_type, title, description,
                    priority, status, module, created_at, updated_at,
                    resolution, assigned_to, tags, satisfaction_rating
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                feedback.id, feedback.user_id, feedback.user_role,
                feedback.feedback_type.value, feedback.title, feedback.description,
                feedback.priority.value, feedback.status.value, feedback.module,
                feedback.created_at.isoformat(), feedback.updated_at.isoformat(),
                feedback.resolution, feedback.assigned_to,
                json.dumps(feedback.tags), feedback.satisfaction_rating
            ))
            conn.commit()
        
        self.logger.info(f"📝 New feedback submitted: {feedback.title} (ID: {feedback.id})")
        
        # Auto-assign priority based on feedback type and content
        self._auto_prioritize_feedback(feedback.id)
        
        return feedback.id

    def _auto_prioritize_feedback(self, feedback_id: str):
        """Automatically prioritize feedback based on content analysis"""
        feedback = self.get_feedback(feedback_id)
        if not feedback:
            return
        
        # Critical keywords that indicate high priority
        critical_keywords = ['crash', 'error', 'broken', 'not working', 'urgent', 'critical']
        high_keywords = ['slow', 'performance', 'security', 'data loss', 'important']
        
        description_lower = feedback.description.lower()
        title_lower = feedback.title.lower()
        
        new_priority = feedback.priority
        
        if any(keyword in description_lower or keyword in title_lower for keyword in critical_keywords):
            new_priority = FeedbackPriority.CRITICAL
        elif any(keyword in description_lower or keyword in title_lower for keyword in high_keywords):
            new_priority = FeedbackPriority.HIGH
        elif feedback.feedback_type == FeedbackType.BUG_REPORT:
            new_priority = FeedbackPriority.HIGH
        elif feedback.feedback_type == FeedbackType.PERFORMANCE_ISSUE:
            new_priority = FeedbackPriority.MEDIUM
        
        if new_priority != feedback.priority:
            self.update_feedback_priority(feedback_id, new_priority)
            self.logger.info(f"🔄 Auto-prioritized feedback {feedback_id} to {new_priority.value}")

    def get_feedback(self, feedback_id: str) -> Optional[UserFeedback]:
        """Retrieve specific feedback by ID"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                'SELECT * FROM feedback WHERE id = ?', (feedback_id,)
            )
            row = cursor.fetchone()
            
            if row:
                return UserFeedback(
                    id=row[0], user_id=row[1], user_role=row[2],
                    feedback_type=FeedbackType(row[3]), title=row[4],
                    description=row[5], priority=FeedbackPriority(row[6]),
                    status=FeedbackStatus(row[7]), module=row[8],
                    created_at=datetime.fromisoformat(row[9]),
                    updated_at=datetime.fromisoformat(row[10]),
                    resolution=row[11], assigned_to=row[12],
                    tags=json.loads(row[13]) if row[13] else [],
                    satisfaction_rating=row[14]
                )
        return None

    def get_feedback_list(self, 
                         status: Optional[FeedbackStatus] = None,
                         priority: Optional[FeedbackPriority] = None,
                         module: Optional[str] = None,
                         limit: int = 50) -> List[UserFeedback]:
        """Get list of feedback with optional filters"""
        query = 'SELECT * FROM feedback WHERE 1=1'
        params = []
        
        if status:
            query += ' AND status = ?'
            params.append(status.value)
        
        if priority:
            query += ' AND priority = ?'
            params.append(priority.value)
            
        if module:
            query += ' AND module = ?'
            params.append(module)
        
        query += ' ORDER BY created_at DESC LIMIT ?'
        params.append(limit)
        
        feedback_list = []
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(query, params)
            for row in cursor.fetchall():
                feedback_list.append(UserFeedback(
                    id=row[0], user_id=row[1], user_role=row[2],
                    feedback_type=FeedbackType(row[3]), title=row[4],
                    description=row[5], priority=FeedbackPriority(row[6]),
                    status=FeedbackStatus(row[7]), module=row[8],
                    created_at=datetime.fromisoformat(row[9]),
                    updated_at=datetime.fromisoformat(row[10]),
                    resolution=row[11], assigned_to=row[12],
                    tags=json.loads(row[13]) if row[13] else [],
                    satisfaction_rating=row[14]
                ))
        
        return feedback_list

    def update_feedback_status(self, feedback_id: str, status: FeedbackStatus, resolution: str = None):
        """Update feedback status and resolution"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                UPDATE feedback 
                SET status = ?, resolution = ?, updated_at = ?
                WHERE id = ?
            ''', (status.value, resolution, datetime.now().isoformat(), feedback_id))
            conn.commit()
        
        self.logger.info(f"🔄 Updated feedback {feedback_id} status to {status.value}")

    def update_feedback_priority(self, feedback_id: str, priority: FeedbackPriority):
        """Update feedback priority"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                UPDATE feedback 
                SET priority = ?, updated_at = ?
                WHERE id = ?
            ''', (priority.value, datetime.now().isoformat(), feedback_id))
            conn.commit()

    def assign_feedback(self, feedback_id: str, assigned_to: str):
        """Assign feedback to a team member"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                UPDATE feedback 
                SET assigned_to = ?, updated_at = ?
                WHERE id = ?
            ''', (assigned_to, datetime.now().isoformat(), feedback_id))
            conn.commit()
        
        self.logger.info(f"👤 Assigned feedback {feedback_id} to {assigned_to}")

    def generate_feedback_analytics(self) -> Dict[str, Any]:
        """Generate comprehensive feedback analytics"""
        with sqlite3.connect(self.db_path) as conn:
            # Total feedback count
            total_feedback = conn.execute('SELECT COUNT(*) FROM feedback').fetchone()[0]
            
            # Feedback by type
            type_stats = {}
            cursor = conn.execute('SELECT feedback_type, COUNT(*) FROM feedback GROUP BY feedback_type')
            for row in cursor.fetchall():
                type_stats[row[0]] = row[1]
            
            # Feedback by status
            status_stats = {}
            cursor = conn.execute('SELECT status, COUNT(*) FROM feedback GROUP BY status')
            for row in cursor.fetchall():
                status_stats[row[0]] = row[1]
            
            # Feedback by priority
            priority_stats = {}
            cursor = conn.execute('SELECT priority, COUNT(*) FROM feedback GROUP BY priority')
            for row in cursor.fetchall():
                priority_stats[row[0]] = row[1]
            
            # Feedback by module
            module_stats = {}
            cursor = conn.execute('SELECT module, COUNT(*) FROM feedback GROUP BY module')
            for row in cursor.fetchall():
                module_stats[row[0]] = row[1]
            
            # Average satisfaction rating
            avg_satisfaction = conn.execute(
                'SELECT AVG(satisfaction_rating) FROM feedback WHERE satisfaction_rating IS NOT NULL'
            ).fetchone()[0] or 0
            
            # Recent feedback trends (last 30 days)
            thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
            recent_feedback = conn.execute(
                'SELECT COUNT(*) FROM feedback WHERE created_at >= ?', (thirty_days_ago,)
            ).fetchone()[0]
            
            # Resolution time analysis
            resolved_feedback = conn.execute('''
                SELECT AVG(julianday(updated_at) - julianday(created_at)) * 24 as avg_hours
                FROM feedback WHERE status = 'resolved'
            ''').fetchone()[0] or 0
        
        analytics = {
            'total_feedback': total_feedback,
            'feedback_by_type': type_stats,
            'feedback_by_status': status_stats,
            'feedback_by_priority': priority_stats,
            'feedback_by_module': module_stats,
            'average_satisfaction_rating': round(avg_satisfaction, 2),
            'recent_feedback_30_days': recent_feedback,
            'average_resolution_time_hours': round(resolved_feedback, 2),
            'generated_at': datetime.now().isoformat()
        }
        
        # Store analytics
        analytics_id = str(uuid.uuid4())
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                INSERT INTO feedback_analytics (id, metric_name, metric_value, calculated_at)
                VALUES (?, ?, ?, ?)
            ''', (analytics_id, 'comprehensive_analytics', json.dumps(analytics), datetime.now().isoformat()))
            conn.commit()
        
        return analytics

    def generate_improvement_recommendations(self) -> List[Dict[str, Any]]:
        """Generate actionable improvement recommendations based on feedback"""
        analytics = self.generate_feedback_analytics()
        recommendations = []
        
        # High priority issues
        if analytics['feedback_by_priority'].get('critical', 0) > 0:
            recommendations.append({
                'priority': 'critical',
                'category': 'bug_fixes',
                'title': 'Address Critical Issues Immediately',
                'description': f"There are {analytics['feedback_by_priority']['critical']} critical issues that need immediate attention.",
                'action_items': [
                    'Review all critical feedback within 24 hours',
                    'Assign dedicated resources to critical bug fixes',
                    'Implement emergency patches if necessary'
                ]
            })
        
        # Performance issues
        performance_issues = analytics['feedback_by_type'].get('performance_issue', 0)
        if performance_issues > 5:
            recommendations.append({
                'priority': 'high',
                'category': 'performance',
                'title': 'Performance Optimization Required',
                'description': f"Multiple performance issues reported ({performance_issues} total).",
                'action_items': [
                    'Conduct comprehensive performance audit',
                    'Implement caching strategies',
                    'Optimize database queries',
                    'Consider infrastructure scaling'
                ]
            })
        
        # User satisfaction
        if analytics['average_satisfaction_rating'] < 3.5:
            recommendations.append({
                'priority': 'high',
                'category': 'user_experience',
                'title': 'Improve User Satisfaction',
                'description': f"Average satisfaction rating is {analytics['average_satisfaction_rating']}/5.0.",
                'action_items': [
                    'Conduct user experience research',
                    'Implement UI/UX improvements',
                    'Provide better user training',
                    'Enhance documentation'
                ]
            })
        
        # Feature requests
        feature_requests = analytics['feedback_by_type'].get('feature_request', 0)
        if feature_requests > 10:
            recommendations.append({
                'priority': 'medium',
                'category': 'features',
                'title': 'Evaluate Popular Feature Requests',
                'description': f"There are {feature_requests} feature requests to evaluate.",
                'action_items': [
                    'Prioritize feature requests by user impact',
                    'Create feature development roadmap',
                    'Communicate planned features to users'
                ]
            })
        
        # Resolution time
        if analytics['average_resolution_time_hours'] > 72:
            recommendations.append({
                'priority': 'medium',
                'category': 'process',
                'title': 'Improve Response Time',
                'description': f"Average resolution time is {analytics['average_resolution_time_hours']} hours.",
                'action_items': [
                    'Implement automated triage system',
                    'Increase support team capacity',
                    'Create self-service resources'
                ]
            })
        
        return recommendations

    def create_improvement_action(self, feedback_id: str, action_description: str, 
                                action_type: str, priority: str) -> str:
        """Create an improvement action based on feedback"""
        action_id = str(uuid.uuid4())
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                INSERT INTO improvement_actions (
                    id, feedback_id, action_description, action_type,
                    priority, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                action_id, feedback_id, action_description, action_type,
                priority, 'planned', datetime.now().isoformat()
            ))
            conn.commit()
        
        self.logger.info(f"📋 Created improvement action: {action_description}")
        return action_id

    def export_feedback_report(self, filename: str = None) -> str:
        """Export comprehensive feedback report"""
        if not filename:
            filename = f"aqlhr_feedback_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        analytics = self.generate_feedback_analytics()
        recommendations = self.generate_improvement_recommendations()
        recent_feedback = self.get_feedback_list(limit=100)
        
        report = {
            'report_generated_at': datetime.now().isoformat(),
            'analytics': analytics,
            'recommendations': recommendations,
            'recent_feedback': [asdict(fb) for fb in recent_feedback],
            'summary': {
                'total_feedback': analytics['total_feedback'],
                'satisfaction_score': analytics['average_satisfaction_rating'],
                'critical_issues': analytics['feedback_by_priority'].get('critical', 0),
                'pending_resolution': analytics['feedback_by_status'].get('new', 0) + 
                                   analytics['feedback_by_status'].get('in_progress', 0)
            }
        }
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        self.logger.info(f"📊 Feedback report exported to {filename}")
        return filename

# Example usage and testing
if __name__ == "__main__":
    # Initialize feedback system
    feedback_system = AQLHRFeedbackSystem()
    
    # Sample feedback submissions
    sample_feedback = [
        UserFeedback(
            id="", user_id="user_001", user_role="HR_MANAGER",
            feedback_type=FeedbackType.BUG_REPORT,
            title="Executive Dashboard Loading Issue",
            description="The Executive Intelligence Center takes too long to load employee statistics. Sometimes it shows an error.",
            priority=FeedbackPriority.MEDIUM,
            status=FeedbackStatus.NEW,
            module="Executive Intelligence Center",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            satisfaction_rating=2
        ),
        UserFeedback(
            id="", user_id="user_002", user_role="EXECUTIVE",
            feedback_type=FeedbackType.FEATURE_REQUEST,
            title="Arabic Language Support Enhancement",
            description="Need better Arabic language support in AI insights and reports generation.",
            priority=FeedbackPriority.HIGH,
            status=FeedbackStatus.NEW,
            module="AI Orchestration",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            satisfaction_rating=4
        ),
        UserFeedback(
            id="", user_id="user_003", user_role="EMPLOYEE",
            feedback_type=FeedbackType.USABILITY_ISSUE,
            title="Government Integration Status Unclear",
            description="It's not clear when GOSI integration is working or not. Need better status indicators.",
            priority=FeedbackPriority.MEDIUM,
            status=FeedbackStatus.NEW,
            module="Government Integrations",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            satisfaction_rating=3
        )
    ]
    
    # Submit sample feedback
    for feedback in sample_feedback:
        feedback_id = feedback_system.submit_feedback(feedback)
        print(f"✅ Submitted feedback: {feedback_id}")
    
    # Generate analytics
    analytics = feedback_system.generate_feedback_analytics()
    print("\n📊 FEEDBACK ANALYTICS:")
    print(json.dumps(analytics, indent=2, default=str))
    
    # Generate recommendations
    recommendations = feedback_system.generate_improvement_recommendations()
    print("\n🔧 IMPROVEMENT RECOMMENDATIONS:")
    for rec in recommendations:
        print(f"- {rec['title']} ({rec['priority']})")
        print(f"  {rec['description']}")
    
    # Export report
    report_file = feedback_system.export_feedback_report()
    print(f"\n📋 Report exported: {report_file}")
