export const config = {
    general: {
        name: "AI Picture",
    },
    env: {
        isSeed: !!process.env.SEED,
        isProduction: process.env.NODE_ENV === "production",
    },
    auth: {
        cookieMaxAge: 7 * 24 * 60 * 60,
    },
};
