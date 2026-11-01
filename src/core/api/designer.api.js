import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../utils/url_api";
import { readSuccessResponse } from "../utils/apiResponse";

function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstString(...values) {
    return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

function getActiveFontCount(fonts) {
    const statuses = fonts.map((font) => {
        if (typeof font.isActive === "boolean") return font.isActive;
        if (typeof font.active === "boolean") return font.active;
        if (typeof font.is_approved === "boolean") return font.is_approved;
        if (typeof font.status === "string") {
            const status = font.status.toLowerCase();
            if (status === "active") return true;
            if (status === "inactive") return false;
        }

        return null;
    });

    return statuses.every((status) => status !== null)
        ? statuses.filter(Boolean).length
        : null;
}

function getNumber(...values) {
    return values.find((value) => typeof value === "number" && Number.isFinite(value)) ?? null;
}

function normalizeFont(value, designerName) {
    const font = isRecord(value) && isRecord(value.font) ? value.font : value;
    if (!isRecord(font)) {
        throw new TypeError("The designer API returned an invalid font.");
    }

    const id = font.id ?? font._id ?? font.font_id;
    if ((typeof id !== "string" && typeof id !== "number") || !String(id).trim()) {
        throw new TypeError("The designer API returned a font without an ID.");
    }

    const designer =
        typeof font.designer === "string"
            ? font.designer
            : firstString(
                font.store_id?.name,
                font.user_id?.name,
                font.user?.name,
                designerName,
            );

    return {
        ...font,
        id: String(id),
        name: firstString(font.name),
        designer,
        category:
            typeof font.category === "string"
                ? font.category
                : firstString(font.category_id?.name),
        fontFamily: firstString(font.fontFamily, font.font_family, font.name),
        previewText: firstString(font.previewText, font.preview_text, font.name),
    };
}

function normalizeDesigner(value) {
    if (!isRecord(value)) {
        throw new TypeError("The designer API returned an invalid user.");
    }

    const user = isRecord(value.user) ? value.user : value;
    const storeProfile = isRecord(value.store_profile) ? value.store_profile : {};
    const rawId = user.id ?? user.user_id ?? user._id ?? value.id ?? value.user_id ?? value._id;
    if ((typeof rawId !== "string" && typeof rawId !== "number") || !String(rawId).trim()) {
        throw new TypeError("The designer API returned a user without an ID.");
    }

    const name = firstString(
        user.name,
        user.username,
        user.full_name,
        storeProfile.name,
    );
    if (!name) {
        throw new TypeError("The designer API returned a user without a name.");
    }

    const rawFonts = value.fonts ?? value.font ?? [];
    if (!Array.isArray(rawFonts)) {
        throw new TypeError("The designer API response must contain a font array for each user.");
    }

    const fonts = rawFonts.map((font) => normalizeFont(font, name));
    const location = firstString(value.location, value.city, storeProfile.location);

    return {
        ...value,
        id: String(rawId),
        name,
        sourceName: name,
        studio: firstString(
            value.studio,
            value.studio_name,
            storeProfile.studio,
            storeProfile.name,
        ),
        location,
        avatar: firstString(
            value.avatar,
            value.avatar_url,
            value.profile_image,
            storeProfile.avatar,
            storeProfile.avatar_url,
        ),
        biography: firstString(
            value.biography,
            value.bio,
            value.description,
            storeProfile.biography,
            storeProfile.bio,
        ),
        activeFonts:
            getNumber(value.activeFonts, value.active_fonts) ?? getActiveFontCount(fonts),
        downloads: getNumber(value.downloads, value.download_count, storeProfile.downloads),
        rating: getNumber(value.rating, storeProfile.rate),
        appreciation: getNumber(value.appreciation, value.appreciation_count),
        fontCount: fonts.length,
        fonts,
    };
}

function readDesignerList(response) {
    const result = readSuccessResponse(response);
    const designers = Array.isArray(result)
        ? result
        : isRecord(result)
            ? result.designers ?? result.users
            : null;

    if (!Array.isArray(designers)) {
        throw new TypeError("The designer API response must contain a user array.");
    }

    return designers.map(normalizeDesigner);
}

let cachedDesigners = null;
let designersRequest = null;

class ApiDesigner {
    async getAllUserName({ refresh = false } = {}) {
        if (refresh) {
            cachedDesigners = null;
            designersRequest = null;
        }

        if (cachedDesigners !== null) {
            return cachedDesigners;
        }

        if (!designersRequest) {
            const request = ApiServices.get(ApiEndpoints.designers)
                .then(readDesignerList)
                .then((designers) => {
                    if (designersRequest === request) {
                        cachedDesigners = designers;
                    }
                    return designers;
                })
                .finally(() => {
                    if (designersRequest === request) {
                        designersRequest = null;
                    }
                });
            designersRequest = request;
        }

        return designersRequest;
    }

    async getAll(options) {
        return this.getAllUserName(options);
    }

    async refresh() {
        return this.getAllUserName({ refresh: true });
    }

    async getById(id) {
        if (typeof id !== "string" || !id.trim()) {
            throw new TypeError("A valid designer ID is required.");
        }

        const designers = await this.getAllUserName();
        return designers.find((designer) => designer.id === id) ?? null;
    }
}

export default new ApiDesigner();
