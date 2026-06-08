import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';
import BookingProgress from '../components/booking/BookingProgress';
import BranchSelect from '../components/booking/BranchSelect';
import DateSelect from '../components/booking/DateSelect';
import TimeSelect from '../components/booking/TimeSelect';
import PersonalDetailsForm from '../components/booking/PersonalDetailsForm';
import { createMeeting } from '../firebase/meetings';
import { formatDateKey } from '../utils/dates';

const STEP_TITLES = {
  1: 'בחירת סניף',
  2: 'בחירת תאריך',
  3: 'בחירת שעה',
  4: 'פרטים אישיים',
};

function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleBranchSelect(branch) {
    setSelectedBranch(branch);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(2);
  }

  function handleDateSelect(date) {
    setSelectedDate(date);
    setSelectedTime(null);
    if (date) setStep(3);
  }

  function handleTimeSelect(time) {
    setSelectedTime(time);
    if (time) setStep(4);
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  async function handleSubmit(details) {
    if (!selectedBranch || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    setSubmitError(null);

    const dateKey = formatDateKey(selectedDate);
    const meeting = {
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      branchAddress: selectedBranch.address,
      date: dateKey,
      time: selectedTime,
      slotDuration: selectedBranch.slotDuration ?? 30,
      ...details,
    };

    try {
      const meetingId = await createMeeting(meeting);
      navigate('/success', {
        state: { meeting: { ...meeting, id: meetingId } },
      });
    } catch {
      setSubmitError('שגיאה בקביעת הפגישה. אנא נסו שוב.');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-[var(--primary)] text-white py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Blue Heart</h1>
          <p className="mt-1 text-white/80">קביעת פגישה</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <BookingProgress currentStep={step} />

        {step > 1 && selectedBranch && (
          <div className="mb-6 rounded-xl bg-white border border-gray-200 p-4 text-sm space-y-2">
            <p className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              <span className="font-medium">{selectedBranch.name}</span>
            </p>
            {selectedDate && (
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-[var(--primary)]" />
                <span>
                  {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}
                </span>
              </p>
            )}
            {selectedTime && (
              <p className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-[var(--primary)]" />
                <span dir="ltr">{selectedTime}</span>
              </p>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1 text-sm text-[var(--primary)] hover:text-[var(--primary-light)]"
              >
                <ArrowRight className="h-4 w-4" />
                חזרה
              </button>
            ) : (
              <span />
            )}
            <h2 className="text-xl font-semibold text-[var(--primary)]">
              {STEP_TITLES[step]}
            </h2>
            <span className="w-12" />
          </div>

          {step === 1 && (
            <BranchSelect
              selectedBranch={selectedBranch}
              onSelect={handleBranchSelect}
            />
          )}

          {step === 2 && selectedBranch && (
            <DateSelect
              branch={selectedBranch}
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
            />
          )}

          {step === 3 && selectedBranch && selectedDate && (
            <TimeSelect
              branch={selectedBranch}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelect={handleTimeSelect}
            />
          )}

          {step === 4 && (
            <>
              {submitError && (
                <p className="mb-4 text-center text-[var(--danger)]">{submitError}</p>
              )}
              <PersonalDetailsForm onSubmit={handleSubmit} submitting={submitting} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default BookingPage;
