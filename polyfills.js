// Polyfills for StackBlitz environment
if (typeof global !== 'undefined') {
  // Add fetch polyfill for Node.js environment (needed by Next.js during startup)
  if (typeof global.fetch === 'undefined') {
    try {
      const undici = require('undici');
      global.fetch = undici.fetch;
      global.Request = undici.Request;
      global.Response = undici.Response;
      global.Headers = undici.Headers;
      global.FormData = undici.FormData;
    } catch (e) {
      // Minimal fetch polyfill as fallback
      global.fetch = async (url, options = {}) => {
        const https = require('https');
        const http = require('http');
        const { URL } = require('url');
        
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        
        return new Promise((resolve, reject) => {
          const req = protocol.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              resolve({
                ok: res.statusCode >= 200 && res.statusCode < 300,
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: res.headers,
                json: async () => JSON.parse(data),
                text: async () => data,
              });
            });
          });
          req.on('error', reject);
          if (options.body) req.write(options.body);
          req.end();
        });
      };
    }
  }

  // Add Request polyfill if not available
  if (typeof global.Request === 'undefined') {
    try {
      const { Request } = require('undici');
      global.Request = Request;
    } catch (e) {
      // Fallback: create a minimal Request polyfill
      global.Request = class Request {
        constructor(input, init) {
          this.url = typeof input === 'string' ? input : input.url;
          this.method = init?.method || 'GET';
          this.headers = init?.headers || {};
          this.body = init?.body;
        }
      };
    }
  }

  // Add Response polyfill if not available
  if (typeof global.Response === 'undefined') {
    try {
      const { Response } = require('undici');
      global.Response = Response;
    } catch (e) {
      global.Response = class Response {
        constructor(body, init) {
          this.body = body;
          this.status = init?.status || 200;
          this.statusText = init?.statusText || 'OK';
          this.headers = init?.headers || {};
        }
        
        async json() {
          return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
        }
        
        async text() {
          return String(this.body);
        }
      };
    }
  }

  // Add Headers polyfill if not available
  if (typeof global.Headers === 'undefined') {
    try {
      const { Headers } = require('undici');
      global.Headers = Headers;
    } catch (e) {
      global.Headers = class Headers {
        constructor(init) {
          this.map = new Map();
          if (init) {
            Object.entries(init).forEach(([key, value]) => {
              this.map.set(key.toLowerCase(), value);
            });
          }
        }
        
        get(name) {
          return this.map.get(name.toLowerCase());
        }
        
        set(name, value) {
          this.map.set(name.toLowerCase(), value);
        }
        
        has(name) {
          return this.map.has(name.toLowerCase());
        }
        
        delete(name) {
          this.map.delete(name.toLowerCase());
        }
      };
    }
  }
}

