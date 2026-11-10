import router from "@/router";
import { defineStore } from "pinia";
import AuthApi from "@/core/auth/auth.api";
import JwtService from "@/core/services/jwtService";

type UserRole = "admin" | "buyer" | "creator" | "customer" | string;

interface PublicUser {
    id: string | number;
    name: string;
    email: string;
    role?: UserRole;
    roles?: UserRole[];
    created_at?: string;
    updated_at?: string;
}

interface AuthState {
    user: PublicUser | null;
    token: string | null;
}

interface AuthResult {
    user: PublicUser;
    token: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseUser(value: unknown): PublicUser {
    const userId = isRecord(value) ? value.id ?? value.user_id : undefined;

    if (
        !isRecord(value) ||
        (typeof userId !== "string" && typeof userId !== "number") ||
        typeof value.name !== "string" ||
        typeof value.email !== "string"
    ) {
        throw new TypeError("The authentication API returned an invalid user profile.");
    }

    const normalizeRole = (role: string): UserRole =>
        ["developer", "designer", "seller"].includes(role.toLowerCase())
            ? "creator"
            : role;

    return {
        id: userId,
        name: value.name,
        email: value.email,
        ...(typeof value.role === "string" ? { role: normalizeRole(value.role) } : {}),
        ...(Array.isArray(value.roles) &&
        value.roles.every((role) => typeof role === "string")
            ? { roles: value.roles.map(normalizeRole) }
            : {}),
        ...(typeof value.created_at === "string"
            ? { created_at: value.created_at }
            : {}),
        ...(typeof value.updated_at === "string"
            ? { updated_at: value.updated_at }
            : {}),
    };
}

function parseAuthResult(value: unknown): AuthResult {
    if (
        !isRecord(value) ||
        typeof value.token !== "string" ||
        !value.token.trim()
    ) {
        throw new TypeError("The authentication API did not return a valid token.");
    }

    return {
        user: parseUser(value.user),
        token: value.token,
    };
}

function hasRole(user: PublicUser | null, ...roles: string[]): boolean {
    const assignedRoles = [user?.role, ...(user?.roles ?? [])];
    return assignedRoles.some(
        (role) =>
            typeof role === "string" &&
            roles.includes(role.trim().toLowerCase()),
    );
}

function getErrorStatus(error: unknown): number | undefined {
    if (!isRecord(error) || !isRecord(error.response)) {
        return undefined;
    }

    return typeof error.response.status === "number"
        ? error.response.status
        : undefined;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: JwtService.getToken(),
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.token),
        currentUser: (state) => state.user,
        userRole: (state) => state.user?.role ?? null,
        isAdmin: (state) => hasRole(state.user, "admin"),
        isBuyer: (state) => hasRole(state.user, "buyer"),
        isCreator: (state) => hasRole(state.user, "creator"),
    },

    actions: {
        applyAuth(result: unknown): PublicUser {
            const { user, token } = parseAuthResult(result);
            JwtService.saveToken(token);
            this.user = user;
            this.token = token;

            if (hasRole(user, "admin")) {
                void router.push({ name: "admin-users" });
            } else if (hasRole(user, "creator")) {
                void router.push("#");
            } else {
                void router.push("/");
            }

            return user;
        },

        async register(name: string, email: string, password: string) {
            const result: unknown = await AuthApi.register({ name, email, password });
            return this.applyAuth(result);
        },

        async registerCreator(name: string, email: string, password: string) {
            const result: unknown = await AuthApi.registerCreator({
                name,
                email,
                password,
            });
            return this.applyAuth(result);
        },

        async login(email: string, password: string) {
            const result: unknown = await AuthApi.login(email, password);
            return this.applyAuth(result);
        },

        async loadCurrentUser(): Promise<PublicUser | null> {
            const token = JwtService.getToken();
            if (!token) {
                this.user = null;
                this.token = null;
                return null;
            }

            this.token = token;

            try {
                const profile: unknown = await AuthApi.getCurrentUser();
                this.user = parseUser(profile);
                return this.user;
            } catch (error) {
                if (getErrorStatus(error) === 401) {
                    this.clearAuth();
                }

                throw error;
            }
        },

        clearAuth() {
            JwtService.destroyToken();
            this.user = null;
            this.token = null;
        },

        async logout() {
            this.clearAuth();
            await router.push("/login");
        },
    },
});
