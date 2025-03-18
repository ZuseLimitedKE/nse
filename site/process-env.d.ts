declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CONN_STRING: string,
            NEXT_PUBLIC_PROJECT_ID: string
        }
    }
}

export {}