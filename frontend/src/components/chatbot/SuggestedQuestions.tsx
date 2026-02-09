import React from 'react';

interface SuggestedQuestionsProps {
    questions: string[];
    onSelect: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions, onSelect }) => {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-3">
            {questions.map((question, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(question)}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-full text-[12px] font-semibold text-emerald-700 hover:from-emerald-100 hover:to-teal-100 hover:border-emerald-200 hover:shadow-sm transition-all duration-200"
                >
                    {question}
                </button>
            ))}
        </div>
    );
};

export default SuggestedQuestions;
