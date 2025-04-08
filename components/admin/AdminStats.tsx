import { 
  Users, 
  UserCog, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle, 
  XCircle 
} from "lucide-react";

interface AdminStatsProps {
  totalUsers: number;
  contributors: number;
  totalContent: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const AdminStats = ({
  totalUsers,
  contributors,
  totalContent,
  pending,
  approved,
  rejected
}: AdminStatsProps) => {
  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-100",
      textColor: "text-blue-800"
    },
    {
      label: "Contributors",
      value: contributors,
      icon: <UserCog className="w-6 h-6" />,
      color: "bg-purple-100",
      textColor: "text-purple-800"
    },
    {
      label: "Total Content",
      value: totalContent,
      icon: <ImageIcon className="w-6 h-6" />,
      color: "bg-indigo-100",
      textColor: "text-indigo-800"
    },
    {
      label: "Pending Review",
      value: pending,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-yellow-100",
      textColor: "text-yellow-800"
    },
    {
      label: "Approved",
      value: approved,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-green-100",
      textColor: "text-green-800"
    },
    {
      label: "Rejected",
      value: rejected,
      icon: <XCircle className="w-6 h-6" />,
      color: "bg-red-100",
      textColor: "text-red-800"
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`${stat.color} rounded-lg p-4 flex items-center shadow-sm`}
          >
            <div className={`mr-4 ${stat.textColor}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`text-sm ${stat.textColor}`}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 