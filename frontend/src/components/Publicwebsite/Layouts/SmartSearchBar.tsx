import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Sparkles, X } from 'lucide-react';
import { searchService } from '../../../services/searchService';
import { useDebounce } from '../../../hooks/useDebounce';

const SmartSearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [correctedQuery, setCorrectedQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [intent, setIntent] = useState('');

    const debouncedQuery = useDebounce(query, 400);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 2) {
                setSuggestions([]);
                setShowDropdown(false);
                return;
            }

            setLoading(true);
            try {
                const response = await searchService.getSuggestions(debouncedQuery);
                if (response.data.success) {
                    const { suggestions, correctedQuery, intent } = response.data.data;
                    setSuggestions(suggestions);
                    setCorrectedQuery(correctedQuery);
                    setIntent(intent);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchTerms: string) => {
        if (searchTerms.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerms.trim())}`);
            setShowDropdown(false);
            setQuery(searchTerms);
        }
    };

    return (
        <div className="relative w-full max-w-md group" ref={dropdownRef}>
            <div className={`flex items-center bg-gray-100 rounded-xl px-4 py-2 border-2 transition-all ${showDropdown ? 'border-emerald-500 shadow-md ring-4 ring-emerald-50' : 'border-transparent group-hover:bg-gray-200'}`}>
                <input
                    type="text"
                    placeholder="Search with AI (e.g. healthy snacks)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowDropdown(true)}
                    className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-full font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(correctedQuery || query)}
                />

                <div className="flex items-center space-x-2 ml-2">
                    {loading ? (
                        <Loader2 className="h-5 w-5 text-emerald-600 animate-spin" />
                    ) : query ? (
                        <button onClick={() => { setQuery(''); setSuggestions([]); }} className="hover:text-red-500 transition-colors" aria-label="Clear search">
                            <X className="h-4 w-4 text-gray-400" />
                        </button>
                    ) : (
                        <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                    )}
                    <button
                        onClick={() => handleSearch(correctedQuery || query)}
                        className="p-1 rounded-lg hover:bg-emerald-100 transition-colors"
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5 text-emerald-600" />
                    </button>
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && (suggestions.length > 0 || correctedQuery) && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">

                    {correctedQuery && correctedQuery.toLowerCase() !== query.toLowerCase() && (
                        <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                            <p className="text-sm text-gray-500">
                                Did you mean: <button onClick={() => handleSearch(correctedQuery)} className="text-emerald-700 font-bold hover:underline">{correctedQuery}</button>
                            </p>
                        </div>
                    )}

                    {intent && intent !== 'general_search' && (
                        <div className="px-4 py-2 bg-gray-50 flex items-center">
                            <Sparkles className="h-3 w-3 text-emerald-500 mr-2" />
                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Intent: {intent.replace('_', ' ')}</span>
                        </div>
                    )}

                    <div className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSearch(suggestion)}
                                className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-100 transition-colors group"
                            >
                                <Search className="h-4 w-4 text-gray-400 mr-3 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-gray-700 font-medium">{suggestion}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartSearchBar;
