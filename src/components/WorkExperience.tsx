import { Calendar, MapPin } from 'lucide-react';
import { WorkExperience as WorkExperienceType } from '@/lib/data';

interface WorkExperienceProps {
  experiences: WorkExperienceType[];
}

const WorkExperience = ({ experiences }: WorkExperienceProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <section id="work" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">
            Experience
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Work History
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A journey through my professional career and the amazing teams I've worked with.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <div
              key={experience.uid}
              className="relative bg-muted/30 rounded-2xl p-6 md:p-8 border border-border hover:shadow-lg transition-all duration-300"
            >
              {/* Timeline connector */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-8 bottom-0 w-0.5 h-8 bg-border transform translate-y-full hidden md:block"></div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {/* Date and Status */}
                <div className="md:col-span-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        {formatDate(experience.start_date!)} - {
                          experience.current_position 
                            ? 'Present' 
                            : formatDate(experience.end_date!)
                        }
                      </span>
                    </div>
                    {experience.current_position && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 w-fit">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="md:col-span-3">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                        {experience.position}
                      </h4>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{experience.company}</span>
                      </div>
                    </div>

                    {experience.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {experience.description}
                      </p>
                    )}

                    {/* Technologies */}
                    {experience.technologies && experience.technologies.length > 0 && (
                      <div>
                        <h5 className="font-medium text-foreground mb-2 text-sm sm:text-base">Technologies:</h5>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 sm:px-3 py-1 bg-background rounded-full text-xs sm:text-sm font-medium border border-border"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Work experience will be displayed here once added to Contentstack.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkExperience;