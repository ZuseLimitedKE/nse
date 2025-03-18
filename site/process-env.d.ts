declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CONN_STRING: string
        }
    }
}

export {}