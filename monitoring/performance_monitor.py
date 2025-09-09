#!/usr/bin/env python3
"""
AQLHR Performance Monitoring System
Real-time performance tracking and optimization
"""

import time
import psutil
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
import threading
import logging

class AQLHRPerformanceMonitor:
    def __init__(self, backend_url: str = "https://vgh0i1c1q5qd.manus.space"):
        self.backend_url = backend_url
        self.metrics = {
            'response_times': [],
            'error_rates': [],
            'system_metrics': [],
            'api_health': {},
            'user_sessions': 0,
            'concurrent_users': 0
        }
        self.monitoring_active = False
        self.logger = self._setup_logging()
        
    def _setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('aqlhr_performance.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger('AQLHRMonitor')

    def start_monitoring(self, interval: int = 30):
        """Start continuous performance monitoring"""
        self.monitoring_active = True
        self.logger.info("🚀 Starting AQLHR Performance Monitoring")
        
        # Start monitoring threads
        threading.Thread(target=self._monitor_api_performance, args=(interval,), daemon=True).start()
        threading.Thread(target=self._monitor_system_resources, args=(interval,), daemon=True).start()
        threading.Thread(target=self._monitor_user_activity, args=(interval,), daemon=True).start()
        
        self.logger.info("✅ All monitoring threads started successfully")

    def _monitor_api_performance(self, interval: int):
        """Monitor API endpoint performance"""
        endpoints = [
            '/api/health',
            '/api/ai/status',
            '/api/employees/statistics/summary',
            '/api/vision2030/kpis',
            '/api/gosi/status'
        ]
        
        while self.monitoring_active:
            for endpoint in endpoints:
                try:
                    start_time = time.time()
                    response = requests.get(f"{self.backend_url}{endpoint}", timeout=10)
                    response_time = (time.time() - start_time) * 1000  # Convert to ms
                    
                    self.metrics['response_times'].append({
                        'endpoint': endpoint,
                        'response_time': response_time,
                        'status_code': response.status_code,
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    # Track API health
                    self.metrics['api_health'][endpoint] = {
                        'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                        'response_time': response_time,
                        'last_check': datetime.now().isoformat()
                    }
                    
                    # Log slow responses
                    if response_time > 2000:  # 2 seconds
                        self.logger.warning(f"⚠️ Slow response: {endpoint} took {response_time:.2f}ms")
                    
                    # Log errors
                    if response.status_code >= 400:
                        self.logger.error(f"❌ API Error: {endpoint} returned {response.status_code}")
                        
                except requests.RequestException as e:
                    self.logger.error(f"❌ API Request failed for {endpoint}: {str(e)}")
                    self.metrics['api_health'][endpoint] = {
                        'status': 'error',
                        'error': str(e),
                        'last_check': datetime.now().isoformat()
                    }
                
                time.sleep(1)  # Small delay between endpoint checks
            
            time.sleep(interval)

    def _monitor_system_resources(self, interval: int):
        """Monitor system resource usage"""
        while self.monitoring_active:
            try:
                cpu_percent = psutil.cpu_percent(interval=1)
                memory = psutil.virtual_memory()
                disk = psutil.disk_usage('/')
                
                system_metrics = {
                    'cpu_percent': cpu_percent,
                    'memory_percent': memory.percent,
                    'memory_available_gb': memory.available / (1024**3),
                    'disk_percent': disk.percent,
                    'disk_free_gb': disk.free / (1024**3),
                    'timestamp': datetime.now().isoformat()
                }
                
                self.metrics['system_metrics'].append(system_metrics)
                
                # Alert on high resource usage
                if cpu_percent > 80:
                    self.logger.warning(f"⚠️ High CPU usage: {cpu_percent:.1f}%")
                if memory.percent > 85:
                    self.logger.warning(f"⚠️ High memory usage: {memory.percent:.1f}%")
                if disk.percent > 90:
                    self.logger.warning(f"⚠️ High disk usage: {disk.percent:.1f}%")
                
                # Keep only last 100 entries
                if len(self.metrics['system_metrics']) > 100:
                    self.metrics['system_metrics'] = self.metrics['system_metrics'][-100:]
                    
            except Exception as e:
                self.logger.error(f"❌ System monitoring error: {str(e)}")
            
            time.sleep(interval)

    def _monitor_user_activity(self, interval: int):
        """Monitor user activity and sessions"""
        while self.monitoring_active:
            try:
                # Simulate user activity monitoring
                # In production, this would connect to actual user analytics
                self.metrics['user_sessions'] += 1
                self.metrics['concurrent_users'] = max(1, self.metrics['concurrent_users'] + (-1 if time.time() % 2 else 1))
                
                self.logger.info(f"📊 Active users: {self.metrics['concurrent_users']}, Total sessions: {self.metrics['user_sessions']}")
                
            except Exception as e:
                self.logger.error(f"❌ User activity monitoring error: {str(e)}")
            
            time.sleep(interval * 2)  # Check less frequently

    def get_performance_report(self) -> Dict[str, Any]:
        """Generate comprehensive performance report"""
        if not self.metrics['response_times']:
            return {'error': 'No performance data available'}
        
        # Calculate average response times
        avg_response_times = {}
        for metric in self.metrics['response_times'][-50:]:  # Last 50 requests
            endpoint = metric['endpoint']
            if endpoint not in avg_response_times:
                avg_response_times[endpoint] = []
            avg_response_times[endpoint].append(metric['response_time'])
        
        for endpoint in avg_response_times:
            avg_response_times[endpoint] = sum(avg_response_times[endpoint]) / len(avg_response_times[endpoint])
        
        # Get latest system metrics
        latest_system = self.metrics['system_metrics'][-1] if self.metrics['system_metrics'] else {}
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'api_performance': {
                'average_response_times_ms': avg_response_times,
                'api_health_status': self.metrics['api_health'],
                'total_requests': len(self.metrics['response_times'])
            },
            'system_performance': latest_system,
            'user_activity': {
                'concurrent_users': self.metrics['concurrent_users'],
                'total_sessions': self.metrics['user_sessions']
            },
            'recommendations': self._generate_recommendations()
        }
        
        return report

    def _generate_recommendations(self) -> List[str]:
        """Generate performance optimization recommendations"""
        recommendations = []
        
        # Check API response times
        if self.metrics['response_times']:
            recent_times = [m['response_time'] for m in self.metrics['response_times'][-20:]]
            avg_time = sum(recent_times) / len(recent_times)
            
            if avg_time > 1000:
                recommendations.append("🔧 API response times are slow. Consider implementing caching.")
            if avg_time > 2000:
                recommendations.append("🚨 Critical: API response times exceed 2 seconds. Immediate optimization needed.")
        
        # Check system resources
        if self.metrics['system_metrics']:
            latest = self.metrics['system_metrics'][-1]
            if latest.get('cpu_percent', 0) > 70:
                recommendations.append("⚡ High CPU usage detected. Consider scaling or optimization.")
            if latest.get('memory_percent', 0) > 80:
                recommendations.append("💾 High memory usage. Consider memory optimization or scaling.")
        
        # Check API health
        unhealthy_apis = [ep for ep, health in self.metrics['api_health'].items() 
                         if health.get('status') != 'healthy']
        if unhealthy_apis:
            recommendations.append(f"🏥 Unhealthy APIs detected: {', '.join(unhealthy_apis)}")
        
        if not recommendations:
            recommendations.append("✅ All systems performing optimally!")
        
        return recommendations

    def optimize_performance(self):
        """Apply automatic performance optimizations"""
        self.logger.info("🔧 Starting automatic performance optimization...")
        
        optimizations_applied = []
        
        # Clear old metrics to free memory
        if len(self.metrics['response_times']) > 1000:
            self.metrics['response_times'] = self.metrics['response_times'][-500:]
            optimizations_applied.append("Cleared old response time metrics")
        
        if len(self.metrics['system_metrics']) > 200:
            self.metrics['system_metrics'] = self.metrics['system_metrics'][-100:]
            optimizations_applied.append("Cleared old system metrics")
        
        # Log optimizations
        for optimization in optimizations_applied:
            self.logger.info(f"✅ Applied: {optimization}")
        
        if not optimizations_applied:
            self.logger.info("ℹ️ No optimizations needed at this time")
        
        return optimizations_applied

    def stop_monitoring(self):
        """Stop performance monitoring"""
        self.monitoring_active = False
        self.logger.info("🛑 Performance monitoring stopped")

    def export_metrics(self, filename: str = None):
        """Export metrics to JSON file"""
        if not filename:
            filename = f"aqlhr_metrics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(filename, 'w') as f:
            json.dump(self.metrics, f, indent=2, default=str)
        
        self.logger.info(f"📊 Metrics exported to {filename}")
        return filename

if __name__ == "__main__":
    # Initialize and start monitoring
    monitor = AQLHRPerformanceMonitor()
    
    try:
        monitor.start_monitoring(interval=30)
        
        # Run for demonstration
        time.sleep(120)  # Monitor for 2 minutes
        
        # Generate and display report
        report = monitor.get_performance_report()
        print("\n" + "="*50)
        print("AQLHR PERFORMANCE REPORT")
        print("="*50)
        print(json.dumps(report, indent=2, default=str))
        
        # Apply optimizations
        monitor.optimize_performance()
        
        # Export metrics
        monitor.export_metrics()
        
    except KeyboardInterrupt:
        print("\n🛑 Monitoring stopped by user")
    finally:
        monitor.stop_monitoring()
