// Logical bindings only. Values are configured through Sites, never in source.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    CV_FILE_KEY?: string;
    CV_PASSWORD_HASH?: string;
    ANALYTICS_SECRET?: string;
  }
}
