export interface Doctor {
  id: string;
  name: string;
  speciality: string[];
  experience: number;
  fee: number;
  consultationType: 'Video Consult' | 'In Clinic';
  image?: string;
  qualifications: string;
  clinicName: string;
  location: string;
}

export interface FilterState {
  search: string;
  consultationType: 'Video Consult' | 'In Clinic' | '';
  specialities: string[];
  sortBy: 'fees' | 'experience' | '';
} 