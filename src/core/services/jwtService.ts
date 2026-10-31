const TOKEN_STORAGE_KEY = "token";

const JwtService = {
    getToken(): string | null {
        if (typeof window === "undefined") {
            return null;
        }

        return window.localStorage.getItem(TOKEN_STORAGE_KEY)?.trim() || null;
    },

    saveToken(token: string): void {
        const normalizedToken = token.trim();
        if (!normalizedToken) {
            throw new Error("Cannot save an empty authentication token.");
        }

        window.localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken);
    },

    destroyToken(): void {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
};

export default JwtService;