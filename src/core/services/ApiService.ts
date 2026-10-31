import axios from "axios";

const Apiservices = await axios.create({
    baseURL: import.meta.env.BASE_URL,
});

export default Apiservices;