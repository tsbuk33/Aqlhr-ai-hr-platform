import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  Building,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { JobOffer } from "./JobOfferManagement";

interface JobOfferDashboardProps {
  jobOffers: JobOffer[];
  onOfferSelect: (offer: JobOffer) => void;
  getStatusBadge: (status: JobOffer['status']) => JSX.Element;
}

export const JobOfferDashboard = ({ 
  jobOffers, 
  onOfferSelect, 
  getStatusBadge 
}: JobOfferDashboardProps) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculate statistics
  const stats = {
    total: jobOffers.length,
    pending: jobOffers.filter(o => o.status === 'pending_approval').length,
    approved: jobOffers.filter(o => o.status === 'approved').length,
    sent: jobOffers.filter(o => o.status === 'sent').length,
    accepted: jobOffers.filter(o => o.status === 'accepted').length,
    avgSalary: jobOffers.length > 0 ? Math.round(jobOffers.reduce((sum, o) => sum + o.salary, 0) / jobOffers.length) : 0
  };

  // Filter offers
  const filteredOffers = jobOffers.filter(offer => {
    const matchesSearch = offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.offerNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'إجمالي العروض' : 'Total Offers'}
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval'}
                </p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
              <AlertCircle className="h-3 w-3" />
              {language === 'ar' ? 'يتطلب انتباه' : 'Requires attention'}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'معتمد' : 'Approved'}
                </p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <UserCheck className="h-3 w-3" />
              {Math.round((stats.approved / stats.total) * 100)}% {language === 'ar' ? 'معدل النجاح' : 'success rate'}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {language === 'ar' ? 'متوسط الراتب' : 'Avg. Salary'}
                </p>
                <p className="text-2xl font-bold">{stats.avgSalary.toLocaleString()} SAR</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Building className="h-3 w-3" />
              {language === 'ar' ? 'جميع الأقسام' : 'All departments'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {language === 'ar' ? 'عروض العمل' : 'Job Offers'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' ? 'إدارة ومتابعة جميع عروض العمل' : 'Manage and track all job offers'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={language === 'ar' ? 'البحث في عروض العمل...' : 'Search job offers...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">
                  {language === 'ar' ? 'جميع الحالات' : 'All Status'}
                </option>
                <option value="draft">
                  {language === 'ar' ? 'مسودة' : 'Draft'}
                </option>
                <option value="pending_approval">
                  {language === 'ar' ? 'في انتظار الموافقة' : 'Pending Approval'}
                </option>
                <option value="approved">
                  {language === 'ar' ? 'معتمد' : 'Approved'}
                </option>
                <option value="sent">
                  {language === 'ar' ? 'مرسل' : 'Sent'}
                </option>
                <option value="accepted">
                  {language === 'ar' ? 'مقبول' : 'Accepted'}
                </option>
                <option value="rejected">
                  {language === 'ar' ? 'مرفوض' : 'Rejected'}
                </option>
              </select>
            </div>
          </div>

          {/* Job Offers List */}
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onOfferSelect(offer)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-lg">{offer.candidateName}</h4>
                          <p className="text-sm text-muted-foreground">{offer.position}</p>
                        </div>
                        <div className="hidden md:block">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {offer.offerNumber}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {offer.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {offer.salary.toLocaleString()} SAR
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(offer.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(offer.status)}
                      <Button variant="outline" size="sm">
                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'ar' ? 'لا توجد عروض عمل' : 'No Job Offers Found'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' ? 
                  'لم يتم العثور على عروض عمل تطابق المعايير المحددة.' : 
                  'No job offers found matching the specified criteria.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};