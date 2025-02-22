"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    trait: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How do you typically spend your free time?",
    options: [
      { text: "Reading or learning new things", trait: "intellectual" },
      { text: "Helping others and volunteering", trait: "nurturing" },
      { text: "Being active and outdoors", trait: "energetic" },
      { text: "Creating or expressing artistically", trait: "creative" }
    ]
  },
  {
    id: 2,
    text: "How do you handle stress?",
    options: [
      { text: "Stay calm and analyze the situation", trait: "resilient" },
      { text: "Seek support from others", trait: "social" },
      { text: "Take action immediately", trait: "proactive" },
      { text: "Adapt and go with the flow", trait: "flexible" }
    ]
  },
  {
    id: 3,
    text: "What's your approach to challenges?",
    options: [
      { text: "Methodical and strategic", trait: "analytical" },
      { text: "Collaborative and team-oriented", trait: "social" },
      { text: "Bold and direct", trait: "confident" },
      { text: "Patient and persistent", trait: "resilient" }
    ]
  },
  {
    id: 4,
    text: "How would others describe your personality?",
    options: [
      { text: "Wise and thoughtful", trait: "intellectual" },
      { text: "Caring and supportive", trait: "nurturing" },
      { text: "Energetic and enthusiastic", trait: "energetic" },
      { text: "Calm and peaceful", trait: "peaceful" }
    ]
  },
  {
    id: 5,
    text: "What's most important to you in life?",
    options: [
      { text: "Growth and learning", trait: "intellectual" },
      { text: "Helping others", trait: "nurturing" },
      { text: "Adventure and experiences", trait: "energetic" },
      { text: "Peace and harmony", trait: "peaceful" }
    ]
  },
  {
    id: 6,
    text: "How do you prefer to work?",
    options: [
      { text: "Independently and focused", trait: "independent" },
      { text: "In a team with others", trait: "social" },
      { text: "Leading and directing", trait: "confident" },
      { text: "Flexibly and adaptably", trait: "flexible" }
    ]
  },
  {
    id: 7,
    text: "What's your ideal environment?",
    options: [
      { text: "Quiet and organized", trait: "peaceful" },
      { text: "Bustling and social", trait: "social" },
      { text: "Natural and outdoors", trait: "energetic" },
      { text: "Creative and inspiring", trait: "creative" }
    ]
  }
];

export default function SoulTreeQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tree: string; description: string } | null>(null);

  const handleAnswer = async (trait: string) => {
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      try {
        const response = await fetch('/api/analyze-personality', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ traits: newAnswers }),
        });

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error analyzing personality:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdoptClick = () => {
    if (result) {
      router.push(`/adopt/${result.tree.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          Discover Your Soul Tree
        </h1>

        {!result ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
                <p className="text-gray-600">Analyzing your responses...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  {questions[currentQuestion].text}
                </h2>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option.trait)}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Your Soul Tree is the {result.tree}!
            </h2>
            <p className="text-gray-600 mb-8">{result.description}</p>
            <button
              onClick={handleAdoptClick}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Adopt Your Soul Tree
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 