import { plugins } from 'cypress-social-logins';

module.exports = (
  on: (
    arg0: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    arg1: { GoogleSocialLogin: (options?: {}) => Promise<{ cookies: any; lsd: any; ssd: any }> },
  ) => void,
) => {
  on('task', {
    GoogleSocialLogin: plugins.GoogleSocialLogin,
  });
};
