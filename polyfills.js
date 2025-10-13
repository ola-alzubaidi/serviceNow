// Polyfills for StackBlitz environment
if (typeof global !== 'undefined') {
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

