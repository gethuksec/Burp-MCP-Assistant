import * as vscode from 'vscode';

export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    mcpTool: string;
    template: string;
    parameters: PromptParameter[];
    examples: string[];
    tags: string[];
}

export interface PromptParameter {
    name: string;
    type: 'string' | 'number' | 'url' | 'json' | 'select';
    required: boolean;
    description: string;
    default?: any;
    options?: string[];
    validation?: string;
}

export class PromptLibrary {
    private context: vscode.ExtensionContext;
    private prompts: PromptTemplate[] = [];

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.initializePrompts();
    }

    private initializePrompts(): void {
        this.prompts = [
            // ═══════════════════════════════════════════════════════════
            // INPUT VALIDATION (35 prompts)
            // ═══════════════════════════════════════════════════════════
            
            // SQL Injection (10 prompts)
            {
                id: 'sql-injection-basic',
                name: 'SQL Injection Basic Test',
                description: 'Test endpoint for SQL injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Send HTTP/1.1 {{method}} request to {{url}}\nTest parameter {{parameter}} with SQL injection payloads',
                parameters: [
                    {
                        name: 'url',
                        type: 'url',
                        required: true,
                        description: 'Target URL to test'
                    },
                    {
                        name: 'method',
                        type: 'select',
                        required: true,
                        description: 'HTTP method',
                        options: ['GET', 'POST', 'PUT', 'DELETE']
                    },
                    {
                        name: 'parameter',
                        type: 'string',
                        required: true,
                        description: 'Parameter name to test'
                    }
                ],
                examples: ['Test /api/users?id=1 for SQL injection on id parameter'],
                tags: ['sqli', 'injection', 'database', 'owasp-top-10']
            },
            // XSS Testing
            {
                id: 'xss-reflected',
                name: 'Reflected XSS Test',
                description: 'Test for reflected cross-site scripting vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Test {{url}} for reflected XSS in parameter {{parameter}}',
                parameters: [
                    {
                        name: 'url',
                        type: 'url',
                        required: true,
                        description: 'Target URL'
                    },
                    {
                        name: 'parameter',
                        type: 'string',
                        required: true,
                        description: 'Parameter to inject payload'
                    }
                ],
                examples: ['Test /search?q= for reflected XSS'],
                tags: ['xss', 'injection', 'client-side', 'owasp-top-10']
            },
            // Authentication Testing
            {
                id: 'auth-bypass',
                name: 'Authentication Bypass Test',
                description: 'Test for authentication bypass vulnerabilities',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Test {{endpoint}} for authentication bypass',
                parameters: [
                    {
                        name: 'endpoint',
                        type: 'url',
                        required: true,
                        description: 'Protected endpoint URL'
                    }
                ],
                examples: ['Test /admin for authentication bypass'],
                tags: ['auth', 'bypass', 'broken-authentication']
            },
            // IDOR Testing
            {
                id: 'idor-test',
                name: 'IDOR Vulnerability Test',
                description: 'Test for Insecure Direct Object Reference',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Test {{endpoint}} for IDOR by changing {{parameter}}',
                parameters: [
                    {
                        name: 'endpoint',
                        type: 'url',
                        required: true,
                        description: 'API endpoint with object ID'
                    },
                    {
                        name: 'parameter',
                        type: 'string',
                        required: true,
                        description: 'ID parameter name'
                    }
                ],
                examples: ['Test /api/user/123 for IDOR'],
                tags: ['idor', 'authorization', 'broken-access-control']
            },
            // API Testing
            {
                id: 'api-comprehensive',
                name: 'Comprehensive API Security Test',
                description: 'Perform multiple security tests on an API endpoint',
                category: 'API Security',
                mcpTool: 'multiple',
                template: 'Execute comprehensive security testing on {{endpoint}}',
                parameters: [
                    {
                        name: 'endpoint',
                        type: 'url',
                        required: true,
                        description: 'API endpoint to test'
                    },
                    {
                        name: 'auth_token',
                        type: 'string',
                        required: false,
                        description: 'Authentication token (if required)'
                    }
                ],
                examples: ['Comprehensive test of /api/v1/users endpoint'],
                tags: ['api', 'comprehensive', 'automation']
            },
            // SSRF Testing
            {
                id: 'ssrf-test',
                name: 'SSRF Vulnerability Test',
                description: 'Test for Server-Side Request Forgery',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Test {{endpoint}} for SSRF in parameter {{parameter}}',
                parameters: [
                    {
                        name: 'endpoint',
                        type: 'url',
                        required: true,
                        description: 'Endpoint that makes external requests'
                    },
                    {
                        name: 'parameter',
                        type: 'string',
                        required: true,
                        description: 'Parameter accepting URLs'
                    }
                ],
                examples: ['Test /api/fetch?url= for SSRF'],
                tags: ['ssrf', 'injection', 'server-side']
            },
            // JWT Testing
            {
                id: 'jwt-manipulation',
                name: 'JWT Token Manipulation',
                description: 'Test JWT token for common vulnerabilities',
                category: 'Authentication & Session',
                mcpTool: 'base64_decode',
                template: 'Decode and analyze JWT token from {{source}}',
                parameters: [
                    {
                        name: 'source',
                        type: 'string',
                        required: true,
                        description: 'Source of JWT token (header/cookie)'
                    }
                ],
                examples: ['Analyze JWT from Authorization header'],
                tags: ['jwt', 'token', 'auth', 'crypto']
            },
            // Path Traversal
            {
                id: 'path-traversal',
                name: 'Path Traversal Test',
                description: 'Test for directory traversal vulnerabilities',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Test {{endpoint}} for path traversal in {{parameter}}',
                parameters: [
                    {
                        name: 'endpoint',
                        type: 'url',
                        required: true,
                        description: 'File access endpoint'
                    },
                    {
                        name: 'parameter',
                        type: 'string',
                        required: true,
                        description: 'File path parameter'
                    }
                ],
                examples: ['Test /download?file= for path traversal'],
                tags: ['path-traversal', 'lfi', 'file-access']
            },
            // Command Injection
            {
                id: 'command-injection',
                name: 'Command Injection Test',
                description: 'Test for OS command injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Test {{endpoint}} for command injection in {{parameter}}',
                parameters: [
                    {
                        name: 'endpoint',
                        type: 'url',
                        required: true,
                        description: 'Endpoint that executes system commands'
                    },
                    {
                        name: 'parameter',
                        type: 'string',
                        required: true,
                        description: 'Parameter passed to system'
                    }
                ],
                examples: ['Test /ping?host= for command injection'],
                tags: ['command-injection', 'rce', 'os-injection']
            },
            // Rate Limiting
            {
                id: 'rate-limit-test',
                name: 'Rate Limiting Test',
                description: 'Test API rate limiting implementation',
                category: 'API Security',
                mcpTool: 'send_to_intruder',
                template: 'Test {{endpoint}} for rate limiting',
                parameters: [
                    {
                        name: 'endpoint',
                        type: 'url',
                        required: true,
                        description: 'API endpoint to test'
                    }
                ],
                examples: ['Test /api/login rate limiting'],
                tags: ['rate-limit', 'dos', 'api-abuse']
            },

            // SQL Injection - Blind
            {
                id: 'sql-injection-blind',
                name: 'Blind SQL Injection Test',
                description: 'Test for blind SQL injection using time-based payloads',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} parameter {{param}} for blind SQL injection. Send requests with time-based SQL payloads (e.g., SLEEP, WAITFOR DELAY) and analyze response times to detect vulnerabilities.',
                parameters: [],
                examples: ['Test /api/product?id=1 for blind SQLi with time delays'],
                tags: ['sqli', 'blind-sqli', 'time-based', 'injection']
            },

            // SQL Injection - Union-based
            {
                id: 'sql-injection-union',
                name: 'Union-Based SQL Injection',
                description: 'Test for union-based SQL injection to extract data',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for union-based SQL injection. Try UNION SELECT payloads to determine column count and extract data from the database.',
                parameters: [],
                examples: ['Test /search?q= for union-based SQLi to extract admin credentials'],
                tags: ['sqli', 'union-based', 'data-extraction', 'injection']
            },

            // SQL Injection - Error-based
            {
                id: 'sql-injection-error',
                name: 'Error-Based SQL Injection',
                description: 'Test for error-based SQL injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for error-based SQL injection. Send malformed SQL payloads and analyze error messages that may reveal database structure.',
                parameters: [],
                examples: ['Test /api/user?id= for error-based SQLi'],
                tags: ['sqli', 'error-based', 'information-disclosure', 'injection']
            },

            // SQL Injection - Boolean-based
            {
                id: 'sql-injection-boolean',
                name: 'Boolean-Based Blind SQLi',
                description: 'Test for boolean-based blind SQL injection',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for boolean-based blind SQL injection. Send true/false conditions and compare responses to infer database content.',
                parameters: [],
                examples: ['Test /api/check?id= for boolean-based blind SQLi'],
                tags: ['sqli', 'blind-sqli', 'boolean-based', 'injection']
            },

            // SQL Injection - Second Order
            {
                id: 'sql-injection-second-order',
                name: 'Second-Order SQL Injection',
                description: 'Test for second-order SQL injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test for second-order SQL injection. Store malicious SQL payloads in {{input_endpoint}}, then observe if they execute when retrieved at {{output_endpoint}}.',
                parameters: [],
                examples: ['Store SQLi in profile update, check if it executes on profile view'],
                tags: ['sqli', 'second-order', 'stored-injection', 'advanced']
            },

            // NoSQL Injection
            {
                id: 'nosql-injection',
                name: 'NoSQL Injection Test',
                description: 'Test for NoSQL injection (MongoDB, etc.)',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for NoSQL injection. Try payloads like {"$ne": null}, {"$gt": ""}, and JavaScript injection to bypass authentication or extract data.',
                parameters: [],
                examples: ['Test /api/login for MongoDB injection with $ne operator'],
                tags: ['nosql', 'mongodb', 'injection', 'authentication']
            },

            // XSS - Stored
            {
                id: 'xss-stored',
                name: 'Stored XSS Test',
                description: 'Test for stored/persistent XSS vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test for stored XSS at {{post_url}}. Submit XSS payloads and verify if they execute when content is retrieved at {{view_url}}.',
                parameters: [],
                examples: ['Test comment section for stored XSS that affects all users'],
                tags: ['xss', 'stored-xss', 'persistent', 'client-side']
            },

            // XSS - DOM-based
            {
                id: 'xss-dom',
                name: 'DOM-Based XSS Test',
                description: 'Test for DOM-based XSS vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for DOM-based XSS. Analyze client-side JavaScript that processes URL parameters, hash fragments, or postMessage data without proper sanitization.',
                parameters: [],
                examples: ['Test /page#param= for DOM XSS via location.hash'],
                tags: ['xss', 'dom-xss', 'client-side', 'javascript']
            },

            // XSS - Filter Bypass
            {
                id: 'xss-filter-bypass',
                name: 'XSS Filter Bypass',
                description: 'Test XSS with advanced filter bypass techniques',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to bypass XSS filters at {{url}}. Try encoding variations, alternative event handlers, JavaScript pseudo-protocols, and polyglot payloads to evade WAF/filters.',
                parameters: [],
                examples: ['Bypass XSS filter using HTML entity encoding and event handlers'],
                tags: ['xss', 'filter-bypass', 'waf-evasion', 'encoding']
            },

            // XSS - AngularJS Template Injection
            {
                id: 'xss-angular-template',
                name: 'AngularJS Template Injection',
                description: 'Test for AngularJS template injection (client-side template injection)',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for AngularJS template injection. Try payloads like {{constructor.constructor(\'alert(1)\')()}} to execute arbitrary JavaScript.',
                parameters: [],
                examples: ['Test search field for Angular template injection with {{7*7}}'],
                tags: ['xss', 'template-injection', 'angularjs', 'csti']
            },

            // SSRF - Internal Network
            {
                id: 'ssrf-internal',
                name: 'SSRF Internal Network Scan',
                description: 'Test SSRF to access internal network resources',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for SSRF vulnerabilities. Try accessing internal IP ranges (127.0.0.1, 169.254.169.254, 10.0.0.0/8, 192.168.0.0/16) to reach cloud metadata services or internal APIs.',
                parameters: [],
                examples: ['Test /fetch?url= for SSRF to access AWS metadata (169.254.169.254)'],
                tags: ['ssrf', 'internal-network', 'cloud-metadata', 'aws']
            },

            // SSRF - Blind
            {
                id: 'ssrf-blind',
                name: 'Blind SSRF Test',
                description: 'Test for blind SSRF using out-of-band techniques',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for blind SSRF. Use Burp Collaborator or external logging service to detect when the server makes requests to attacker-controlled domains.',
                parameters: [],
                examples: ['Test /webhook?url= for blind SSRF using Burp Collaborator'],
                tags: ['ssrf', 'blind-ssrf', 'oob', 'collaborator']
            },

            // SSRF - Filter Bypass
            {
                id: 'ssrf-bypass',
                name: 'SSRF Filter Bypass',
                description: 'Bypass SSRF protections and filters',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to bypass SSRF filters at {{url}}. Try URL encoding, alternative IP formats (decimal, hex, octal), DNS rebinding, redirects, and protocol wrappers to bypass blacklists.',
                parameters: [],
                examples: ['Bypass SSRF filter using 127.1 instead of 127.0.0.1'],
                tags: ['ssrf', 'filter-bypass', 'ip-encoding', 'dns-rebinding']
            },

            // XXE - Basic
            {
                id: 'xxe-basic',
                name: 'XXE (XML External Entity) Test',
                description: 'Test for XML External Entity injection',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for XXE vulnerabilities. Send XML payloads with external entity declarations to read local files or perform SSRF.',
                parameters: [],
                examples: ['Test /api/xmlupload for XXE to read /etc/passwd'],
                tags: ['xxe', 'xml', 'file-disclosure', 'ssrf']
            },

            // XXE - Blind
            {
                id: 'xxe-blind',
                name: 'Blind XXE Test',
                description: 'Test for blind XXE using out-of-band techniques',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for blind XXE. Use external DTD with parameter entities to exfiltrate data to Burp Collaborator when direct output is not visible.',
                parameters: [],
                examples: ['Test SOAP endpoint for blind XXE with OOB data exfiltration'],
                tags: ['xxe', 'blind-xxe', 'oob', 'xml']
            },

            // Command Injection - OS
            {
                id: 'command-injection-os',
                name: 'OS Command Injection',
                description: 'Test for OS command injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for OS command injection. Try command separators (;, &, |, \\n) and shell metacharacters to execute arbitrary system commands.',
                parameters: [],
                examples: ['Test /api/ping?host= for command injection with ; ls payload'],
                tags: ['command-injection', 'rce', 'os-injection', 'shell']
            },

            // Command Injection - Blind
            {
                id: 'command-injection-blind',
                name: 'Blind Command Injection',
                description: 'Test for blind command injection using time delays',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for blind command injection. Use time-delay payloads (sleep, ping) and out-of-band techniques (nslookup, curl) to confirm execution.',
                parameters: [],
                examples: ['Test /convert?file= for blind command injection with sleep 10'],
                tags: ['command-injection', 'blind-rce', 'time-based', 'oob']
            },

            // Code Injection - PHP
            {
                id: 'code-injection-php',
                name: 'PHP Code Injection',
                description: 'Test for PHP code injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for PHP code injection. Try injecting PHP code into eval(), assert(), preg_replace() with /e modifier, or dynamic function calls.',
                parameters: [],
                examples: ['Test /calc?expr= for PHP code injection in eval()'],
                tags: ['code-injection', 'php', 'rce', 'eval']
            },

            // Template Injection - Server-Side
            {
                id: 'ssti-test',
                name: 'Server-Side Template Injection',
                description: 'Test for SSTI in template engines',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for server-side template injection. Try template syntax for Jinja2, Twig, Freemarker, Velocity, etc. to achieve RCE.',
                parameters: [],
                examples: ['Test /preview?template= for Jinja2 SSTI with {{7*7}}'],
                tags: ['ssti', 'template-injection', 'rce', 'jinja2']
            },

            // LDAP Injection
            {
                id: 'ldap-injection',
                name: 'LDAP Injection Test',
                description: 'Test for LDAP injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for LDAP injection. Try LDAP filter metacharacters (*, |, &, !) to bypass authentication or extract directory information.',
                parameters: [],
                examples: ['Test /ldap/search for LDAP injection with *)(uid=*))(|(uid=* payload'],
                tags: ['ldap-injection', 'injection', 'authentication', 'directory']
            },

            // XPath Injection
            {
                id: 'xpath-injection',
                name: 'XPath Injection Test',
                description: 'Test for XPath injection in XML queries',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for XPath injection. Try XPath metacharacters and boolean conditions to bypass authentication or extract XML data.',
                parameters: [],
                examples: ['Test /xmlquery for XPath injection with \' or \'1\'=\'1'],
                tags: ['xpath-injection', 'xml', 'injection', 'authentication']
            },

            // CSV Injection
            {
                id: 'csv-injection',
                name: 'CSV/Excel Formula Injection',
                description: 'Test for CSV formula injection in export functions',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for CSV injection. Submit payloads starting with =, +, -, @ that may execute as formulas when opened in Excel/LibreOffice.',
                parameters: [],
                examples: ['Test /export/csv with =cmd|/c calc payload in user input'],
                tags: ['csv-injection', 'formula-injection', 'excel', 'export']
            },

            // HTTP Request Smuggling
            {
                id: 'http-smuggling',
                name: 'HTTP Request Smuggling',
                description: 'Test for HTTP request smuggling vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for HTTP request smuggling. Try CL.TE and TE.CL desync attacks by manipulating Content-Length and Transfer-Encoding headers.',
                parameters: [],
                examples: ['Test reverse proxy for CL.TE request smuggling'],
                tags: ['http-smuggling', 'desync', 'cl-te', 'te-cl']
            },

            // CRLF Injection
            {
                id: 'crlf-injection',
                name: 'CRLF Injection Test',
                description: 'Test for CRLF injection to inject HTTP headers',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for CRLF injection. Inject %0d%0a to add malicious HTTP headers or split responses for XSS/cache poisoning.',
                parameters: [],
                examples: ['Test /redirect?url= for CRLF injection to inject Set-Cookie header'],
                tags: ['crlf-injection', 'header-injection', 'response-splitting', 'xss']
            },

            // Host Header Injection
            {
                id: 'host-header-injection',
                name: 'Host Header Injection',
                description: 'Test for Host header injection vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for Host header injection. Manipulate the Host header to perform password reset poisoning, cache poisoning, or SSRF.',
                parameters: [],
                examples: ['Test /password-reset for Host header injection to hijack reset links'],
                tags: ['host-header', 'cache-poisoning', 'password-reset', 'ssrf']
            },

            // Open Redirect
            {
                id: 'open-redirect',
                name: 'Open Redirect Test',
                description: 'Test for open redirect vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for open redirect. Try redirect parameters with external URLs, bypassing filters with // , @, or URL encoding.',
                parameters: [],
                examples: ['Test /redirect?url= for open redirect to attacker.com'],
                tags: ['open-redirect', 'redirect', 'phishing', 'filter-bypass']
            },

            // File Upload - Unrestricted
            {
                id: 'file-upload-unrestricted',
                name: 'Unrestricted File Upload',
                description: 'Test for unrestricted file upload leading to RCE',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for unrestricted file upload. Upload web shells (PHP, JSP, ASPX) with various extensions and MIME types to achieve code execution.',
                parameters: [],
                examples: ['Test /upload for PHP web shell upload with double extension bypass'],
                tags: ['file-upload', 'rce', 'web-shell', 'unrestricted']
            },

            // File Upload - Content Type Bypass
            {
                id: 'file-upload-content-type',
                name: 'File Upload Content-Type Bypass',
                description: 'Bypass file upload restrictions via Content-Type manipulation',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} file upload with Content-Type bypass. Change Content-Type to image/* while uploading malicious files to evade MIME type checks.',
                parameters: [],
                examples: ['Upload web shell with Content-Type: image/jpeg to bypass filter'],
                tags: ['file-upload', 'content-type', 'mime-bypass', 'rce']
            },

            // Path Traversal - LFI
            {
                id: 'path-traversal-lfi',
                name: 'Local File Inclusion (LFI)',
                description: 'Test for LFI to read arbitrary files',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for LFI. Try ../ sequences, absolute paths, and encoding variations to read sensitive files like /etc/passwd or C:\\Windows\\win.ini.',
                parameters: [],
                examples: ['Test /view?page= for LFI with ../../../../etc/passwd'],
                tags: ['lfi', 'path-traversal', 'file-disclosure', 'directory-traversal']
            },

            // Path Traversal - RFI
            {
                id: 'path-traversal-rfi',
                name: 'Remote File Inclusion (RFI)',
                description: 'Test for RFI to include remote malicious files',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for RFI. Try including remote files (http://, ftp://, data:) to execute arbitrary code from attacker-controlled server.',
                parameters: [],
                examples: ['Test /include?file= for RFI with http://attacker.com/shell.txt'],
                tags: ['rfi', 'remote-inclusion', 'rce', 'file-inclusion']
            },

            // Insecure Deserialization
            {
                id: 'deserialization',
                name: 'Insecure Deserialization Test',
                description: 'Test for insecure deserialization vulnerabilities',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for insecure deserialization. Identify serialized objects in cookies/parameters and craft malicious payloads for Java, PHP, Python, .NET to achieve RCE.',
                parameters: [],
                examples: ['Test session cookie for Java deserialization with ysoserial payload'],
                tags: ['deserialization', 'rce', 'java', 'ysoserial']
            },

            // XML Bomb (Billion Laughs)
            {
                id: 'xml-bomb',
                name: 'XML Bomb (DoS) Test',
                description: 'Test for XML bomb/billion laughs DoS',
                category: 'Input Validation',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for XML bomb vulnerability. Send XML with recursive entity expansion to cause denial of service.',
                parameters: [],
                examples: ['Test XML parser with billion laughs attack payload'],
                tags: ['xml-bomb', 'dos', 'xxe', 'billion-laughs']
            },

            // ═══════════════════════════════════════════════════════════
            // AUTHENTICATION & SESSION (25 prompts)
            // ═══════════════════════════════════════════════════════════

            // Brute Force - Login
            {
                id: 'brute-force-login',
                name: 'Login Brute Force Attack',
                description: 'Brute force login credentials',
                category: 'Authentication & Session',
                mcpTool: 'send_to_intruder',
                template: 'Use Burp MCP Intruder to brute force {{url}} login. Test common username/password combinations and check for account lockout mechanisms.',
                parameters: [],
                examples: ['Brute force /api/login with common credentials list'],
                tags: ['brute-force', 'authentication', 'password', 'intruder']
            },

            // Credential Stuffing
            {
                id: 'credential-stuffing',
                name: 'Credential Stuffing Attack',
                description: 'Test credential stuffing with leaked credentials',
                category: 'Authentication & Session',
                mcpTool: 'send_to_intruder',
                template: 'Use Burp MCP to test {{url}} for credential stuffing. Use lists of breached credentials to identify reused passwords.',
                parameters: [],
                examples: ['Test login with Have I Been Pwned credential list'],
                tags: ['credential-stuffing', 'authentication', 'password-reuse', 'breach']
            },

            // 2FA Bypass - Code Reuse
            {
                id: '2fa-bypass-reuse',
                name: '2FA Code Reuse Test',
                description: 'Test if 2FA codes can be reused',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} 2FA implementation. Check if codes can be reused, don\'t expire, or can be brute-forced.',
                parameters: [],
                examples: ['Test /verify-2fa with same code multiple times'],
                tags: ['2fa', 'mfa', 'bypass', 'authentication']
            },

            // 2FA Bypass - Response Manipulation
            {
                id: '2fa-bypass-response',
                name: '2FA Response Manipulation',
                description: 'Bypass 2FA by manipulating response',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for 2FA bypass via response manipulation. Try changing {"success": false} to {"success": true} or skipping 2FA step entirely.',
                parameters: [],
                examples: ['Test 2FA by modifying JSON response from false to true'],
                tags: ['2fa', 'mfa', 'bypass', 'response-manipulation']
            },

            // JWT - None Algorithm
            {
                id: 'jwt-none-algorithm',
                name: 'JWT None Algorithm Bypass',
                description: 'Test JWT with alg: none to bypass signature',
                category: 'Authentication & Session',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to decode JWT from {{url}}, change algorithm to "none", remove signature, and resend to bypass authentication.',
                parameters: [],
                examples: ['Test JWT by changing alg to none and removing signature'],
                tags: ['jwt', 'token', 'none-algorithm', 'bypass']
            },

            // JWT - Algorithm Confusion
            {
                id: 'jwt-algorithm-confusion',
                name: 'JWT Algorithm Confusion (RS256 to HS256)',
                description: 'Test JWT algorithm confusion attack',
                category: 'Authentication & Session',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to test JWT algorithm confusion at {{url}}. Change RS256 to HS256 and sign with public key to forge tokens.',
                parameters: [],
                examples: ['Test JWT by confusing RS256 with HS256 using public key'],
                tags: ['jwt', 'algorithm-confusion', 'rs256', 'hs256']
            },

            // JWT - Weak Secret
            {
                id: 'jwt-weak-secret',
                name: 'JWT Weak Secret Brute Force',
                description: 'Brute force JWT secret key',
                category: 'Authentication & Session',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to extract JWT from {{url}} and brute force the secret key using common passwords or dictionary attacks.',
                parameters: [],
                examples: ['Brute force JWT secret with rockyou.txt wordlist'],
                tags: ['jwt', 'brute-force', 'weak-secret', 'crypto']
            },

            // JWT - KID Manipulation
            {
                id: 'jwt-kid-manipulation',
                name: 'JWT KID Parameter Injection',
                description: 'Manipulate JWT kid parameter for path traversal or SQL injection',
                category: 'Authentication & Session',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to test JWT kid parameter at {{url}}. Try path traversal (/dev/null), SQL injection, or command injection in the kid field.',
                parameters: [],
                examples: ['Test JWT kid parameter with ../../../../dev/null for arbitrary signing'],
                tags: ['jwt', 'kid', 'path-traversal', 'injection']
            },

            // Session Fixation
            {
                id: 'session-fixation',
                name: 'Session Fixation Test',
                description: 'Test for session fixation vulnerabilities',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for session fixation. Check if session ID remains the same before and after authentication.',
                parameters: [],
                examples: ['Test if session ID changes after login at /login endpoint'],
                tags: ['session-fixation', 'session', 'authentication', 'hijacking']
            },

            // Session Hijacking - Cookie Theft
            {
                id: 'session-hijacking',
                name: 'Session Hijacking Test',
                description: 'Test session cookie security attributes',
                category: 'Authentication & Session',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to analyze session cookies from {{url}}. Check for missing Secure, HttpOnly, SameSite flags that enable session hijacking.',
                parameters: [],
                examples: ['Analyze session cookie flags for security weaknesses'],
                tags: ['session-hijacking', 'cookies', 'xss', 'csrf']
            },

            // Session Timeout
            {
                id: 'session-timeout',
                name: 'Session Timeout Test',
                description: 'Test session timeout and idle timeout',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test session timeout at {{url}}. Check if sessions expire after reasonable idle period and absolute timeout.',
                parameters: [],
                examples: ['Test if session is valid after 24 hours of inactivity'],
                tags: ['session-timeout', 'session', 'idle-timeout', 'security']
            },

            // Logout Validation
            {
                id: 'logout-validation',
                name: 'Logout Function Test',
                description: 'Test if logout properly invalidates session',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test logout at {{url}}. Verify if session token is invalidated on server-side and cannot be reused after logout.',
                parameters: [],
                examples: ['Test if session cookie works after calling /logout'],
                tags: ['logout', 'session', 'invalidation', 'authentication']
            },

            // Concurrent Sessions
            {
                id: 'concurrent-sessions',
                name: 'Concurrent Session Test',
                description: 'Test if multiple concurrent sessions are allowed',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test {{url}} for concurrent session handling. Check if same user can have multiple active sessions simultaneously.',
                parameters: [],
                examples: ['Login from two different locations and check if both sessions work'],
                tags: ['concurrent-sessions', 'session', 'multiple-sessions', 'authentication']
            },

            // OAuth - Redirect URI Manipulation
            {
                id: 'oauth-redirect-uri',
                name: 'OAuth Redirect URI Manipulation',
                description: 'Test OAuth redirect_uri parameter for open redirect',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test OAuth redirect_uri at {{url}}. Try manipulating redirect_uri to steal authorization codes via open redirect.',
                parameters: [],
                examples: ['Test OAuth with redirect_uri=https://attacker.com'],
                tags: ['oauth', 'redirect-uri', 'open-redirect', 'code-theft']
            },

            // OAuth - CSRF
            {
                id: 'oauth-csrf',
                name: 'OAuth CSRF Test',
                description: 'Test OAuth flow for CSRF vulnerabilities',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test OAuth flow at {{url}} for missing state parameter or improper state validation enabling CSRF attacks.',
                parameters: [],
                examples: ['Test OAuth callback without state parameter for CSRF'],
                tags: ['oauth', 'csrf', 'state-parameter', 'authentication']
            },

            // Password Reset - Token Leak
            {
                id: 'password-reset-token',
                name: 'Password Reset Token Security',
                description: 'Test password reset token predictability and leakage',
                category: 'Authentication & Session',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to analyze password reset tokens from {{url}}. Check if tokens are predictable, leaked in Referer, or valid for too long.',
                parameters: [],
                examples: ['Analyze reset token entropy and check for Referer leakage'],
                tags: ['password-reset', 'token', 'predictable', 'leakage']
            },

            // Password Reset - User Enumeration
            {
                id: 'password-reset-enumeration',
                name: 'Password Reset User Enumeration',
                description: 'Test password reset for username enumeration',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test password reset at {{url}} for user enumeration. Check if response differs for existing vs non-existing users.',
                parameters: [],
                examples: ['Test /forgot-password with valid and invalid emails to detect enumeration'],
                tags: ['password-reset', 'user-enumeration', 'information-disclosure', 'authentication']
            },

            // Registration - User Enumeration
            {
                id: 'registration-enumeration',
                name: 'Registration User Enumeration',
                description: 'Test registration for existing username disclosure',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test registration at {{url}} for user enumeration. Check if error messages reveal if username/email already exists.',
                parameters: [],
                examples: ['Test /register with existing usernames to enumerate valid accounts'],
                tags: ['registration', 'user-enumeration', 'information-disclosure', 'authentication']
            },

            // Remember Me Function
            {
                id: 'remember-me',
                name: 'Remember Me Security Test',
                description: 'Test "Remember Me" token security',
                category: 'Authentication & Session',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to analyze "Remember Me" tokens from {{url}}. Check if tokens are encrypted, signed, and contain non-guessable data.',
                parameters: [],
                examples: ['Analyze remember-me cookie for weak encoding or predictable patterns'],
                tags: ['remember-me', 'persistent-login', 'token', 'security']
            },

            // API Key Exposure
            {
                id: 'api-key-exposure',
                name: 'API Key Exposure Test',
                description: 'Check for exposed API keys in client-side code',
                category: 'Authentication & Session',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to search responses from {{url}} for exposed API keys, secrets, or credentials in JavaScript, HTML comments, or configuration files.',
                parameters: [],
                examples: ['Search for AWS keys, JWT secrets, or API tokens in source code'],
                tags: ['api-key', 'secrets', 'exposure', 'information-disclosure']
            },

            // Token Expiration
            {
                id: 'token-expiration',
                name: 'Token Expiration Test',
                description: 'Test API token expiration and refresh mechanisms',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test token expiration at {{url}}. Verify access tokens expire and refresh tokens are properly rotated.',
                parameters: [],
                examples: ['Test if access token from /oauth/token expires after stated time'],
                tags: ['token', 'expiration', 'refresh-token', 'oauth']
            },

            // HTTP Basic Auth - Weak Credentials
            {
                id: 'basic-auth-weak',
                name: 'HTTP Basic Auth Weak Credentials',
                description: 'Test HTTP Basic Authentication with weak credentials',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to brute force HTTP Basic Auth at {{url}} with common username:password combinations.',
                parameters: [],
                examples: ['Brute force Basic Auth with admin:admin, admin:password, etc.'],
                tags: ['basic-auth', 'brute-force', 'weak-credentials', 'authentication']
            },

            // Account Lockout
            {
                id: 'account-lockout',
                name: 'Account Lockout Mechanism Test',
                description: 'Test account lockout after failed login attempts',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test account lockout at {{url}}. Send multiple failed login attempts to verify if account gets locked and for how long.',
                parameters: [],
                examples: ['Test if account locks after 5 failed login attempts at /login'],
                tags: ['account-lockout', 'brute-force-protection', 'authentication', 'security']
            },

            // CAPTCHA Bypass
            {
                id: 'captcha-bypass',
                name: 'CAPTCHA Bypass Test',
                description: 'Test CAPTCHA implementation for bypass techniques',
                category: 'Authentication & Session',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test CAPTCHA at {{url}}. Check if CAPTCHA validation can be bypassed by removing parameter, reusing token, or manipulating response.',
                parameters: [],
                examples: ['Test login by removing captcha_response parameter'],
                tags: ['captcha', 'bypass', 'automation', 'brute-force']
            },

            // ═══════════════════════════════════════════════════════════
            // AUTHORIZATION & ACCESS CONTROL (20 prompts)
            // ═══════════════════════════════════════════════════════════

            // IDOR - Sequential IDs
            {
                id: 'idor-sequential',
                name: 'IDOR Sequential ID Test',
                description: 'Test IDOR with sequential ID enumeration',
                category: 'Authorization & Access Control',
                mcpTool: 'send_to_intruder',
                template: 'Use Burp MCP Intruder to enumerate sequential IDs at {{url}}. Test if User A can access User B\'s resources by incrementing/decrementing IDs.',
                parameters: [],
                examples: ['Test /api/document/1 through /api/document/1000 for unauthorized access'],
                tags: ['idor', 'enumeration', 'sequential-id', 'authorization']
            },

            // IDOR - GUID/UUID
            {
                id: 'idor-guid',
                name: 'IDOR GUID/UUID Test',
                description: 'Test IDOR with predictable or leaked GUIDs',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test IDOR at {{url}} using GUIDs/UUIDs. Check if GUIDs are leaked elsewhere or if server validates ownership.',
                parameters: [],
                examples: ['Test /api/profile/{guid} with GUIDs from other API responses'],
                tags: ['idor', 'guid', 'uuid', 'authorization']
            },

            // Vertical Privilege Escalation
            {
                id: 'privilege-escalation-vertical',
                name: 'Vertical Privilege Escalation',
                description: 'Test for privilege escalation from user to admin',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test vertical privilege escalation at {{url}}. Access admin endpoints with regular user credentials.',
                parameters: [],
                examples: ['Test /admin/* endpoints with regular user session token'],
                tags: ['privilege-escalation', 'vertical', 'admin-access', 'authorization']
            },

            // Horizontal Privilege Escalation
            {
                id: 'privilege-escalation-horizontal',
                name: 'Horizontal Privilege Escalation',
                description: 'Test for horizontal privilege escalation between users',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test horizontal privilege escalation at {{url}}. Access User B\'s resources using User A\'s credentials.',
                parameters: [],
                examples: ['Test /api/user/123/settings with User 456\'s session token'],
                tags: ['privilege-escalation', 'horizontal', 'user-isolation', 'authorization']
            },

            // Forced Browsing
            {
                id: 'forced-browsing',
                name: 'Forced Browsing Test',
                description: 'Test for unprotected admin/hidden endpoints',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test forced browsing at {{url}}. Try accessing /admin, /backup, /config, /test endpoints without authentication.',
                parameters: [],
                examples: ['Test common admin paths like /admin, /administrator, /manage'],
                tags: ['forced-browsing', 'hidden-endpoints', 'admin', 'authorization']
            },

            // Missing Function Level Access Control
            {
                id: 'missing-function-access-control',
                name: 'Missing Function-Level Access Control',
                description: 'Test if sensitive functions lack authorization checks',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test function-level access control at {{url}}. Try admin functions (delete, modify roles) with regular user privileges.',
                parameters: [],
                examples: ['Test DELETE /api/user/{id} or PUT /api/roles with regular user token'],
                tags: ['access-control', 'function-level', 'admin-functions', 'authorization']
            },

            // Parameter Manipulation
            {
                id: 'parameter-manipulation',
                name: 'Parameter Manipulation Test',
                description: 'Test authorization bypass via parameter manipulation',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to manipulate parameters at {{url}}. Try adding/modifying parameters like admin=true, role=admin, isAdmin=1 to bypass authorization.',
                parameters: [],
                examples: ['Test /api/profile by adding admin=true parameter'],
                tags: ['parameter-manipulation', 'authorization', 'bypass', 'privilege-escalation']
            },

            // HTTP Method Tampering
            {
                id: 'http-method-tampering',
                name: 'HTTP Method Tampering',
                description: 'Bypass authorization by changing HTTP methods',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test HTTP method tampering at {{url}}. Try changing GET to POST, PUT to PATCH, or use HTTP method override headers.',
                parameters: [],
                examples: ['Test if GET /api/admin returns 403 but POST /api/admin allows access'],
                tags: ['http-method', 'tampering', 'authorization', 'bypass']
            },

            // CORS Misconfiguration
            {
                id: 'cors-misconfiguration',
                name: 'CORS Misconfiguration Test',
                description: 'Test for CORS misconfigurations allowing unauthorized access',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test CORS at {{url}}. Check if Origin header is reflected in Access-Control-Allow-Origin without proper validation.',
                parameters: [],
                examples: ['Test API with Origin: https://attacker.com to check CORS reflection'],
                tags: ['cors', 'misconfiguration', 'access-control', 'same-origin']
            },

            // Directory Listing
            {
                id: 'directory-listing',
                name: 'Directory Listing Test',
                description: 'Test for directory listing vulnerabilities',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test directory listing at {{url}}. Check if directories like /uploads/, /backups/, /images/ expose file listings.',
                parameters: [],
                examples: ['Test /uploads/ and /backups/ for directory listing'],
                tags: ['directory-listing', 'information-disclosure', 'file-exposure', 'access-control']
            },

            // Backup Files
            {
                id: 'backup-files',
                name: 'Backup File Discovery',
                description: 'Test for accessible backup and old files',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to search for backup files at {{url}}. Try .bak, .old, .backup, ~ suffixes and .git, .svn directories.',
                parameters: [],
                examples: ['Test /config.php.bak, /api.php~, /.git/ for exposed files'],
                tags: ['backup-files', 'file-disclosure', 'source-code', 'access-control']
            },

            // Referer-Based Access Control
            {
                id: 'referer-bypass',
                name: 'Referer-Based Access Control Bypass',
                description: 'Bypass Referer-based authorization checks',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test Referer-based access control at {{url}}. Remove or modify Referer header to bypass weak authorization.',
                parameters: [],
                examples: ['Test /admin by changing Referer to /admin or removing it'],
                tags: ['referer', 'bypass', 'authorization', 'header-manipulation']
            },

            // User-Agent Based Access Control
            {
                id: 'user-agent-bypass',
                name: 'User-Agent Access Control Bypass',
                description: 'Bypass User-Agent based restrictions',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test User-Agent based access control at {{url}}. Change User-Agent to mobile, bot, or admin agent to bypass restrictions.',
                parameters: [],
                examples: ['Test /api with User-Agent: Googlebot to bypass IP restrictions'],
                tags: ['user-agent', 'bypass', 'authorization', 'header-manipulation']
            },

            // IP-Based Access Control
            {
                id: 'ip-based-bypass',
                name: 'IP-Based Access Control Bypass',
                description: 'Bypass IP-based restrictions using headers',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to bypass IP restrictions at {{url}}. Add headers like X-Forwarded-For, X-Real-IP, X-Originating-IP with trusted IPs.',
                parameters: [],
                examples: ['Test /admin with X-Forwarded-For: 127.0.0.1 or 10.0.0.1'],
                tags: ['ip-bypass', 'x-forwarded-for', 'authorization', 'header-injection']
            },

            // Client-Side Access Control
            {
                id: 'client-side-controls',
                name: 'Client-Side Access Control Bypass',
                description: 'Bypass client-side only access controls',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to bypass client-side controls at {{url}}. Access disabled buttons, hidden fields, or restricted UI elements via direct API calls.',
                parameters: [],
                examples: ['Test API directly even if delete button is hidden in UI'],
                tags: ['client-side', 'bypass', 'ui-restriction', 'authorization']
            },

            // Multi-Tenant Isolation
            {
                id: 'multi-tenant-isolation',
                name: 'Multi-Tenant Isolation Test',
                description: 'Test tenant isolation in SaaS applications',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test multi-tenant isolation at {{url}}. Try accessing Tenant B\'s data using Tenant A\'s credentials.',
                parameters: [],
                examples: ['Test /api/data with tenantId parameter manipulation'],
                tags: ['multi-tenant', 'isolation', 'saas', 'authorization']
            },

            // Role-Based Access Control
            {
                id: 'rbac-bypass',
                name: 'RBAC Bypass Test',
                description: 'Test role-based access control for bypasses',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test RBAC at {{url}}. Try manipulating role parameters or accessing endpoints meant for different roles.',
                parameters: [],
                examples: ['Test /api/admin endpoint with role=admin parameter added'],
                tags: ['rbac', 'roles', 'authorization', 'bypass']
            },

            // File Permission Test
            {
                id: 'file-permissions',
                name: 'File Permission Test',
                description: 'Test for improperly secured files and directories',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test file permissions at {{url}}. Check if sensitive files (.env, web.config, credentials) are publicly accessible.',
                parameters: [],
                examples: ['Test /.env, /web.config, /credentials.json for public access'],
                tags: ['file-permissions', 'information-disclosure', 'configuration', 'access-control']
            },

            // GraphQL Authorization
            {
                id: 'graphql-authorization',
                name: 'GraphQL Authorization Test',
                description: 'Test GraphQL queries for authorization bypasses',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http2_request',
                template: 'Use Burp MCP to test GraphQL at {{url}}. Query for restricted fields or use aliases/fragments to bypass field-level authorization.',
                parameters: [],
                examples: ['Test GraphQL query { user(id:1) { ssn } } without authorization'],
                tags: ['graphql', 'authorization', 'field-level', 'api']
            },

            // Subdomain Takeover
            {
                id: 'subdomain-takeover',
                name: 'Subdomain Takeover Test',
                description: 'Test for subdomain takeover vulnerabilities',
                category: 'Authorization & Access Control',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test subdomains of {{domain}} for takeover. Check for dangling DNS records pointing to unclaimed services (AWS S3, GitHub Pages, Heroku).',
                parameters: [],
                examples: ['Test blog.example.com for dangling S3 bucket takeover'],
                tags: ['subdomain-takeover', 'dns', 'cloud', 'access-control']
            },

            // ═══════════════════════════════════════════════════════════
            // API SECURITY (20 prompts)
            // ═══════════════════════════════════════════════════════════

            // REST API - Mass Assignment
            {
                id: 'api-mass-assignment',
                name: 'Mass Assignment Test',
                description: 'Test for mass assignment vulnerabilities in API',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test mass assignment at {{url}}. Add extra parameters like isAdmin, role, balance to modify restricted fields.',
                parameters: [],
                examples: ['Test POST /api/user with additional {"isAdmin":true} field'],
                tags: ['mass-assignment', 'api', 'parameter-binding', 'authorization']
            },

            // REST API - HTTP Verb Tampering
            {
                id: 'api-verb-tampering',
                name: 'API HTTP Verb Tampering',
                description: 'Test API endpoints with different HTTP methods',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test HTTP verb tampering at {{url}}. Try all HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD) to find hidden functionality.',
                parameters: [],
                examples: ['Test if PUT /api/user allows updates when only POST is documented'],
                tags: ['http-verb', 'api', 'method-tampering', 'authorization']
            },

            // REST API - Excessive Data Exposure
            {
                id: 'api-excessive-data',
                name: 'Excessive Data Exposure Test',
                description: 'Test API for excessive data exposure',
                category: 'API Security',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to analyze API responses from {{url}}. Check if API returns more data than needed (SSN, passwords, private info) that client filters.',
                parameters: [],
                examples: ['Check if /api/users returns password hashes or SSNs unnecessarily'],
                tags: ['excessive-data', 'api', 'information-disclosure', 'privacy']
            },

            // REST API - Lack of Resources
            {
                id: 'api-lack-resources-limits',
                name: 'API Resource Limits Test',
                description: 'Test API for lack of resource and rate limits',
                category: 'API Security',
                mcpTool: 'send_to_intruder',
                template: 'Use Burp MCP Intruder to test API rate limiting at {{url}}. Send rapid requests to check for DoS potential, resource exhaustion, or lack of pagination limits.',
                parameters: [],
                examples: ['Test /api/users?limit=999999 to extract all records at once'],
                tags: ['rate-limit', 'api', 'dos', 'resource-exhaustion']
            },

            // GraphQL - Introspection
            {
                id: 'graphql-introspection',
                name: 'GraphQL Introspection Query',
                description: 'Test GraphQL introspection to discover schema',
                category: 'API Security',
                mcpTool: 'send_http2_request',
                template: 'Use Burp MCP to run GraphQL introspection query at {{url}}. Discover all types, queries, mutations, and fields available in the schema.',
                parameters: [],
                examples: ['Run __schema query to enumerate GraphQL API structure'],
                tags: ['graphql', 'introspection', 'schema-discovery', 'api']
            },

            // GraphQL - Batching Attack
            {
                id: 'graphql-batching',
                name: 'GraphQL Batching Attack',
                description: 'Test GraphQL for batching attack to bypass rate limits',
                category: 'API Security',
                mcpTool: 'send_http2_request',
                template: 'Use Burp MCP to test GraphQL batching at {{url}}. Send array of queries in single request to bypass rate limiting or perform credential brute force.',
                parameters: [],
                examples: ['Send 100 login mutations in one GraphQL batch request'],
                tags: ['graphql', 'batching', 'rate-limit-bypass', 'brute-force']
            },

            // GraphQL - Nested Query DoS
            {
                id: 'graphql-nested-dos',
                name: 'GraphQL Nested Query DoS',
                description: 'Test GraphQL for deeply nested query DoS',
                category: 'API Security',
                mcpTool: 'send_http2_request',
                template: 'Use Burp MCP to test GraphQL at {{url}} with deeply nested queries. Create circular queries to cause resource exhaustion and DoS.',
                parameters: [],
                examples: ['Send deeply nested query: user{posts{user{posts{user...}}}}'],
                tags: ['graphql', 'dos', 'nested-query', 'resource-exhaustion']
            },

            // GraphQL - Field Duplication
            {
                id: 'graphql-field-duplication',
                name: 'GraphQL Field Duplication',
                description: 'Test GraphQL field duplication for DoS',
                category: 'API Security',
                mcpTool: 'send_http2_request',
                template: 'Use Burp MCP to test GraphQL field duplication at {{url}}. Request same expensive field multiple times using aliases to cause DoS.',
                parameters: [],
                examples: ['Query {a1:users a2:users a3:users ... a1000:users} for DoS'],
                tags: ['graphql', 'dos', 'field-duplication', 'alias-abuse']
            },

            // API Versioning
            {
                id: 'api-versioning',
                name: 'API Version Testing',
                description: 'Test old API versions for unpatched vulnerabilities',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test different API versions at {{url}}. Try /api/v1, /api/v2, /v1, /v2 to find deprecated versions with unpatched vulnerabilities.',
                parameters: [],
                examples: ['Test /api/v1/users vs /api/v2/users for security differences'],
                tags: ['api-versioning', 'deprecated', 'unpatched', 'api']
            },

            // API Documentation Exposure
            {
                id: 'api-documentation',
                name: 'API Documentation Exposure',
                description: 'Test for exposed API documentation',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to search for API documentation at {{url}}. Try /api-docs, /swagger, /openapi.json, /graphql, /docs, /api/documentation.',
                parameters: [],
                examples: ['Test /swagger-ui.html and /api/swagger.json for API documentation'],
                tags: ['api-docs', 'swagger', 'openapi', 'information-disclosure']
            },

            // SOAP - XML Injection
            {
                id: 'soap-xml-injection',
                name: 'SOAP XML Injection',
                description: 'Test SOAP API for XML injection',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test SOAP API at {{url}} for XML injection. Try XXE, XPath injection, and XML bomb attacks in SOAP envelopes.',
                parameters: [],
                examples: ['Test SOAP endpoint with XXE payload in request body'],
                tags: ['soap', 'xml-injection', 'xxe', 'xpath']
            },

            // SOAP - WSDL Enumeration
            {
                id: 'soap-wsdl',
                name: 'SOAP WSDL Enumeration',
                description: 'Enumerate SOAP API operations via WSDL',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to retrieve WSDL from {{url}}?wsdl. Analyze all available operations, parameters, and data types to find hidden functionality.',
                parameters: [],
                examples: ['Download WSDL from /Service.asmx?wsdl to enumerate operations'],
                tags: ['soap', 'wsdl', 'enumeration', 'api-discovery']
            },

            // REST API - Content Type Validation
            {
                id: 'api-content-type',
                name: 'API Content-Type Bypass',
                description: 'Bypass API validation via Content-Type manipulation',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test Content-Type handling at {{url}}. Try application/json, application/xml, application/x-www-form-urlencoded to bypass validation.',
                parameters: [],
                examples: ['Send XML payload with Content-Type: application/json to confuse parser'],
                tags: ['content-type', 'api', 'bypass', 'validation']
            },

            // API Parameter Pollution
            {
                id: 'api-parameter-pollution',
                name: 'API Parameter Pollution',
                description: 'Test API for parameter pollution vulnerabilities',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test parameter pollution at {{url}}. Send duplicate parameters to cause inconsistent parsing between layers (WAF vs app).',
                parameters: [],
                examples: ['Test /api/transfer?amount=1&amount=9999 for HPP'],
                tags: ['parameter-pollution', 'hpp', 'api', 'bypass']
            },

            // API - JSON Injection
            {
                id: 'api-json-injection',
                name: 'JSON Injection Test',
                description: 'Test for JSON injection vulnerabilities',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test JSON injection at {{url}}. Try injecting additional JSON keys, changing data types, or breaking JSON structure.',
                parameters: [],
                examples: ['Test {"user":"alice"} by injecting {"user":"alice","admin":true}'],
                tags: ['json-injection', 'api', 'mass-assignment', 'injection']
            },

            // API - Array Manipulation
            {
                id: 'api-array-manipulation',
                name: 'API Array Manipulation',
                description: 'Test API array parameters for injection',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to manipulate array parameters at {{url}}. Change {"ids":[1]} to {"ids":[1,2,3]} or {"ids":{"$ne":null}} to access more data.',
                parameters: [],
                examples: ['Test /api/delete with {"ids":[1,2,3,4,5]} to delete multiple records'],
                tags: ['array-manipulation', 'api', 'parameter-manipulation', 'authorization']
            },

            // API - Wildcard Injection
            {
                id: 'api-wildcard',
                name: 'API Wildcard Injection',
                description: 'Test API for wildcard character injection',
                category: 'API Security',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test wildcard injection at {{url}}. Try *, %, _, regex patterns in search/filter parameters to extract more data than intended.',
                parameters: [],
                examples: ['Test /api/search?email=* to retrieve all email addresses'],
                tags: ['wildcard', 'api', 'information-disclosure', 'injection']
            },

            // WebSocket - Message Manipulation
            {
                id: 'websocket-manipulation',
                name: 'WebSocket Message Manipulation',
                description: 'Test WebSocket for message manipulation',
                category: 'API Security',
                mcpTool: 'get_proxy_websocket_history',
                template: 'Use Burp MCP to analyze WebSocket messages from {{url}}. Test for XSS, SQLi, authentication bypass in WS messages.',
                parameters: [],
                examples: ['Manipulate WebSocket chat messages for XSS or command injection'],
                tags: ['websocket', 'message-manipulation', 'real-time', 'injection']
            },

            // WebSocket - CSRF
            {
                id: 'websocket-csrf',
                name: 'WebSocket CSRF Test',
                description: 'Test WebSocket for CSRF vulnerabilities',
                category: 'API Security',
                mcpTool: 'get_proxy_websocket_history',
                template: 'Use Burp MCP to test WebSocket CSRF at {{url}}. Check if WS connection validates origin and if attacker can establish connection from malicious site.',
                parameters: [],
                examples: ['Test if WebSocket connection accepts connections from any origin'],
                tags: ['websocket', 'csrf', 'origin-validation', 'real-time']
            },

            // API Response Manipulation
            {
                id: 'api-response-manipulation',
                name: 'API Response Manipulation Test',
                description: 'Test if client-side response manipulation is trusted',
                category: 'API Security',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP Proxy to intercept and modify API responses from {{url}}. Check if client trusts manipulated responses for authorization decisions.',
                parameters: [],
                examples: ['Change {"role":"user"} to {"role":"admin"} in response and check access'],
                tags: ['response-manipulation', 'api', 'client-side-controls', 'authorization']
            },

            // ═══════════════════════════════════════════════════════════
            // ENCODING & CRYPTOGRAPHY (15 prompts)
            // ═══════════════════════════════════════════════════════════

            // Base64 Decode
            {
                id: 'base64-decode-analyze',
                name: 'Base64 Decode & Analyze',
                description: 'Decode Base64 data to analyze contents',
                category: 'Encoding & Cryptography',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to decode Base64 data from {{source}}. Analyze decoded content for sensitive information or vulnerabilities.',
                parameters: [],
                examples: ['Decode Base64 cookie value to find user ID or role'],
                tags: ['base64', 'decode', 'analysis', 'encoding']
            },

            // URL Encoding/Decoding
            {
                id: 'url-encoding-analysis',
                name: 'URL Encoding Analysis',
                description: 'Analyze URL encoded parameters',
                category: 'Encoding & Cryptography',
                mcpTool: 'url_decode',
                template: 'Use Burp MCP to decode URL encoded parameters from {{url}}. Check for double encoding, obfuscated payloads, or hidden parameters.',
                parameters: [],
                examples: ['Decode %2e%2e%2f to detect path traversal in encoded form'],
                tags: ['url-encoding', 'decode', 'obfuscation', 'encoding']
            },

            // JWT Decode & Analyze
            {
                id: 'jwt-full-analysis',
                name: 'JWT Complete Analysis',
                description: 'Comprehensive JWT token analysis',
                category: 'Encoding & Cryptography',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to comprehensively analyze JWT from {{source}}. Check algorithm, expiration, signature strength, and test for known vulnerabilities.',
                parameters: [],
                examples: ['Analyze JWT for none algorithm, weak secret, or algorithm confusion'],
                tags: ['jwt', 'analysis', 'crypto', 'token']
            },

            // Hash Identification
            {
                id: 'hash-identification',
                name: 'Hash Type Identification',
                description: 'Identify hash algorithm type',
                category: 'Encoding & Cryptography',
                mcpTool: 'url_decode',
                template: 'Identify hash type from {{source}}. Analyze hash length and format to determine algorithm (MD5, SHA1, SHA256, bcrypt, etc.).',
                parameters: [],
                examples: ['Identify if hash is MD5, SHA1, or bcrypt from password dump'],
                tags: ['hash', 'identification', 'crypto', 'analysis']
            },

            // Unicode Normalization Attack
            {
                id: 'unicode-normalization',
                name: 'Unicode Normalization Attack',
                description: 'Test for unicode normalization vulnerabilities',
                category: 'Encoding & Cryptography',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test unicode normalization at {{url}}. Try different unicode representations of same characters to bypass filters or authentication.',
                parameters: [],
                examples: ['Test admin vs ⓐⓓⓜⓘⓝ for authentication bypass'],
                tags: ['unicode', 'normalization', 'bypass', 'encoding']
            },

            // Encoding Chain Bypass
            {
                id: 'encoding-chain-bypass',
                name: 'Multi-Layer Encoding Bypass',
                description: 'Use encoding chains to bypass filters',
                category: 'Encoding & Cryptography',
                mcpTool: 'url_encode',
                template: 'Use Burp MCP to create encoding chains for {{payload}}. Try double encoding, mixed encoding (URL+Base64), or nested encoding to bypass WAF.',
                parameters: [],
                examples: ['Double URL encode payload: %253Cscript%253E to bypass XSS filter'],
                tags: ['encoding-chain', 'bypass', 'waf-evasion', 'obfuscation']
            },

            // Hex Encoding Analysis
            {
                id: 'hex-encoding-analysis',
                name: 'Hex Encoding Analysis',
                description: 'Decode and analyze hex encoded data',
                category: 'Encoding & Cryptography',
                mcpTool: 'url_decode',
                template: 'Decode hex encoded data from {{source}}. Check for obfuscated payloads, credentials, or file paths in hex format.',
                parameters: [],
                examples: ['Decode hex string: 2f6574632f706173737764 = /etc/passwd'],
                tags: ['hex', 'decode', 'analysis', 'encoding']
            },

            // Weak Cryptography Detection
            {
                id: 'weak-crypto-detection',
                name: 'Weak Cryptography Detection',
                description: 'Detect use of weak cryptographic algorithms',
                category: 'Encoding & Cryptography',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to analyze crypto usage in {{url}}. Check for MD5, SHA1, DES, RC4, or other deprecated algorithms in headers, cookies, or responses.',
                parameters: [],
                examples: ['Check if password hashes use MD5 instead of bcrypt'],
                tags: ['weak-crypto', 'deprecated', 'algorithm', 'security']
            },

            // Predictable Token Generation
            {
                id: 'token-predictability',
                name: 'Token Predictability Analysis',
                description: 'Analyze tokens for predictable patterns',
                category: 'Encoding & Cryptography',
                mcpTool: 'generate_random_string',
                template: 'Use Burp MCP to analyze token generation at {{url}}. Collect multiple tokens to check for patterns, low entropy, or predictable sequences.',
                parameters: [],
                examples: ['Collect 100 session tokens to analyze for sequential patterns'],
                tags: ['token', 'predictability', 'entropy', 'random']
            },

            // Encryption Oracle
            {
                id: 'encryption-oracle',
                name: 'Encryption Oracle Attack',
                description: 'Test for encryption/padding oracle vulnerabilities',
                category: 'Encoding & Cryptography',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test encryption oracle at {{url}}. Manipulate encrypted data and observe error messages to decrypt without knowing the key.',
                parameters: [],
                examples: ['Test CBC mode encryption for padding oracle to decrypt cookie'],
                tags: ['encryption-oracle', 'padding-oracle', 'crypto', 'cbc']
            },

            // SAML Token Manipulation
            {
                id: 'saml-manipulation',
                name: 'SAML Token Manipulation',
                description: 'Test SAML tokens for signature bypass',
                category: 'Encoding & Cryptography',
                mcpTool: 'base64_decode',
                template: 'Use Burp MCP to decode and manipulate SAML token from {{url}}. Test for signature exclusion, signature wrapping, or XML signature bypass.',
                parameters: [],
                examples: ['Decode SAML response and remove signature to test validation'],
                tags: ['saml', 'xml-signature', 'sso', 'bypass']
            },

            // Certificate Validation
            {
                id: 'certificate-validation',
                name: 'SSL/TLS Certificate Analysis',
                description: 'Analyze SSL/TLS certificate security',
                category: 'Encoding & Cryptography',
                mcpTool: 'send_http1_request',
                template: 'Analyze SSL/TLS configuration of {{url}}. Check certificate validity, chain trust, cipher strength, protocol version, and vulnerabilities.',
                parameters: [],
                examples: ['Test for expired certificates, self-signed certs, weak ciphers'],
                tags: ['ssl', 'tls', 'certificate', 'crypto']
            },

            // Timing Attack
            {
                id: 'timing-attack',
                name: 'Timing Attack Test',
                description: 'Test for timing-based information disclosure',
                category: 'Encoding & Cryptography',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to perform timing analysis at {{url}}. Measure response times to detect timing-based user enumeration, password validation, or crypto operations.',
                parameters: [],
                examples: ['Measure login response times to enumerate valid usernames'],
                tags: ['timing-attack', 'side-channel', 'enumeration', 'crypto']
            },

            // ECB Detection
            {
                id: 'ecb-detection',
                name: 'ECB Mode Detection',
                description: 'Detect use of insecure ECB encryption mode',
                category: 'Encoding & Cryptography',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to detect ECB mode encryption at {{url}}. Send identical plaintext blocks and check if encrypted outputs are identical.',
                parameters: [],
                examples: ['Test cookie encryption with repeated blocks to detect ECB mode'],
                tags: ['ecb', 'encryption-mode', 'crypto', 'weak-crypto']
            },

            // Character Encoding Bypass
            {
                id: 'character-encoding-bypass',
                name: 'Character Encoding Bypass',
                description: 'Bypass filters using alternative character encodings',
                category: 'Encoding & Cryptography',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test character encoding bypass at {{url}}. Try UTF-7, UTF-16, UTF-32, or other encodings to bypass XSS/SQLi filters.',
                parameters: [],
                examples: ['Test XSS with UTF-7 encoding: +ADw-script+AD4-alert(1)+ADw-/script+AD4-'],
                tags: ['character-encoding', 'bypass', 'utf-7', 'filter-evasion']
            },

            // ═══════════════════════════════════════════════════════════
            // BUSINESS LOGIC (10 prompts)
            // ═══════════════════════════════════════════════════════════

            // Race Condition
            {
                id: 'race-condition',
                name: 'Race Condition Test',
                description: 'Test for race condition vulnerabilities',
                category: 'Business Logic',
                mcpTool: 'send_to_intruder',
                template: 'Use Burp MCP Intruder with single-packet attack mode to test race condition at {{url}}. Send parallel requests to exploit timing windows.',
                parameters: [],
                examples: ['Test /api/withdraw by sending 10 simultaneous requests to overdraw balance'],
                tags: ['race-condition', 'timing', 'concurrency', 'toctou']
            },

            // Payment Manipulation
            {
                id: 'payment-manipulation',
                name: 'Payment Amount Manipulation',
                description: 'Test payment flows for amount manipulation',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test payment manipulation at {{url}}. Try negative amounts, zero, decimal manipulation, or currency switching during checkout.',
                parameters: [],
                examples: ['Test /checkout by changing amount from 100.00 to 0.01 or -100.00'],
                tags: ['payment', 'price-manipulation', 'business-logic', 'fraud']
            },

            // Coupon/Discount Abuse
            {
                id: 'coupon-abuse',
                name: 'Coupon & Discount Code Abuse',
                description: 'Test for coupon/promo code abuse',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test coupon abuse at {{url}}. Try applying multiple coupons, reusing expired codes, or stacking discounts beyond 100%.',
                parameters: [],
                examples: ['Test if multiple discount codes can be applied simultaneously'],
                tags: ['coupon', 'discount', 'promo-code', 'abuse']
            },

            // Inventory Manipulation
            {
                id: 'inventory-manipulation',
                name: 'Inventory Quantity Manipulation',
                description: 'Test for inventory/stock manipulation',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test inventory manipulation at {{url}}. Try ordering negative quantities, exceeding stock limits, or race conditions on limited items.',
                parameters: [],
                examples: ['Test /cart by setting quantity to -1 or 999999 for limited item'],
                tags: ['inventory', 'stock', 'quantity', 'business-logic']
            },

            // Workflow Bypass
            {
                id: 'workflow-bypass',
                name: 'Multi-Step Workflow Bypass',
                description: 'Bypass multi-step business processes',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test workflow bypass at {{url}}. Skip steps in checkout, registration, or approval processes by jumping directly to final step.',
                parameters: [],
                examples: ['Test if /checkout/step3 can be accessed directly without completing step1,2'],
                tags: ['workflow', 'bypass', 'multi-step', 'business-logic']
            },

            // Refund/Credit Abuse
            {
                id: 'refund-abuse',
                name: 'Refund & Credit Abuse',
                description: 'Test refund/credit system for abuse',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test refund abuse at {{url}}. Try multiple refunds, refund before payment, or refund more than purchase amount.',
                parameters: [],
                examples: ['Test if same order can be refunded multiple times'],
                tags: ['refund', 'credit', 'abuse', 'fraud']
            },

            // Subscription Bypass
            {
                id: 'subscription-bypass',
                name: 'Subscription & Premium Bypass',
                description: 'Bypass subscription/premium feature restrictions',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to bypass subscription checks at {{url}}. Try accessing premium APIs directly, manipulating subscription status, or reusing trial periods.',
                parameters: [],
                examples: ['Test /api/premium-feature with free account token'],
                tags: ['subscription', 'premium', 'bypass', 'business-logic']
            },

            // Points/Loyalty Manipulation
            {
                id: 'loyalty-points-abuse',
                name: 'Loyalty Points Manipulation',
                description: 'Abuse loyalty points or reward systems',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test points manipulation at {{url}}. Try adding points without purchase, negative redemption, or integer overflow in points balance.',
                parameters: [],
                examples: ['Test /api/redeem by redeeming -1000 points to add points instead of subtract'],
                tags: ['loyalty-points', 'rewards', 'manipulation', 'fraud']
            },

            // Time-Based Logic Bypass
            {
                id: 'time-based-bypass',
                name: 'Time-Based Logic Bypass',
                description: 'Bypass time-based restrictions',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to bypass time restrictions at {{url}}. Manipulate timestamps, timezone parameters, or system time to access time-limited features.',
                parameters: [],
                examples: ['Test /api/limited-offer with manipulated timestamp to access expired promotion'],
                tags: ['time-based', 'timestamp', 'bypass', 'business-logic']
            },

            // Resource Exhaustion
            {
                id: 'resource-exhaustion',
                name: 'Application Resource Exhaustion',
                description: 'Test for resource exhaustion vulnerabilities',
                category: 'Business Logic',
                mcpTool: 'send_http1_request',
                template: 'Use Burp MCP to test resource exhaustion at {{url}}. Request expensive operations, large exports, complex calculations, or storage abuse.',
                parameters: [],
                examples: ['Test /api/export by requesting export of 10 million records'],
                tags: ['resource-exhaustion', 'dos', 'abuse', 'performance']
            },

            // ═══════════════════════════════════════════════════════════
            // REPORTING & DOCUMENTATION (10 prompts)
            // ═══════════════════════════════════════════════════════════

            // PoC Generation
            {
                id: 'poc-generation',
                name: 'Proof of Concept Generator',
                description: 'Generate PoC for discovered vulnerability',
                category: 'Reporting & Documentation',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to generate PoC for vulnerability found at {{url}}. Create reproducible steps, curl commands, and request/response samples.',
                parameters: [],
                examples: ['Generate PoC curl command for SQLi found in /api/search'],
                tags: ['poc', 'proof-of-concept', 'documentation', 'reporting']
            },

            // Evidence Collection
            {
                id: 'evidence-collection',
                name: 'Evidence Collection & Screenshots',
                description: 'Collect evidence for vulnerability report',
                category: 'Reporting & Documentation',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to collect evidence for {{vulnerability}} at {{url}}. Gather HTTP requests, responses, headers, and payload details.',
                parameters: [],
                examples: ['Collect evidence showing successful XSS execution with request/response'],
                tags: ['evidence', 'collection', 'reporting', 'documentation']
            },

            // Request History Analysis
            {
                id: 'history-analysis',
                name: 'HTTP History Analysis',
                description: 'Analyze Burp proxy history for patterns',
                category: 'Reporting & Documentation',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to analyze proxy history from {{url}}. Search for sensitive data, error messages, or security headers.',
                parameters: [],
                examples: ['Analyze proxy history for passwords, tokens, or API keys in requests'],
                tags: ['history', 'analysis', 'proxy', 'patterns']
            },

            // Security Headers Report
            {
                id: 'security-headers-report',
                name: 'Security Headers Analysis',
                description: 'Generate security headers compliance report',
                category: 'Reporting & Documentation',
                mcpTool: 'get_proxy_http_history',
                template: 'Use Burp MCP to analyze security headers from {{url}}. Check for CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.',
                parameters: [],
                examples: ['Generate report of missing security headers in application responses'],
                tags: ['security-headers', 'csp', 'hsts', 'report']
            },

            // Vulnerability Summary
            {
                id: 'vulnerability-summary',
                name: 'Vulnerability Summary Report',
                description: 'Generate comprehensive vulnerability summary',
                category: 'Reporting & Documentation',
                mcpTool: 'get_proxy_http_history',
                template: 'Generate comprehensive vulnerability summary for {{target}}. Include severity, CVSS scores, affected endpoints, and remediation recommendations.',
                parameters: [],
                examples: ['Create executive summary of all vulnerabilities found in assessment'],
                tags: ['summary', 'report', 'vulnerability', 'documentation']
            },

            // CVSS Calculator
            {
                id: 'cvss-calculation',
                name: 'CVSS Score Calculation',
                description: 'Calculate CVSS score for vulnerability',
                category: 'Reporting & Documentation',
                mcpTool: 'url_decode',
                template: 'Calculate CVSS v3.1 score for {{vulnerability}} at {{url}}. Consider exploitability, impact, and environmental metrics.',
                parameters: [],
                examples: ['Calculate CVSS score for reflected XSS with no authentication required'],
                tags: ['cvss', 'scoring', 'severity', 'risk']
            },

            // Remediation Recommendations
            {
                id: 'remediation-recommendations',
                name: 'Remediation Recommendations',
                description: 'Generate remediation guidance for vulnerabilities',
                category: 'Reporting & Documentation',
                mcpTool: 'url_decode',
                template: 'Generate remediation recommendations for {{vulnerability}} found at {{url}}. Include code examples, best practices, and verification steps.',
                parameters: [],
                examples: ['Create remediation guide for SQL injection with parameterized query example'],
                tags: ['remediation', 'fix', 'recommendations', 'guidance']
            },

            // Timeline Documentation
            {
                id: 'timeline-documentation',
                name: 'Assessment Timeline Documentation',
                description: 'Document assessment timeline and methodology',
                category: 'Reporting & Documentation',
                mcpTool: 'get_proxy_http_history',
                template: 'Document assessment timeline for {{target}}. Include scope, methodology, tools used, and key findings timeline.',
                parameters: [],
                examples: ['Create timeline showing when each vulnerability was discovered'],
                tags: ['timeline', 'documentation', 'methodology', 'report']
            },

            // Compliance Mapping
            {
                id: 'compliance-mapping',
                name: 'Compliance Framework Mapping',
                description: 'Map findings to compliance frameworks',
                category: 'Reporting & Documentation',
                mcpTool: 'url_decode',
                template: 'Map vulnerabilities from {{target}} to compliance requirements (OWASP Top 10, PCI-DSS, GDPR, etc.).',
                parameters: [],
                examples: ['Map SQLi finding to OWASP A03:2021 and PCI-DSS Req 6.5.1'],
                tags: ['compliance', 'owasp', 'pci-dss', 'mapping']
            },

            // Report Export
            {
                id: 'report-export',
                name: 'Professional Report Export',
                description: 'Export findings in professional report format',
                category: 'Reporting & Documentation',
                mcpTool: 'get_proxy_http_history',
                template: 'Export assessment findings for {{target}} in professional format. Include executive summary, technical details, evidence, and remediation.',
                parameters: [],
                examples: ['Export comprehensive penetration test report with all findings'],
                tags: ['export', 'report', 'professional', 'documentation']
            }
        ];
    }

    public getCategories(): vscode.TreeItem[] {
        const categories = [...new Set(this.prompts.map(p => p.category))];

        return categories.map(category => {
            const item = new vscode.TreeItem(
                category,
                vscode.TreeItemCollapsibleState.Collapsed
            );
            item.iconPath = new vscode.ThemeIcon('folder');
            item.contextValue = 'category';
            return item;
        });
    }

    public getPromptsByCategory(category: string): vscode.TreeItem[] {
        const prompts = this.prompts.filter(p => p.category === category);

        return prompts.map(prompt => {
            const item = new vscode.TreeItem(prompt.name);
            item.description = prompt.description;
            item.tooltip = new vscode.MarkdownString(
                `**${prompt.name}**\n\n${prompt.description}\n\n` +
                `**MCP Tool**: ${prompt.mcpTool}\n\n` +
                `**Tags**: ${prompt.tags.join(', ')}\n\n` +
                `**Examples**: ${prompt.examples[0]}`
            );
            item.iconPath = new vscode.ThemeIcon('file-code');
            item.command = {
                command: 'burpMCP.copyPrompt',
                title: 'Copy Prompt',
                arguments: [{ prompt }]
            };
            item.contextValue = 'prompt';
            return item;
        });
    }

    public async showLibrary(): Promise<void> {
        const categories = [...new Set(this.prompts.map(p => p.category))];

        const selected = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Select a prompt category'
        });

        if (!selected) {
            return;
        }

        const categoryPrompts = this.prompts.filter(p => p.category === selected);
        const promptNames = categoryPrompts.map(p => ({
            label: p.name,
            description: p.description,
            prompt: p
        }));

        const selectedPrompt = await vscode.window.showQuickPick(promptNames, {
            placeHolder: 'Select a security testing prompt'
        });

        if (selectedPrompt) {
            // Copy to clipboard
            await vscode.env.clipboard.writeText(selectedPrompt.prompt.template);
            vscode.window.showInformationMessage(
                `✅ Copied "${selectedPrompt.prompt.name}" to clipboard!\n\nPaste in Cursor Chat to use with Burp MCP.`
            );
        }
    }

    public getAllPrompts(): PromptTemplate[] {
        return this.prompts;
    }

    public getPromptById(id: string): PromptTemplate | undefined {
        return this.prompts.find(p => p.id === id);
    }

    public searchPrompts(query: string): PromptTemplate[] {
        const lowerQuery = query.toLowerCase();
        return this.prompts.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
}
