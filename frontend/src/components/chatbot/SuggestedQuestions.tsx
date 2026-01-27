import React from 'react';

interface SuggestedQuestionsProps {
    questions: string[];
    onSelect: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions, onSelect }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2">
            {questions.map((question, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(question)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 shadow-sm active:scale-95"
                >
                    {question}
                </button>
            ))}
        </div>
    );
};

export default SuggestedQuestions;
