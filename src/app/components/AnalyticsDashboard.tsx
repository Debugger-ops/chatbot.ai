import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { 
  BarChart3, 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  User,
  Sparkles
} from 'lucide-react';
import { Conversation } from '../types/chat';

interface AnalyticsDashboardProps {
  conversations: Conversation[];
}

interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  userMessages: number;
  aiMessages: number;
  avgMessagesPerConversation: number;
  mostActiveDay: string;
  longestConversation: Conversation | null;
  recentActivity: Array<{
    date: string;
    conversations: number;
    messages: number;
  }>;
  hourlyActivity: Array<{
    hour: number;
    messages: number;
  }>;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ conversations }) => {
  const analytics = useMemo<AnalyticsData>(() => {
    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
    const userMessages = conversations.reduce((sum, conv) => 
      sum + conv.messages.filter(m => m.role === 'user').length, 0
    );
    const aiMessages = totalMessages - userMessages;
    const avgMessagesPerConversation = totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0;

    // Find longest conversation
    const longestConversation = conversations.reduce((longest, conv) => 
      conv.messages.length > (longest?.messages.length || 0) ? conv : longest, 
      null as Conversation | null
    );

    // Activity by day
    const activityByDate = new Map<string, { conversations: number; messages: number }>();
    conversations.forEach(conv => {
      const date = new Date(conv.createdAt).toDateString();
      if (!activityByDate.has(date)) {
        activityByDate.set(date, { conversations: 0, messages: 0 });
      }
      const activity = activityByDate.get(date)!;
      activity.conversations += 1;
      activity.messages += conv.messages.length;
    });

    const recentActivity = Array.from(activityByDate.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);

    const mostActiveDay = recentActivity.length > 0 
      ? recentActivity.reduce((max, current) => 
          current.messages > max.messages ? current : max
        ).date 
      : 'No data';

    // Hourly activity
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({ hour, messages: 0 }));
    conversations.forEach(conv => {
      conv.messages.forEach(message => {
        const hour = new Date(message.timestamp).getHours();
        hourlyActivity[hour].messages += 1;
      });
    });

    return {
      totalConversations,
      totalMessages,
      userMessages,
      aiMessages,
      avgMessagesPerConversation,
      mostActiveDay,
      longestConversation,
      recentActivity,
      hourlyActivity
    };
  }, [conversations]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getActivityLevel = (messages: number, maxMessages: number) => {
    const percentage = maxMessages > 0 ? (messages / maxMessages) * 100 : 0;
    if (percentage > 75) return 'bg-green-500';
    if (percentage > 50) return 'bg-yellow-500';
    if (percentage > 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const maxHourlyMessages = Math.max(...analytics.hourlyActivity.map(h => h.messages));

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Insights into your chat activity and usage patterns
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalConversations}</div>
                  <p className="text-xs text-muted-foreground">
                    Active chat sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalMessages}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.userMessages} from you, {analytics.aiMessages} from AI
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Messages/Chat</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.avgMessagesPerConversation}</div>
                  <p className="text-xs text-muted-foreground">
                    Messages per conversation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Active Day</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.mostActiveDay !== 'No data' ? formatDate(analytics.mostActiveDay) : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Highest activity
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your chat activity over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentActivity.length > 0 ? (
                    analytics.recentActivity.map((activity, index) => (
                      <div key={activity.date} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(activity.date)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.conversations} conversations
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {activity.messages} messages
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No activity data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hourly Activity Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Activity by Hour</CardTitle>
                <CardDescription>
                  When you're most active throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-1">
                  {analytics.hourlyActivity.map((activity) => (
                    <div key={activity.hour} className="text-center">
                      <div
                        className={`h-8 w-full rounded ${getActivityLevel(activity.messages, maxHourlyMessages)} opacity-80 mb-2 flex items-center justify-center`}
                        title={`${activity.hour}:00 - ${activity.messages} messages`}
                      >
                        <span className="text-xs text-white font-medium">
                          {activity.messages}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.hour}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Longest Conversation */}
            {analytics.longestConversation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Longest Conversation
                  </CardTitle>
                  <CardDescription>
                    Your most engaging chat session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {analytics.longestConversation.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {analytics.longestConversation.messages.length} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(analytics.longestConversation.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;