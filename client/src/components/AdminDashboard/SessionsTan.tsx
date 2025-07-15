import { FC } from "react";

import { Calendar, ExternalLink, Trash2 } from "lucide-react";
// types

import { UpcomingSession } from "@/types/upcommingsession";
// api
import api from "@/utils/axios";
// clerk or token
import { useAuth } from "@clerk/clerk-react";

// props pass
interface SessionsTabProps {
  setShowSessionModal: (value: boolean) => void;
  upcomingSessions: UpcomingSession[];
  setUpcomingSessions: React.Dispatch<React.SetStateAction<UpcomingSession[]>>;
}

const SessionsTab: FC<SessionsTabProps> = ({
  setShowSessionModal,
  upcomingSessions,
  setUpcomingSessions,
}) => {
  const { getToken } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Upcoming Sessions Management
        </h2>
        <button
          onClick={() => setShowSessionModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule New Session
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          All Sessions
        </h4>
        <div className="space-y-3">
          {upcomingSessions?.map((session) => (
            <div
              key={session._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h5 className="font-medium text-gray-900">{session.title}</h5>
                <p className="text-sm text-gray-500">{session.description}</p>
                <p className="text-sm text-gray-500">
                  {session.date} at {session.time}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    session.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {session.isActive ? "Active" : "Inactive"}
                </span>
                <a
                  href={session.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Join
                </a>
                <button
                  onClick={async () => {
                    if (
                      confirm("Are you sure you want to delete this session?")
                    ) {
                      try {
                        const token = await getToken();
                        await api.delete(
                          `/api/admin/upcoming-sessions/${session._id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        setUpcomingSessions(
                          upcomingSessions.filter((s) => s._id !== session._id)
                        );
                      } catch (error) {
                        console.error("Error deleting session:", error);
                        alert("Error deleting session");
                      }
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {upcomingSessions?.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No sessions scheduled yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionsTab;
