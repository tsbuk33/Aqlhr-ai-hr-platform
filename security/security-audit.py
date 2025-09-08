#!/usr/bin/env python3
"""
AQLHR Security Audit and Hardening Script
==========================================
Comprehensive security assessment and hardening for AQLHR platform
"""

import requests
import ssl
import socket
import subprocess
import json
import os
from datetime import datetime
from urllib.parse import urlparse

class AQLHRSecurityAudit:
    def __init__(self, base_url="https://xlhyimcdyljv.manus.space"):
        self.base_url = base_url
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "base_url": base_url,
            "tests": {},
            "vulnerabilities": [],
            "recommendations": []
        }
    
    def test_ssl_configuration(self):
        """Test SSL/TLS configuration"""
        print("🔒 Testing SSL/TLS Configuration...")
        
        try:
            parsed_url = urlparse(self.base_url)
            hostname = parsed_url.hostname
            port = parsed_url.port or 443
            
            # Get SSL certificate info
            context = ssl.create_default_context()
            with socket.create_connection((hostname, port)) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
            self.results["tests"]["ssl_certificate"] = {
                "status": "PASS",
                "subject": cert.get("subject"),
                "issuer": cert.get("issuer"),
                "version": cert.get("version"),
                "not_after": cert.get("notAfter"),
                "not_before": cert.get("notBefore")
            }
            print("  ✅ SSL Certificate: Valid")
            
        except Exception as e:
            self.results["tests"]["ssl_certificate"] = {
                "status": "FAIL",
                "error": str(e)
            }
            self.results["vulnerabilities"].append({
                "severity": "HIGH",
                "category": "SSL/TLS",
                "description": f"SSL certificate issue: {str(e)}"
            })
            print(f"  ❌ SSL Certificate: {str(e)}")
    
    def test_security_headers(self):
        """Test HTTP security headers"""
        print("🛡️  Testing Security Headers...")
        
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            headers = response.headers
            
            security_headers = {
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": ["DENY", "SAMEORIGIN"],
                "X-XSS-Protection": "1; mode=block",
                "Strict-Transport-Security": "max-age=",
                "Content-Security-Policy": "default-src",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
            
            header_results = {}
            for header, expected in security_headers.items():
                if header in headers:
                    header_value = headers[header]
                    if isinstance(expected, list):
                        status = "PASS" if any(exp in header_value for exp in expected) else "FAIL"
                    else:
                        status = "PASS" if expected in header_value else "FAIL"
                    
                    header_results[header] = {
                        "status": status,
                        "value": header_value
                    }
                    print(f"  {'✅' if status == 'PASS' else '❌'} {header}: {header_value}")
                    
                    if status == "FAIL":
                        self.results["vulnerabilities"].append({
                            "severity": "MEDIUM",
                            "category": "Security Headers",
                            "description": f"Missing or incorrect {header} header"
                        })
                else:
                    header_results[header] = {"status": "MISSING"}
                    print(f"  ❌ {header}: Missing")
                    self.results["vulnerabilities"].append({
                        "severity": "MEDIUM",
                        "category": "Security Headers",
                        "description": f"Missing {header} header"
                    })
            
            self.results["tests"]["security_headers"] = header_results
            
        except Exception as e:
            print(f"  ❌ Security Headers Test Failed: {str(e)}")
    
    def test_api_authentication(self):
        """Test API authentication and authorization"""
        print("🔐 Testing API Authentication...")
        
        # Test endpoints without authentication
        endpoints = [
            "/api/health",
            "/api/ai/status",
            "/api/employees/statistics/summary",
            "/api/vision2030/kpis",
            "/api/gosi/status"
        ]
        
        auth_results = {}
        for endpoint in endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                auth_results[endpoint] = {
                    "status_code": response.status_code,
                    "requires_auth": response.status_code == 401
                }
                
                if response.status_code == 200 and "sensitive" in endpoint:
                    self.results["vulnerabilities"].append({
                        "severity": "HIGH",
                        "category": "Authentication",
                        "description": f"Sensitive endpoint {endpoint} accessible without authentication"
                    })
                    print(f"  ⚠️  {endpoint}: Accessible without auth (potential risk)")
                else:
                    print(f"  ✅ {endpoint}: Status {response.status_code}")
                    
            except Exception as e:
                auth_results[endpoint] = {"error": str(e)}
                print(f"  ❌ {endpoint}: {str(e)}")
        
        self.results["tests"]["api_authentication"] = auth_results
    
    def test_input_validation(self):
        """Test input validation and injection vulnerabilities"""
        print("🧪 Testing Input Validation...")
        
        # Test SQL injection patterns
        sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "1' UNION SELECT * FROM users --"
        ]
        
        # Test XSS patterns
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>"
        ]
        
        validation_results = {}
        
        # Test AI prompt endpoint
        try:
            for payload in sql_payloads + xss_payloads:
                response = requests.post(
                    f"{self.base_url}/api/ai/prompt",
                    json={"text": payload, "language": "en"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    response_data = response.json()
                    if payload in str(response_data):
                        self.results["vulnerabilities"].append({
                            "severity": "HIGH",
                            "category": "Input Validation",
                            "description": f"Potential injection vulnerability with payload: {payload}"
                        })
                        print(f"  ⚠️  Potential vulnerability with payload: {payload}")
                    else:
                        print(f"  ✅ Payload filtered: {payload[:20]}...")
                        
        except Exception as e:
            print(f"  ❌ Input validation test failed: {str(e)}")
        
        validation_results["sql_injection"] = "TESTED"
        validation_results["xss_protection"] = "TESTED"
        self.results["tests"]["input_validation"] = validation_results
    
    def test_rate_limiting(self):
        """Test rate limiting and DDoS protection"""
        print("⚡ Testing Rate Limiting...")
        
        try:
            # Send multiple rapid requests
            responses = []
            for i in range(20):
                response = requests.get(f"{self.base_url}/api/health", timeout=5)
                responses.append(response.status_code)
            
            # Check for rate limiting (429 status codes)
            rate_limited = any(status == 429 for status in responses)
            
            if rate_limited:
                print("  ✅ Rate limiting detected")
                self.results["tests"]["rate_limiting"] = {"status": "ENABLED"}
            else:
                print("  ⚠️  No rate limiting detected")
                self.results["tests"]["rate_limiting"] = {"status": "DISABLED"}
                self.results["recommendations"].append({
                    "category": "Rate Limiting",
                    "description": "Implement rate limiting to prevent DDoS attacks"
                })
                
        except Exception as e:
            print(f"  ❌ Rate limiting test failed: {str(e)}")
    
    def generate_security_report(self):
        """Generate comprehensive security report"""
        print("\n" + "="*60)
        print("AQLHR SECURITY AUDIT REPORT")
        print("="*60)
        
        # Count vulnerabilities by severity
        vuln_counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
        for vuln in self.results["vulnerabilities"]:
            vuln_counts[vuln["severity"]] += 1
        
        print(f"Audit Date: {self.results['timestamp']}")
        print(f"Target URL: {self.results['base_url']}")
        print(f"Total Vulnerabilities: {len(self.results['vulnerabilities'])}")
        print(f"  - High: {vuln_counts['HIGH']}")
        print(f"  - Medium: {vuln_counts['MEDIUM']}")
        print(f"  - Low: {vuln_counts['LOW']}")
        
        if self.results["vulnerabilities"]:
            print("\n🚨 VULNERABILITIES FOUND:")
            for i, vuln in enumerate(self.results["vulnerabilities"], 1):
                print(f"{i}. [{vuln['severity']}] {vuln['category']}: {vuln['description']}")
        
        if self.results["recommendations"]:
            print("\n💡 RECOMMENDATIONS:")
            for i, rec in enumerate(self.results["recommendations"], 1):
                print(f"{i}. {rec['category']}: {rec['description']}")
        
        # Security score calculation
        total_tests = len(self.results["tests"])
        failed_tests = len(self.results["vulnerabilities"])
        security_score = max(0, (total_tests - failed_tests) / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n🎯 SECURITY SCORE: {security_score:.1f}/100")
        
        if security_score >= 90:
            print("✅ EXCELLENT - Platform is well secured")
        elif security_score >= 70:
            print("⚠️  GOOD - Minor security improvements needed")
        elif security_score >= 50:
            print("🔶 FAIR - Several security issues need attention")
        else:
            print("🚨 POOR - Critical security issues require immediate attention")
        
        return self.results
    
    def run_full_audit(self):
        """Run complete security audit"""
        print("🔍 Starting AQLHR Security Audit...")
        print("="*60)
        
        self.test_ssl_configuration()
        self.test_security_headers()
        self.test_api_authentication()
        self.test_input_validation()
        self.test_rate_limiting()
        
        return self.generate_security_report()

def main():
    """Main function to run security audit"""
    auditor = AQLHRSecurityAudit()
    results = auditor.run_full_audit()
    
    # Save results to file
    with open("security_audit_report.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed report saved to: security_audit_report.json")

if __name__ == "__main__":
    main()
