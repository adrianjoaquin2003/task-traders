import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, MapPin, Star, Shield, Briefcase, Phone, Mail, Filter } from 'lucide-react';
import { useProfessionals } from '@/hooks/useProfessionals';

interface ProfessionalsPageProps {
  onViewChange: (view: string) => void;
}

export const ProfessionalsPage = ({ onViewChange }: ProfessionalsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const { data: professionals = [], isLoading, error } = useProfessionals();

  const formatPrice = (hourlyRate: number | null) => {
    if (!hourlyRate) return 'Contact for pricing';
    return `$${(hourlyRate / 100).toFixed(0)}/hour`;
  };

  // All professionals now come from the database

  const skills = ['All', 'Painting', 'Plumbing', 'Electrical', 'General Repairs', 'Cleaning', 'HVAC', 'Carpentry'];
  const ratings = ['All', '4.5+ Stars', '4.0+ Stars', '3.5+ Stars'];

  // Use only real professionals from database
  const allProfessionals = professionals;

  const filteredProfessionals = allProfessionals.filter(pro => {
    const matchesSearch = pro.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pro.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = skillFilter === 'all' || 
                        pro.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    const matchesLocation = !locationFilter || 
                           pro.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === '4.5+ stars' && pro.rating >= 4.5) ||
                         (ratingFilter === '4.0+ stars' && pro.rating >= 4.0) ||
                         (ratingFilter === '3.5+ stars' && pro.rating >= 3.5);
    
    return matchesSearch && matchesSkill && matchesLocation && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onViewChange('home')} 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Professionals</h1>
          <p className="text-muted-foreground">
            Browse verified professionals and contact them directly for your projects
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Professionals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search professionals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((skill) => (
                    <SelectItem key={skill} value={skill.toLowerCase()}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratings.map((rating) => (
                    <SelectItem key={rating} value={rating.toLowerCase()}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading professionals...' : `Showing ${filteredProfessionals.length} of ${allProfessionals.length} professionals`}
          </p>
        </div>

        {/* Professional Listings */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredProfessionals.map((pro) => (
            <Card key={pro.id} className="hover:shadow-elegant transition-all">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={pro.avatar_url || ''} alt={pro.name} />
                    <AvatarFallback>{pro.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg truncate">{pro.name}</CardTitle>
                      {pro.verified && (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">{pro.title}</p>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(pro.rating)}
                      <span className="ml-1 text-sm font-medium">{pro.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({pro.review_count} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {pro.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary mb-1">
                      {formatPrice(pro.hourly_rate)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {pro.response_time}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{pro.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {pro.experience_years} years experience
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {pro.completed_jobs} jobs completed
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {pro.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {error ? 'Error loading professionals. Please try again.' : 'No professionals found matching your criteria.'}
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSkillFilter('all');
                setRatingFilter('all');
                setLocationFilter('');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};