import React from 'react';

export interface ContributorLevelProps {
  approvedImages: number;
}

interface LevelInfo {
  name: string;
  requiredImages: number;
  color: string;
  benefits: string[];
}

const LEVELS: LevelInfo[] = [
  {
    name: "Rising Star",
    requiredImages: 100,
    color: "from-amber-500 to-yellow-500",
    benefits: [
      "Basic commission rate",
      "Standard support",
      "Community access"
    ]
  },
  {
    name: "Pro Creator",
    requiredImages: 500,
    color: "from-blue-500 to-indigo-500",
    benefits: [
      "5% higher commission rate",
      "Priority support",
      "Early access to features",
      "Custom portfolio page"
    ]
  },
  {
    name: "Elite Master",
    requiredImages: 1000,
    color: "from-purple-500 to-fuchsia-500",
    benefits: [
      "10% higher commission rate",
      "Dedicated support manager",
      "Featured creator status",
      "Custom watermark",
      "Analytics dashboard"
    ]
  }
];

export function ContributorLevel({ approvedImages }: ContributorLevelProps) {
  const getCurrentLevel = () => {
    if (approvedImages >= LEVELS[2].requiredImages) return 2;
    if (approvedImages >= LEVELS[1].requiredImages) return 1;
    if (approvedImages >= LEVELS[0].requiredImages) return 0;
    return -1;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = currentLevel < 2 ? currentLevel + 1 : currentLevel;
  const progress = currentLevel === -1 
    ? (approvedImages / LEVELS[0].requiredImages) * 100
    : currentLevel === 2 
    ? 100
    : ((approvedImages - LEVELS[currentLevel].requiredImages) / 
       (LEVELS[nextLevel].requiredImages - LEVELS[currentLevel].requiredImages)) * 100;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/40 overflow-hidden">
      {/* Current Level Header */}
      <div className="p-6 border-b border-gray-800/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            Contributor Level
          </h3>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800/60 text-gray-300">
            {approvedImages} images
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${
            currentLevel >= 0 ? LEVELS[currentLevel].color : "from-gray-600 to-gray-700"
          } flex items-center justify-center`}>
            <span className="text-2xl font-bold text-white">
              {currentLevel >= 0 ? currentLevel + 1 : '0'}
            </span>
          </div>
          <div>
            <h4 className="text-lg font-medium text-white">
              {currentLevel >= 0 ? LEVELS[currentLevel].name : "Getting Started"}
            </h4>
            {currentLevel < 2 && (
              <p className="text-sm text-gray-400">
                {LEVELS[currentLevel + 1].requiredImages - approvedImages} more images until next level
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-gray-800/60 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${
              currentLevel >= 0 ? LEVELS[currentLevel].color : "from-gray-600 to-gray-700"
            } transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Levels List */}
      <div className="p-6">
        <div className="space-y-6">
          {LEVELS.map((level, index) => (
            <div 
              key={level.name}
              className={`relative ${
                currentLevel === index 
                  ? "opacity-100" 
                  : currentLevel > index 
                  ? "opacity-75" 
                  : "opacity-50"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                  <span className="text-lg font-bold text-white">{index + 1}</span>
                </div>
                <div>
                  <h5 className="text-white font-medium">{level.name}</h5>
                  <p className="text-sm text-gray-400">{level.requiredImages} approved images</p>
                </div>
                {currentLevel >= index && (
                  <div className="ml-auto">
                    <span className="text-emerald-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-14 text-sm text-gray-400 space-y-1">
                {level.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 