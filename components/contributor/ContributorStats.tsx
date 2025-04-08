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
      color: "bg-gray-800",
      textColor: "text-white",
      iconColor: "text-white"
    },
    {
      label: "Approved",
      value: approved,
      icon: <CheckCircleIcon className="w-6 h-6" />,
      color: "bg-green-600",
      textColor: "text-white",
      iconColor: "text-white"
    },
    {
      label: "Pending Review",
      value: pending,
      icon: <ClockIcon className="w-6 h-6" />,
      color: "bg-yellow-500",
      textColor: "text-white",
      iconColor: "text-white"
    },
    {
      label: "Rejected",
      value: rejected,
      icon: <ExclamationCircleIcon className="w-6 h-6" />,
      color: "bg-red-600",
      textColor: "text-white",
      iconColor: "text-white"
    },
    {
      label: "Total Downloads",
      value: totalDownloads,
      icon: <ArrowDownTrayIcon className="w-6 h-6" />,
      color: "bg-blue-600",
      textColor: "text-white",
      iconColor: "text-white"
    },
    {
      label: "Total Views",
      value: totalViews,
      icon: <EyeIcon className="w-6 h-6" />,
      color: "bg-purple-600",
      textColor: "text-white",
      iconColor: "text-white"
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`${stat.color} rounded-xl p-5 flex items-center shadow-lg transition-transform hover:scale-105`}
          >
            <div className={`mr-4 rounded-full p-3 bg-opacity-25 bg-white ${stat.iconColor}`}>
              {stat.icon}
            </div>
            <div>
              <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value.toLocaleString()}</div>
              <div className={`text-sm font-medium opacity-80 ${stat.textColor}`}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 