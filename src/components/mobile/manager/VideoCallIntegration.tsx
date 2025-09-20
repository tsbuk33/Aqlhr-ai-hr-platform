import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Phone, 
  Users, 
  Calendar,
  Clock,
  UserPlus,
  MessageSquare,
  Share2,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  PhoneCall
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  status: 'available' | 'busy' | 'offline' | 'in_meeting';
  avatar?: string;
}

interface ScheduledMeeting {
  id: string;
  title: string;
  titleAr: string;
  participants: string[];
  startTime: string;
  duration: number;
  type: 'team_meeting' | 'one_on_one' | 'emergency' | 'client_call';
}

interface VideoCallIntegrationProps {
  isArabic: boolean;
  expanded?: boolean;
}

export const VideoCallIntegration: React.FC<VideoCallIntegrationProps> = ({ 
  isArabic, 
  expanded = false 
}) => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 'emp_001',
      name: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      status: 'available'
    },
    {
      id: 'emp_002',
      name: 'Fatima Al-Zahra',
      nameAr: 'فاطمة الزهراء',
      status: 'busy'
    },
    {
      id: 'emp_003',
      name: 'Mohammed Al-Saud',
      nameAr: 'محمد السعود',
      status: 'available'
    },
    {
      id: 'emp_004',
      name: 'Nora Al-Qasimi',
      nameAr: 'نورا القاسمي',
      status: 'in_meeting'
    }
  ]);

  const [scheduledMeetings] = useState<ScheduledMeeting[]>([
    {
      id: 'meeting_001',
      title: 'Team Standup',
      titleAr: 'اجتماع الفريق اليومي',
      participants: ['emp_001', 'emp_002', 'emp_003'],
      startTime: '2024-12-20T09:00:00',
      duration: 30,
      type: 'team_meeting'
    },
    {
      id: 'meeting_002',
      title: '1-on-1 with Ahmed',
      titleAr: 'اجتماع فردي مع أحمد',
      participants: ['emp_001'],
      startTime: '2024-12-20T14:00:00',
      duration: 60,
      type: 'one_on_one'
    }
  ]);

  const startVideoCall = (participantId: string) => {
    setActiveCall(participantId);
    console.log(`Starting video call with ${participantId}`);
    // In a real app, this would initiate the video call
  };

  const startGroupCall = (meetingId: string) => {
    setActiveCall(meetingId);
    console.log(`Starting group call for meeting ${meetingId}`);
    // In a real app, this would start a group video call
  };

  const endCall = () => {
    setActiveCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    console.log('Call ended');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log(`Microphone ${!isMuted ? 'muted' : 'unmuted'}`);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    console.log(`Video ${!isVideoOff ? 'disabled' : 'enabled'}`);
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'in_meeting':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: TeamMember['status']) => {
    if (isArabic) {
      switch (status) {
        case 'available':
          return 'متاح';
        case 'busy':
          return 'مشغول';
        case 'in_meeting':
          return 'في اجتماع';
        case 'offline':
          return 'غير متصل';
        default:
          return 'غير معروف';
      }
    } else {
      switch (status) {
        case 'available':
          return 'Available';
        case 'busy':
          return 'Busy';
        case 'in_meeting':
          return 'In Meeting';
        case 'offline':
          return 'Offline';
        default:
          return 'Unknown';
      }
    }
  };

  const getMeetingTypeIcon = (type: ScheduledMeeting['type']) => {
    switch (type) {
      case 'team_meeting':
        return <Users className="h-4 w-4" />;
      case 'one_on_one':
        return <MessageSquare className="h-4 w-4" />;
      case 'emergency':
        return <Phone className="h-4 w-4 text-red-500" />;
      case 'client_call':
        return <PhoneCall className="h-4 w-4" />;
    }
  };

  const isUpcoming = (startTime: string) => {
    const meetingTime = new Date(startTime);
    const now = new Date();
    const diffMinutes = (meetingTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes > 0 && diffMinutes <= 60; // Within next hour
  };

  if (!expanded) {
    // Compact version for dashboard
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">
            {isArabic ? 'مكالمات الفيديو' : 'Video Calls'}
          </span>
        </div>
        
        {activeCall ? (
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">
                    {isArabic ? 'مكالمة نشطة' : 'Active Call'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">05:42</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={isMuted ? "destructive" : "outline"}
                  onClick={toggleMute}
                  className="flex-1"
                >
                  {isMuted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
                <Button 
                  size="sm" 
                  variant={isVideoOff ? "destructive" : "outline"}
                  onClick={toggleVideo}
                  className="flex-1"
                >
                  {isVideoOff ? <VideoOff className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={endCall}
                  className="flex-1"
                >
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.status === 'available').length} {isArabic ? 'متاحين' : 'available'}
            </div>
            <Button 
              size="sm" 
              onClick={() => startVideoCall('team_call')}
              className="w-full"
            >
              <Video className="h-3 w-3 mr-1" />
              {isArabic ? 'بدء مكالمة' : 'Start Call'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Expanded version
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {isArabic ? 'مكالمات الفيديو المدمجة' : 'Video Call Integration'}
          </div>
          {activeCall && (
            <Badge variant="secondary" className="animate-pulse">
              {isArabic ? 'مكالمة نشطة' : 'LIVE CALL'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Call Interface */}
        {activeCall && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">
                    {isArabic ? 'مكالمة نشطة' : 'Active Video Call'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>05:42</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button 
                  size="sm" 
                  variant={isMuted ? "destructive" : "outline"}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button 
                  size="sm" 
                  variant={isVideoOff ? "destructive" : "outline"}
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={endCall}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {!activeCall && (
          <>
            {/* Team Availability */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                {isArabic ? 'حالة الفريق' : 'Team Availability'}
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-2 border rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`} />
                          <span className="text-sm font-medium">
                            {isArabic ? member.nameAr : member.name}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getStatusText(member.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startVideoCall(member.id)}
                          disabled={member.status === 'offline'}
                          className="flex-1"
                        >
                          <Video className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={member.status === 'offline'}
                          className="flex-1"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Meetings */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {isArabic ? 'الاجتماعات المجدولة' : 'Scheduled Meetings'}
              </h4>
              
              {scheduledMeetings.map((meeting) => (
                <div key={meeting.id} className="p-3 border rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMeetingTypeIcon(meeting.type)}
                        <span className="font-medium text-sm">
                          {isArabic ? meeting.titleAr : meeting.title}
                        </span>
                      </div>
                      {isUpcoming(meeting.startTime) && (
                        <Badge variant="secondary">
                          {isArabic ? 'قريباً' : 'Soon'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(meeting.startTime).toLocaleTimeString()} 
                          ({meeting.duration} {isArabic ? 'دقيقة' : 'min'})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{meeting.participants.length} {isArabic ? 'مشارك' : 'participants'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => startGroupCall(meeting.id)}
                        className="flex-1"
                      >
                        <Video className="h-3 w-3 mr-1" />
                        {isArabic ? 'انضمام' : 'Join'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline">
                <UserPlus className="h-3 w-3 mr-1" />
                {isArabic ? 'دعوة خارجية' : 'Invite External'}
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {isArabic ? 'جدولة اجتماع' : 'Schedule Meeting'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};