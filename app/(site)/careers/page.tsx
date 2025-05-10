import { Building2, Globe2, Users2 } from 'lucide-react';

const values = [
  {
    icon: Users2,
    title: "Collaborative Environment",
    description: "Work with talented individuals who share your passion for creativity and innovation."
  },
  {
    icon: Globe2,
    title: "Remote-First",
    description: "Enjoy the flexibility of working from anywhere in the world with our distributed team."
  },
  {
    icon: Building2,
    title: "Growth Opportunities",
    description: "Continuous learning and career development opportunities to help you reach your full potential."
  }
];

const benefits = [
  "Competitive salary and equity",
  "Flexible working hours",
  "Health insurance",
  "Learning and development budget",
  "Home office setup allowance",
  "Annual team retreats",
  "Paid time off",
  "Parental leave",
  "Mental health support"
];

const openings = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Join our frontend team to build beautiful and performant user interfaces that help creators showcase their work."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Help shape the future of our platform by creating intuitive and delightful user experiences."
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive our content strategy and help us connect with creators worldwide through compelling storytelling."
  },
  {
    title: "Customer Success Specialist",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    description: "Be the voice of KlickStock and help our users succeed in their creative journey."
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Join Our Team
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Help us build the future of visual content creation
            </p>
          </div>
        </div>
      </div>

      {/* Company Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Our Values</h2>
          <p className="mt-4 text-xl text-gray-400">
            What drives us every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50 text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Benefits</h2>
            <p className="mt-4 text-xl text-gray-400">
              What you'll get when you join us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-900/60 rounded-2xl p-6 text-center border border-gray-800/50 hover:border-indigo-600/50 transition-colors"
              >
                <p className="text-gray-400">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Open Positions</h2>
            <p className="mt-4 text-xl text-gray-400">
              Find your next opportunity
            </p>
          </div>

          <div className="space-y-6">
            {openings.map((job, index) => (
              <div
                key={index}
                className="bg-gray-900/60 rounded-2xl p-8 border border-gray-800/50 hover:border-indigo-600/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-600/20 text-indigo-400">
                        {job.department}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600/20 text-green-400">
                        {job.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600/20 text-purple-400">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                    Apply Now
                  </button>
                </div>
                <p className="mt-4 text-gray-400">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 