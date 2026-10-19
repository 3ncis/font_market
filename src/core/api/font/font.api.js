import fonts from '../../data/fonts.json';

class ApiFont {
    async getAll() {
        try {
            return fonts;
        } catch (error) {
            return { error };
        }
    }

    async getByFilter(search = '', category = 'all') {
        try {
            let result = [...fonts];

            if (search) {
                const keyword = search.toLowerCase();
                result = result.filter((font) =>
                    `${font.name} ${font.designer} ${font.category}`
                        .toLowerCase()
                        .includes(keyword)
                );
            }

            if (category !== 'all') {
                result = result.filter((font) =>
                    font.category.toLowerCase().includes(category.toLowerCase())
                );
            }

            return result;
        } catch (error) {
            return { error };
        }
    }

    async getById(id) {
        try {
            return fonts.find((font) => font.id === id) ?? null;
        } catch (error) {
            return { error };
        }
    }
}

export default new ApiFont();