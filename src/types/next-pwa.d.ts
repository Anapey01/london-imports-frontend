declare module 'next-pwa' {
    import { NextConfig } from 'next';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function withPWA(config: any): (nextConfig: NextConfig) => NextConfig;

    export default withPWA;
}
