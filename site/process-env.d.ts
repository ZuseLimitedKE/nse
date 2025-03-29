declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONN_STRING: string;
      NEXT_PUBLIC_PROJECT_ID: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      AUTHORIZATION: string;
      BUSINESS_SHORT_CODE: string;
      PASS_KEY: string;
      URL: string;
      PAYSTACK_URL: string;
      PAYSTACK_SECRET: string;
      WHATSAPP_TOKEN: string;
      WHATSAPP_PHONE_ID: string;
      NOTIFIER_NUMBER: string;
      ACCOUNTID: string;
      PRIVATEKEY: string;
    }
  }
}

export { };
