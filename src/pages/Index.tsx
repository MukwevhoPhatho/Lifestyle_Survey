
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [age, setAge] = useState("");
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
  const [pizzaRating, setPizzaRating] = useState("");
  const [pastaRating, setPastaRating] = useState("");
  const [papAndWorsRating, setPapAndWorsRating] = useState("");
  const [otherRating, setOtherRating] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const foodOptions = ["Pizza", "Pasta", "Pap and Wors", "Other"];
  const ratingOptions = [
    { value: "1", label: "Strongly Disagree" },
    { value: "2", label: "Disagree" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Agree" },
    { value: "5", label: "Strongly Agree" }
  ];

  const handleFoodChange = (food: string, checked: boolean) => {
    if (checked) {
      setFavoriteFoods([...favoriteFoods, food]);
    } else {
      setFavoriteFoods(favoriteFoods.filter(f => f !== food));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!age.trim()) newErrors.age = "Age is required";
    
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      newErrors.age = "Age must be between 5 and 120";
    }

    if (!pizzaRating) newErrors.pizzaRating = "Pizza rating is required";
    if (!pastaRating) newErrors.pastaRating = "Pasta rating is required";
    if (!papAndWorsRating) newErrors.papAndWorsRating = "Pap and Wors rating is required";
    if (!otherRating) newErrors.otherRating = "Other rating is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted!");
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive"
      });
      return;
    }

    const surveyData = {
      id: Date.now().toString(),
      fullName,
      email,
      dateOfBirth: dateOfBirth?.toISOString(),
      age: parseInt(age),
      favoriteFoods,
      ratings: {
        pizza: parseInt(pizzaRating),
        pasta: parseInt(pastaRating),
        papAndWors: parseInt(papAndWorsRating),
        other: parseInt(otherRating)
      },
      submittedAt: new Date().toISOString()
    };

    console.log("Saving survey data:", surveyData);

    // Save to localStorage (simulating database)
    const existingSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    existingSurveys.push(surveyData);
    localStorage.setItem('surveys', JSON.stringify(existingSurveys));

    console.log("Survey saved to localStorage");

    toast({
      title: "Survey Submitted!",
      description: "Thank you for participating in our survey.",
    });

    // Reset form
    setFullName("");
    setEmail("");
    setDateOfBirth(undefined);
    setAge("");
    setFavoriteFoods([]);
    setPizzaRating("");
    setPastaRating("");
    setPapAndWorsRating("");
    setOtherRating("");
    setErrors({});
  };

  console.log("Index component is rendering");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
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

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Help Us Understand Your Lifestyle
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your responses will help us gather valuable insights about lifestyle preferences. 
            All information is collected anonymously and used for research purposes only.
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl">
            <CardTitle className="text-2xl text-center font-light tracking-wide">
              Lifestyle Preferences Survey
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Personal Details Section */}
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={cn(
                        "h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20",
                        errors.fullName && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm flex items-center mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20",
                        errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm flex items-center mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 justify-start text-left font-normal border-gray-200 hover:bg-gray-50",
                            !dateOfBirth && "text-gray-500",
                            errors.dateOfBirth && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-4 w-4" />
                          {dateOfBirth ? format(dateOfBirth, "MMMM dd, yyyy") : "Select your birth date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white shadow-xl border-gray-200">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={setDateOfBirth}
                          className="pointer-events-auto"
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.dateOfBirth && <p className="text-red-500 text-sm flex items-center mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="5"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className={cn(
                        "h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20",
                        errors.age && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                      placeholder="Your age"
                    />
                    {errors.age && <p className="text-red-500 text-sm flex items-center mt-1">{errors.age}</p>}
                  </div>
                </div>
              </div>

              {/* Favorite Foods Section */}
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Food Preferences</h3>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <Label className="text-base font-medium text-gray-800 mb-4 block">
                    What are your favorite foods? <span className="text-gray-500 text-sm">(Select all that apply)</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {foodOptions.map((food) => (
                      <div key={food} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors">
                        <Checkbox
                          id={food}
                          checked={favoriteFoods.includes(food)}
                          onCheckedChange={(checked) => handleFoodChange(food, checked as boolean)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor={food} className="text-sm font-medium text-gray-700 cursor-pointer">
                          {food}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ratings Section */}
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Food Preferences Rating</h3>
                </div>
                
                <p className="text-gray-600 mb-6">Please rate your agreement with the following statements on a scale from 1 to 5:</p>

                {/* Pizza Rating */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <Label className="text-lg font-medium text-gray-800">
                    I like to eat Pizza <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={pizzaRating} onValueChange={setPizzaRating} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white transition-colors">
                        <RadioGroupItem value={option.value} id={`pizza-${option.value}`} />
                        <Label htmlFor={`pizza-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.pizzaRating && <p className="text-red-500 text-sm">{errors.pizzaRating}</p>}
                </div>

                {/* Pasta Rating */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <Label className="text-lg font-medium text-gray-800">
                    I like to eat Pasta <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={pastaRating} onValueChange={setPastaRating} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white transition-colors">
                        <RadioGroupItem value={option.value} id={`pasta-${option.value}`} />
                        <Label htmlFor={`pasta-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.pastaRating && <p className="text-red-500 text-sm">{errors.pastaRating}</p>}
                </div>

                {/* Pap and Wors Rating */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <Label className="text-lg font-medium text-gray-800">
                    I like to eat Pap and Wors <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={papAndWorsRating} onValueChange={setPapAndWorsRating} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white transition-colors">
                        <RadioGroupItem value={option.value} id={`pap-${option.value}`} />
                        <Label htmlFor={`pap-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.papAndWorsRating && <p className="text-red-500 text-sm">{errors.papAndWorsRating}</p>}
                </div>

                {/* Other Rating */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <Label className="text-lg font-medium text-gray-800">
                    I like to eat out <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={otherRating} onValueChange={setOtherRating} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {ratingOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white transition-colors">
                        <RadioGroupItem value={option.value} id={`other-${option.value}`} />
                        <Label htmlFor={`other-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.otherRating && <p className="text-red-500 text-sm">{errors.otherRating}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 text-center">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Submit Survey
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  Your responses are anonymous and will be used for research purposes only
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
