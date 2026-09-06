"use client";

type LabeledSelectOption = {
  value: string | number;
  label: string;
};

type LabeledSelectProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: LabeledSelectOption[];
  className?: string;
};

export default function LabeledSelect({
  id,
  label,
  value,
  onChange,
  options,
  className = "",
}: LabeledSelectProps) {
  const isValidValue = options.some((option) => option.value === value);
  const resolvedValue = isValidValue ? value : options[0]?.value ?? "";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={resolvedValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-card-border bg-background px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}