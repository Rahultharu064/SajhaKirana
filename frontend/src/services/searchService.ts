import api from "./api";

export interface SearchSuggestion {
    correctedQuery: string;
    suggestions: string[];
    intent: string;
}

export const searchService = {
    search: async (q: string, params: { userId?: number; limit?: number } = {}) => {
        return await api.get("/search", { params: { q, ...params } });
    },

    getSuggestions: async (q: string) => {
        return await api.get("/search/suggestions", { params: { q } });
    }
};
