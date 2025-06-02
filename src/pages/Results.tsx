import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Calendar, Trophy, Pizza, CheckCircle2 } from "lucide-react";

interface SurveyData {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  favoriteFoods: string[];
  ratings: {
    pizza: number;
    pasta: number;
    papAndWors: number;
    other: number;
  };
  submittedAt: string;
}

const Results = () => {
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    averageAge: 0,
    oldestPerson: 0,
    youngestPerson: 0,
    pizzaPercentage: 0,
    averageEatOutRating: 0
  });

  useEffect(() => {
    // Load surveys from localStorage
    const storedSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    setSurveys(storedSurveys);

    if (storedSurveys.length > 0) {
      calculateStats(storedSurveys);
    }
  }, []);

  const calculateStats = (surveyData: SurveyData[]) => {
    const totalSurveys = surveyData.length;
    
    // Calculate average age
    const totalAge = surveyData.reduce((sum, survey) => sum + survey.age, 0);
    const averageAge = Math.round((totalAge / totalSurveys) * 10) / 10;

    // Find oldest and youngest person
    const ages = surveyData.map(survey => survey.age);
    const oldestPerson = Math.max(...ages);
    const youngestPerson = Math.min(...ages);

    // Calculate pizza percentage
    const pizzaLovers = surveyData.filter(survey => 
      survey.favoriteFoods.includes('Pizza')
    ).length;
    const pizzaPercentage = Math.round((pizzaLovers / totalSurveys) * 1000) / 10;

    // Calculate average "eat out" rating
    const totalEatOutRating = surveyData.reduce((sum, survey) => sum + survey.ratings.other, 0);
    const averageEatOutRating = Math.round((totalEatOutRating / totalSurveys) * 10) / 10;

    setStats({
      totalSurveys,
      averageAge,
      oldestPerson,
      youngestPerson,
      pizzaPercentage,
      averageEatOutRating
    });
  };

  // Prepare chart data
  const chartData = [
    { name: 'Pizza', percentage: stats.pizzaPercentage },
    { name: 'Pasta', percentage: surveys.length > 0 ? Math.round((surveys.filter(s => s.favoriteFoods.includes('Pasta')).length / surveys.length) * 1000) / 10 : 0 },
    { name: 'Pap & Wors', percentage: surveys.length > 0 ? Math.round((surveys.filter(s => s.favoriteFoods.includes('Pap and Wors')).length / surveys.length) * 1000) / 10 : 0 },
    { name: 'Other', percentage: surveys.length > 0 ? Math.round((surveys.filter(s => s.favoriteFoods.includes('Other')).length / surveys.length) * 1000) / 10 : 0 }
  ];

  if (surveys.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Enhanced Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Lifestyle Survey
                  </h1>
                  <p className="text-sm text-gray-500">Research & Analytics Platform</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to="/">
                  <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                    Fill Out Survey
                  </Button>
                </Link>
                <Link to="/results">
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    View Results
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">No Survey Data Available</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                We haven't received any survey responses yet. Be the first to participate and help us gather valuable insights!
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Take the Survey
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Lifestyle Survey
                </h1>
                <p className="text-sm text-gray-500">Research & Analytics Platform</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link to="/">
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                  Fill Out Survey
                </Button>
              </Link>
              <Link to="/results">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  View Results
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Results Content */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Survey Analytics Dashboard</h2>
          <p className="text-xl text-gray-600">Comprehensive insights from {stats.totalSurveys} survey responses</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-10">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
            <CardTitle className="text-3xl text-center font-light tracking-wide flex items-center justify-center space-x-3">
              <TrendingUp className="w-8 h-8" />
              <span>Survey Results & Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Total Surveys */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-blue-600 text-sm font-medium bg-blue-100 px-3 py-1 rounded-full">Total</span>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Survey Responses</h3>
                <p className="text-4xl font-bold text-blue-600">{stats.totalSurveys}</p>
                <p className="text-blue-600/70 text-sm mt-1">Completed surveys</p>
              </div>

              {/* Average Age */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-medium bg-green-100 px-3 py-1 rounded-full">Average</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Average Age</h3>
                <p className="text-4xl font-bold text-green-600">{stats.averageAge}</p>
                <p className="text-green-600/70 text-sm mt-1">Years old</p>
              </div>

              {/* Age Range */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-purple-600 text-sm font-medium bg-purple-100 px-3 py-1 rounded-full">Range</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Age Range</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.youngestPerson} - {stats.oldestPerson}</p>
                <p className="text-purple-600/70 text-sm mt-1">Youngest to oldest</p>
              </div>

              {/* Pizza Lovers */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <Pizza className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-red-600 text-sm font-medium bg-red-100 px-3 py-1 rounded-full">Pizza</span>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Pizza Lovers</h3>
                <p className="text-4xl font-bold text-red-600">{stats.pizzaPercentage}%</p>
                <p className="text-red-600/70 text-sm mt-1">Of all respondents</p>
              </div>

              {/* Eat Out Rating */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl border border-indigo-200 hover:shadow-lg transition-shadow md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-indigo-600 text-sm font-medium bg-indigo-100 px-3 py-1 rounded-full">Rating</span>
                </div>
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Average "Eat Out" Preference</h3>
                <div className="flex items-end space-x-3">
                  <p className="text-4xl font-bold text-indigo-600">{stats.averageEatOutRating}</p>
                  <p className="text-2xl font-medium text-indigo-400 mb-1">/ 5.0</p>
                </div>
                <p className="text-indigo-600/70 text-sm mt-1">Overall satisfaction rating</p>
              </div>
            </div>

            {/* Food Preferences Chart */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  <BarChart className="w-5 h-5 text-white" />
                </div>
                <span>Food Preferences Distribution</span>
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="url(#gradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;
