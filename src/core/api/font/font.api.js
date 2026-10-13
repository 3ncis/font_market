import fonts from '../../data/fonts.json';

class ApiFont {
    async getAll(){
        try {
            return fonts;
            // const resp = fonts.forEach((font) => {
            //     return font;
            // });
            return resp;
        } catch (error) {
            return {error};
        }
    }
}

export default new ApiFont();