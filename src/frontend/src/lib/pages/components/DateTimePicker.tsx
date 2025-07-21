import React from 'react';

interface DateTimePickerProps {
  label: string;
  date: Date;
  onDateChange: (date: Date | null) => void;
  time: string;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minDate?: Date;
}

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  date,
  onDateChange,
  time,
  onTimeChange,
  minDate = new Date()
}) => {
  return (
    <>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} Date</label>
        <input
          type="date"
          value={formatDate(date)}
          min={formatDate(minDate)}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="w-full text-sm py-2 rounded-md border-gray-200 shadow-sm p-1 border"
          required
        />
      </div>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} Time</label>
        <input
          type="time"
          value={time}
          onChange={onTimeChange}
          className="w-full text-sm py-2 rounded-md border-gray-200 shadow-sm p-1 border"
          required
        />
      </div>
    </>
  );
};

export default DateTimePicker;
