import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VALUES_LIST = [
  'Innovation', 'Integrity', 'Teamwork', 'Excellence', 'Customer Focus',
  'Accountability', 'Respect', 'Transparency', 'Quality', 'Leadership',
  'Diversity', 'Sustainability', 'Agility', 'Trust', 'Growth'
];

export default function Respond() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const surveyId = searchParams.get('survey');
  const waveId = searchParams.get('wave');
  const token = searchParams.get('t');
  const lang = searchParams.get('lang') || 'en';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [demographics, setDemographics] = useState({
    department_id: '',
    project_id: '',
    grade_id: '',
    nationality: '',
    gender: ''
  });
  const [responses, setResponses] = useState({});
  const [valuesSelected, setValuesSelected] = useState({
    current: [],
    desired: []
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [surveyItems, setSurveyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [respondentHash, setRespondentHash] = useState('');

  useEffect(() => {
    if (!surveyId || !waveId) {
      toast({
        title: "Invalid Survey Link",
        description: "Missing survey or wave parameters",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    loadSurvey();
    generateRespondentHash();
  }, [surveyId, waveId, token]);

  const generateRespondentHash = async () => {
    let hashInput = '';
    
    if (token) {
      // For invite tokens, hash the token with survey and wave
      hashInput = `${token}_${surveyId}_${waveId}`;
    } else {
      // For anonymous responses, generate or retrieve respondent ID
      const storageKey = `cci_rid_${surveyId}_${waveId}`;
      let rid = localStorage.getItem(storageKey);
      if (!rid) {
        rid = crypto.randomUUID();
        localStorage.setItem(storageKey, rid);
      }
      hashInput = rid;
    }
    
    // Create a simple hash (in production, use proper crypto)
    const hash = btoa(hashInput).replace(/[+/=]/g, '').substring(0, 32);
    setRespondentHash(hash);
  };

  const loadSurvey = async () => {
    try {
      const { data: items, error } = await supabase
        .from('cci_survey_items')
        .select('*')
        .eq('survey_id', surveyId)
        .order('sort_order');

      if (error) throw error;
      setSurveyItems(items || []);
    } catch (err) {
      console.error('Error loading survey:', err);
      toast({
        title: "Error",
        description: "Failed to load survey questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const likertItems = surveyItems.filter(item => item.framework !== 'values');
  const itemsPerPage = 10;
  const totalPages = Math.ceil(likertItems.length / itemsPerPage);
  const currentItems = likertItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const getCompletionPercentage = () => {
    const totalQuestions = likertItems.length + 2; // +2 for values questions
    const answeredLikert = Object.keys(responses).length;
    const answeredValues = valuesSelected.current.length > 0 && valuesSelected.desired.length > 0 ? 2 : 0;
    return Math.round(((answeredLikert + answeredValues) / totalQuestions) * 100);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: return privacyAccepted;
      case 1: return true; // Demographics optional
      case 2: return getCompletionPercentage() >= 70; // 70% completion required
      case 3: return true; // Review step
      default: return false;
    }
  };

  const handleLikertResponse = (itemId, value) => {
    setResponses(prev => ({
      ...prev,
      [`item::${itemId}`]: value
    }));
  };

  const handleValuesToggle = (type, value) => {
    setValuesSelected(prev => {
      const currentList = prev[type];
      const newList = currentList.includes(value)
        ? currentList.filter(v => v !== value)
        : currentList.length < 5
        ? [...currentList, value]
        : currentList;
      
      return { ...prev, [type]: newList };
    });
  };

  const submitSurvey = async () => {
    setSubmitting(true);
    
    try {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      // Combine all responses
      const allAnswers = {
        ...responses,
        values_current: valuesSelected.current,
        values_desired: valuesSelected.desired
      };

      const { error } = await supabase
        .from('cci_responses')
        .insert({
          tenant_id: 'demo-tenant', // This should come from auth context
          survey_id: surveyId,
          wave_id: waveId,
          respondent_hash: respondentHash,
          answers: allAnswers,
          duration_seconds: duration,
          ...demographics
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Submitted",
            description: "You have already submitted a response for this wave.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      // If using invite token, mark as redeemed
      if (token) {
        await supabase
          .from('cci_invite_tokens')
          .update({ redeemed_at: new Date().toISOString() })
          .eq('token_hash', btoa(token).replace(/[+/=]/g, '').substring(0, 32));
      }

      toast({
        title: "Survey Submitted",
        description: "Thank you for your participation! Your responses have been recorded anonymously.",
      });

      setTimeout(() => {
        window.close();
      }, 3000);

    } catch (err) {
      console.error('Error submitting survey:', err);
      toast({
        title: "Submission Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">Loading survey...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Corporate Culture Survey</h1>
                <p className="text-muted-foreground">Step {currentStep + 1} of 4</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progress</div>
                <div className="text-lg font-semibold">{getCompletionPercentage()}%</div>
              </div>
            </div>
            <Progress value={(currentStep / 3) * 100} className="mt-4" />
          </CardContent>
        </Card>

        {/* Step 0: Privacy Notice */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Privacy & Anonymity Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Your Privacy is Protected</h3>
                <ul className="space-y-2 text-sm">
                  <li>• No names, emails, or IP addresses are stored</li>
                  <li>• Responses are completely anonymous</li>
                  <li>• Small groups (fewer than 7 people) will be hidden in reports</li>
                  <li>• Data is used only for organizational insights</li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                />
                <Label 
                  htmlFor="privacy" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand and accept the privacy terms
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Demographics (Optional) */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Background Information (Optional)</CardTitle>
              <p className="text-sm text-muted-foreground">
                This helps us provide better insights while maintaining your anonymity
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Department</Label>
                  <Select value={demographics.department_id} onValueChange={(value) => 
                    setDemographics(prev => ({ ...prev, department_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nationality</Label>
                  <Select value={demographics.nationality} onValueChange={(value) => 
                    setDemographics(prev => ({ ...prev, nationality: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi">Saudi</SelectItem>
                      <SelectItem value="non-saudi">Non-Saudi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Gender</Label>
                  <Select value={demographics.gender} onValueChange={(value) => 
                    setDemographics(prev => ({ ...prev, gender: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Survey Items */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Likert Items */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Culture Assessment ({currentPage + 1} of {totalPages})
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Page {currentPage + 1} of {totalPages}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentItems.map((item) => (
                  <div key={item.id} className="border-b pb-4 last:border-b-0">
                    <p className="mb-3 font-medium">{lang === 'ar' ? item.text_ar : item.text_en}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Strongly Disagree</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Button
                            key={value}
                            variant={responses[`item::${item.id}`] === value ? "default" : "outline"}
                            size="sm"
                            className="w-10 h-10 rounded-full"
                            onClick={() => handleLikertResponse(item.id, value)}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">Strongly Agree</span>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Values Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Values Alignment</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select up to 5 values for each category
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Current Values (What your organization values most today)</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {VALUES_LIST.map((value) => (
                      <Button
                        key={`current-${value}`}
                        variant={valuesSelected.current.includes(value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleValuesToggle('current', value)}
                        disabled={!valuesSelected.current.includes(value) && valuesSelected.current.length >= 5}
                        className="h-auto py-2 px-3 text-xs"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {valuesSelected.current.length}/5
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Desired Values (What your organization should value more)</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {VALUES_LIST.map((value) => (
                      <Button
                        key={`desired-${value}`}
                        variant={valuesSelected.desired.includes(value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleValuesToggle('desired', value)}
                        disabled={!valuesSelected.desired.includes(value) && valuesSelected.desired.length >= 5}
                        className="h-auto py-2 px-3 text-xs"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {valuesSelected.desired.length}/5
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Review & Submit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Survey Items Answered:</span>
                  <span className="ml-2">{Object.keys(responses).length} / {likertItems.length}</span>
                </div>
                <div>
                  <span className="font-medium">Completion:</span>
                  <span className="ml-2">{getCompletionPercentage()}%</span>
                </div>
                <div>
                  <span className="font-medium">Current Values:</span>
                  <span className="ml-2">{valuesSelected.current.length} selected</span>
                </div>
                <div>
                  <span className="font-medium">Desired Values:</span>
                  <span className="ml-2">{valuesSelected.desired.length} selected</span>
                </div>
              </div>

              {getCompletionPercentage() < 70 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Survey is only {getCompletionPercentage()}% complete. Consider answering more questions for better insights.
                  </p>
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  By submitting this survey, you confirm that your responses are honest and reflect your genuine experience with the organization's culture.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            Back
          </Button>

          {currentStep < 3 ? (
            <Button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceedToNextStep()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={submitSurvey}
              disabled={!canProceedToNextStep() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Survey'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}