import api from "./api";

// Get all districts
export const getDistricts = () => {
    return api.get('/districts');
}

export type District = string;
