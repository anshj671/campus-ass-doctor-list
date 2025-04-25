import { Doctor } from '@/types/doctor';

interface DoctorListProps {
  doctors: Doctor[];
}

const DoctorList = ({ doctors }: DoctorListProps) => {
  const formatFee = (fee: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(fee);
  };

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="doctor-card" data-testid="doctor-card">
          <div className="doctor-info">
            <div className="doctor-avatar">
              <img src={doctor.image || 'https://via.placeholder.com/80'} alt={doctor.name} />
            </div>
            <div className="doctor-details">
              <h3 data-testid="doctor-name">{doctor.name}</h3>
              <p className="specialty" data-testid="doctor-specialty">
                {doctor.speciality.join(' • ')}
              </p>
              <p className="qualifications">{doctor.qualifications}</p>
              <p className="experience" data-testid="doctor-experience">{doctor.experience} yrs exp.</p>
              <div className="clinic-info">
                <span className="clinic-name">
                  <i className="hospital-icon">🏥</i>
                  {doctor.clinicName}
                </span>
                <span className="location">
                  <i className="location-icon">📍</i>
                  {doctor.location}
                </span>
              </div>
            </div>
            <div className="fee-section">
              <p className="fee" data-testid="doctor-fee">{formatFee(doctor.fee)}</p>
              <button className="book-btn">Book Appointment</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList; 