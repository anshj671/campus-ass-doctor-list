import { useState, useEffect } from 'react';
import { Doctor, FilterState } from '@/types/doctor';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import DoctorList from '@/components/DoctorList';
import './App.css';

function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    consultationType: '',
    specialities: [],
    sortBy: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const extractClinicName = (doc: any): string => {
    // Try all possible field names for clinic/hospital
    const possibleFields = [
      'clinic_name',
      'clinicName',
      'hospital_name',
      'hospitalName',
      'hospital',
      'clinic',
      'practice_location',
      'practiceLocation',
      'workplace',
      'work_place'
    ];

    for (const field of possibleFields) {
      if (doc[field] && typeof doc[field] === 'string' && doc[field].trim()) {
        return doc[field].trim();
      }
    }

    // If no clinic name found, try to extract from address or location
    if (doc.address && typeof doc.address === 'string') {
      const addressParts = doc.address.split(',');
      if (addressParts[0] && addressParts[0].trim()) {
        return addressParts[0].trim();
      }
    }

    // Return a default name only if no other information is available
    return 'Private Clinic';
  };

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors data');
      }
      const data = await response.json();
      
      // Transform the data to match our Doctor interface
      const transformedData = data.map((doc: any) => {
        // Handle speciality data
        let specialities: string[] = [];
        if (doc.speciality) {
          if (Array.isArray(doc.speciality)) {
            specialities = doc.speciality;
          } else if (typeof doc.speciality === 'string') {
            specialities = [doc.speciality];
          }
        } else if (doc.specialities) {
          if (Array.isArray(doc.specialities)) {
            specialities = doc.specialities;
          } else if (typeof doc.specialities === 'string') {
            specialities = [doc.specialities];
          }
        } else if (doc.specialty) {
          if (Array.isArray(doc.specialty)) {
            specialities = doc.specialty;
          } else if (typeof doc.specialty === 'string') {
            specialities = [doc.specialty];
          }
        }

        // Remove duplicates and filter out empty strings
        specialities = [...new Set(specialities)].filter(Boolean);

        // If still no specialities, try to extract from qualification
        if (specialities.length === 0 && doc.qualification) {
          const quals = typeof doc.qualification === 'string' ? 
            doc.qualification.split(',').map((q: string) => q.trim()) : 
            Array.isArray(doc.qualification) ? doc.qualification : [];
          
          const specialityFromQual = quals.find((q: string) => 
            q.toLowerCase().includes('specialist') || 
            q.toLowerCase().includes('physician') ||
            q.toLowerCase().includes('surgeon')
          );
          if (specialityFromQual) {
            specialities = [specialityFromQual];
          }
        }

        // If still no specialities, use default
        if (specialities.length === 0) {
          specialities = ['General Physician'];
        }

        // Extract fee
        let fee = 0;
        if (doc.fees !== undefined) {
          fee = typeof doc.fees === 'string' ? 
            parseInt(doc.fees.replace(/\D/g, '')) : 
            Number(doc.fees);
        } else if (doc.consultationFee !== undefined) {
          fee = typeof doc.consultationFee === 'string' ? 
            parseInt(doc.consultationFee.replace(/\D/g, '')) : 
            Number(doc.consultationFee);
        } else if (doc.fee !== undefined) {
          fee = typeof doc.fee === 'string' ? 
            parseInt(doc.fee.replace(/\D/g, '')) : 
            Number(doc.fee);
        }

        if (!fee || isNaN(fee)) {
          fee = Math.floor(Math.random() * (1000 - 300 + 1)) + 300;
        }

        // Get clinic name
        const clinicName = extractClinicName(doc);

        return {
          id: doc.id || String(Math.random()),
          name: doc.name || '',
          speciality: specialities,
          experience: doc.experience ? 
            (typeof doc.experience === 'string' ? 
              parseInt(doc.experience.replace(/\D/g, '')) : 
              Number(doc.experience)) || 0 : 0,
          fee: fee,
          consultationType: doc.consultation_type || doc.consultationType || 'In Clinic',
          qualifications: doc.qualifications || doc.education || doc.qualification || 'MBBS',
          clinicName: clinicName,
          location: doc.location || doc.area || doc.address || 'Local Area',
          image: doc.photo || doc.image || undefined
        };
      });

      setDoctors(transformedData);
      setFilteredDoctors(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      console.error('Error fetching doctors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!doctors.length) return;

    let result = [...doctors];

    // Apply search filter
    if (filters.search) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply consultation type filter
    if (filters.consultationType) {
      result = result.filter(doctor => 
        doctor.consultationType === filters.consultationType
      );
    }

    // Apply specialities filter
    if (filters.specialities.length > 0) {
      result = result.filter(doctor =>
        filters.specialities.some(speciality => 
          doctor.speciality.includes(speciality)
        )
      );
    }

    // Apply sorting
    if (filters.sortBy === 'fees') {
      result.sort((a, b) => {
        if (a.fee === b.fee) return 0;
        return a.fee - b.fee;
      });
    } else if (filters.sortBy === 'experience') {
      result.sort((a, b) => {
        if (a.experience === b.experience) return 0;
        return b.experience - a.experience;
      });
    }

    setFilteredDoctors(result);
  }, [filters, doctors]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Doctor Listing</h1>
        <SearchBar 
          value={filters.search}
          onChange={(value) => handleFilterChange({ search: value })}
          doctors={doctors}
        />
      </header>
      <main className="main-content">
        <FilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        {isLoading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchDoctors}>Try Again</button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="no-results">
            <p>No doctors found matching your criteria</p>
          </div>
        ) : (
          <DoctorList doctors={filteredDoctors} />
        )}
      </main>
    </div>
  );
}

export default App;
