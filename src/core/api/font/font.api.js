import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../../utils/url_api";
import { readSuccessResponse } from "../../utils/apiResponse";

function normalizeFont(font) {
    if (!font || typeof font !== "object") {
        throw new TypeError("The fonts API returned an invalid font.");
    }

    const category =
        typeof font.category === "string"
            ? font.category
            : font.category_id?.name ?? "";
    const designer =
        typeof font.designer === "string"
            ? font.designer
            : font.store_id?.name ?? "";
    const name = typeof font.name === "string" ? font.name : "";

    return {
        ...font,
        id: String(font.id ?? font._id ?? ""),
        name,
        designer,
        category,
        fontFamily: font.fontFamily ?? name,
        previewText: font.previewText ?? name,
    };
}

function readFontList(response) {
    const fonts = response?.data?.data;
    if (!Array.isArray(fonts)) {
        throw new TypeError("The fonts API response must contain a data array.");
    }

    return fonts.map(normalizeFont);
}

class ApiFont {
    async getAll() {
        const fonts = [];
        let page = 1;
        let totalPages = 1;

        do {
            const response = await ApiServices.get(ApiEndpoints.fonts, {
                params: { page, limit: 50 },
            });
            fonts.push(...readFontList(response));

            const reportedPages = Number(response?.data?.meta?.total_pages ?? 1);
            if (!Number.isInteger(reportedPages) || reportedPages < 0) {
                throw new TypeError("The fonts API returned invalid pagination metadata.");
            }

            totalPages = reportedPages;
            page += 1;
        } while (page <= totalPages);
        return fonts;
    }

    async getByFilter(search = "", category = "all") {
        const fonts = await this.getAll();
        const keyword = search.trim().toLowerCase();

        return fonts.filter((font) => {
            const matchesSearch =
                !keyword ||
                `${font.name} ${font.designer} ${font.category}`
                    .toLowerCase()
                    .includes(keyword);
            const matchesCategory =
                category === "all" ||
                font.category.toLowerCase().includes(category.toLowerCase());

            return matchesSearch && matchesCategory;
        });
    }

    async getById(slug) {
        const response = await ApiServices.get(ApiEndpoints.fontBySlug(slug));
        const font = readSuccessResponse(response);

        if (!font) {
            throw new TypeError("The font API response did not contain a font.");
        }

        return normalizeFont(font);
    }
}

export default new ApiFont();
