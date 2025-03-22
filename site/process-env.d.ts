declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONN_STRING: string;
      NEXT_PUBLIC_PROJECT_ID: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      AUTHORIZATION: string;

    }
  }
}

export { };
