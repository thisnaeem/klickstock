import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon, 
  ArrowDownTrayIcon, 
  EyeIcon, 
  PhotoIcon 
} from "@heroicons/react/24/solid";

interface ContributorStatsProps {
  totalUploads: number;
  approved: number;
  pending: number;
  rejected: number;
  totalDownloads: number;
  totalViews: number;
}

export const ContributorStats = ({
  totalUploads,
  approved,
  pending,
  rejected,
  totalDownloads,
  totalViews
}: ContributorStatsProps) => {
  const stats = [
    {
      label: "Total Uploads",
      value: totalUploads,
      icon: <PhotoIcon className="w-6 h-6" />,
      iconColor: "text-blue-600"
    },
    {
      label: "Approved",
      value: approved,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      iconColor: "text-green-600"
    },
    {
      label: "Pending Review",
      value: pending,
      icon: <ClockIcon className="w-6 h-6" />,
      iconColor: "text-amber-500"
    },
    {
      label: "Rejected",
      value: rejected,
      icon: <ExclamationCircleIcon className="w-6 h-6" />,
      iconColor: "text-red-600"
    },
    {
      label: "Total Downloads",
      value: totalDownloads,
      icon: <ArrowDownTrayIcon className="w-6 h-6" />,
      iconColor: "text-blue-600"
    },
    {
      label: "Total Views",
      value: totalViews,
      icon: <EyeIcon className="w-6 h-6" />,
      iconColor: "text-indigo-600"
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white rounded-xl p-5 flex items-center shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className={`mr-4 rounded-full p-3 bg-gray-50 ${stat.iconColor}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{stat.value.toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 