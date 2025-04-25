import { FilterState } from '@/types/doctor';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

const SPECIALITIES = [
  'General Physician',
  'Dentist',
  'Dermatologist',
  'Paediatrician',
  'Gynaecologist',
  'ENT',
  'Diabetologist',
  'Cardiologist',
  'Physiotherapist',
  'Endocrinologist',
  'Orthopaedic',
  'Ophthalmologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Psychiatrist',
  'Urologist',
  'Dietitian-Nutritionist',
  'Psychologist',
  'Sexologist',
  'Nephrologist',
  'Neurologist',
  'Oncologist',
  'Ayurveda',
  'Homeopath'
];

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const handleConsultationTypeChange = (type: 'Video Consult' | 'In Clinic') => {
    onFilterChange({ consultationType: type });
  };

  const handleSpecialityChange = (speciality: string) => {
    const updatedSpecialities = filters.specialities.includes(speciality)
      ? filters.specialities.filter(s => s !== speciality)
      : [...filters.specialities, speciality];
    onFilterChange({ specialities: updatedSpecialities });
  };

  const handleSortChange = (sortBy: 'fees' | 'experience' | '') => {
    onFilterChange({ sortBy });
  };

  const clearAllFilters = () => {
    onFilterChange({
      consultationType: '',
      specialities: [],
      sortBy: ''
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-all" onClick={clearAllFilters}>Clear All</button>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort by</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === 'fees'}
              onChange={() => handleSortChange(filters.sortBy === 'fees' ? '' : 'fees')}
              data-testid="sort-fees"
            />
            Price: Low to High
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === 'experience'}
              onChange={() => handleSortChange(filters.sortBy === 'experience' ? '' : 'experience')}
              data-testid="sort-experience"
            />
            Experience: Most to Least
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Mode of Consultation</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="consultationType"
              checked={filters.consultationType === 'Video Consult'}
              onChange={() => handleConsultationTypeChange('Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label>
            <input
              type="radio"
              name="consultationType"
              checked={filters.consultationType === 'In Clinic'}
              onChange={() => handleConsultationTypeChange('In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Speciality</h3>
        <div className="specialities-list">
          {SPECIALITIES.map((speciality) => (
            <label key={speciality} className="speciality-option">
              <input
                type="checkbox"
                checked={filters.specialities.includes(speciality)}
                onChange={() => handleSpecialityChange(speciality)}
                data-testid={`speciality-${speciality.toLowerCase()}`}
              />
              {speciality}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 