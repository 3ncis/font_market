import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "@/core/utils/url_api";
import { readSuccessResponse } from "@/core/utils/apiResponse";

export interface FontCategory {
    id: string;
    name: string;
}

export interface FontFamilySummary {
    name: string;
    original_name: string;
    format: string;
    size: number;
}

export interface CreatorFont {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    character_set: string;
    status: string;
    is_approved: boolean;
    review_note: string | null;
    font_families: FontFamilySummary[];
    created_at: string;
    category_id?: { id?: string; name?: string } | string;
    user_id?: { id?: string; name?: string; email?: string } | string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseFont(value: unknown): CreatorFont {
    if (
        !isRecord(value) ||
        typeof (value.id ?? value._id) !== "string" ||
        typeof value.name !== "string" ||
        typeof value.slug !== "string" ||
        typeof value.price !== "number" ||
        typeof value.status !== "string" ||
        typeof value.is_approved !== "boolean" ||
        !Array.isArray(value.font_families) ||
        typeof value.created_at !== "string"
    ) {
        throw new TypeError("The font API returned an invalid font record.");
    }

    const families = value.font_families.map((family): FontFamilySummary => {
        if (
            !isRecord(family) ||
            typeof family.name !== "string" ||
            typeof family.original_name !== "string" ||
            typeof family.format !== "string" ||
            typeof family.size !== "number"
        ) {
            throw new TypeError("The font API returned an invalid family file.");
        }
        return {
            name: family.name,
            original_name: family.original_name,
            format: family.format,
            size: family.size,
        };
    });

    let category: CreatorFont["category_id"];
    if (typeof value.category_id === "string") {
        category = value.category_id;
    } else if (isRecord(value.category_id)) {
        category = {
            ...(typeof value.category_id.id === "string"
                ? { id: value.category_id.id }
                : {}),
            ...(typeof value.category_id.name === "string"
                ? { name: value.category_id.name }
                : {}),
        };
    }

    let creator: CreatorFont["user_id"];
    if (typeof value.user_id === "string") {
        creator = value.user_id;
    } else if (isRecord(value.user_id)) {
        creator = {
            ...(typeof value.user_id.id === "string" ? { id: value.user_id.id } : {}),
            ...(typeof value.user_id.name === "string"
                ? { name: value.user_id.name }
                : {}),
            ...(typeof value.user_id.email === "string"
                ? { email: value.user_id.email }
                : {}),
        };
    }

    return {
        id: String(value.id ?? value._id),
        name: value.name,
        slug: value.slug,
        price: value.price,
        description: typeof value.description === "string" ? value.description : "",
        character_set: typeof value.character_set === "string" ? value.character_set : "",
        status: value.status,
        is_approved: value.is_approved,
        review_note: typeof value.review_note === "string" ? value.review_note : null,
        font_families: families,
        created_at: value.created_at,
        ...(category !== undefined ? { category_id: category } : {}),
        ...(creator !== undefined ? { user_id: creator } : {}),
    };
}

export function parseFontRecord(value: unknown): CreatorFont {
    return parseFont(value);
}

class FontSubmissionApi {
    async listCategories(): Promise<FontCategory[]> {
        const response = await ApiServices.get(ApiEndpoints.fontCategories);
        const data = readSuccessResponse(response);
        if (!Array.isArray(data)) {
            throw new TypeError("The category API did not return a category array.");
        }

        return data.map((category) => {
            if (
                !isRecord(category) ||
                typeof (category.id ?? category._id) !== "string" ||
                typeof category.name !== "string"
            ) {
                throw new TypeError("The category API returned an invalid category.");
            }
            return { id: String(category.id ?? category._id), name: category.name };
        });
    }

    async listMine(): Promise<CreatorFont[]> {
        const response = await ApiServices.get(ApiEndpoints.myFonts);
        const data = readSuccessResponse(response);
        if (!Array.isArray(data)) {
            throw new TypeError("The creator fonts API did not return a font array.");
        }
        return data.map(parseFont);
    }

    async create(formData: FormData): Promise<CreatorFont> {
        const response = await ApiServices.post(ApiEndpoints.fonts, formData);
        return parseFont(readSuccessResponse(response));
    }

    async submitForReview(fontId: string): Promise<CreatorFont> {
        const response = await ApiServices.post(ApiEndpoints.submitFont(fontId));
        return parseFont(readSuccessResponse(response));
    }

    async update(fontId: string, formData: FormData): Promise<CreatorFont> {
        const response = await ApiServices.patch(
            `${ApiEndpoints.fonts}/${encodeURIComponent(fontId)}`,
            formData,
        );
        return parseFont(readSuccessResponse(response));
    }

}

export default new FontSubmissionApi();
