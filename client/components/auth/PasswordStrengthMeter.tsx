interface Props {
  password: string;
}

interface Check {
  label: string;
  test: (p: string) => boolean;
}

const checks: Check[] = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: '1 uppercase letter', test: p => /[A-Z]/.test(p) },
  { label: '1 number', test: p => /[0-9]/.test(p) },
  { label: '1 special character', test: p => /[^A-Za-z0-9]/.test(p) },
];

const levels = [
  { label: 'Weak', color: '#ef4444' },
  { label: 'Fair', color: '#f97316' },
  { label: 'Strong', color: '#eab308' },
  { label: 'Very Strong', color: '#22c55e' },
];

export default function PasswordStrengthMeter({ password }: Props) {
  if (!password) return null;

  const passed = checks.filter(c => c.test(password)).length;
  const level = levels[Math.min(passed - 1, 3)] ?? levels[0];

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < passed ? level.color : '#ffffff15',
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: passed > 0 ? level.color : '#ffffff40' }}>
          {passed > 0 ? level.label : 'Enter password'}
        </span>
        <span className="text-xs text-white/30">{passed}/4 rules met</span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1">
        {checks.map(({ label, test }) => {
          const ok = test(password);
          return (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                style={{ backgroundColor: ok ? '#22c55e20' : '#ffffff08', color: ok ? '#22c55e' : '#ffffff30', border: `1px solid ${ok ? '#22c55e40' : '#ffffff10'}` }}
              >
                {ok ? '✓' : '·'}
              </div>
              <span className={`text-[11px] ${ok ? 'text-white/60' : 'text-white/30'}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function getPasswordStrength(password: string): number {
  return checks.filter(c => c.test(password)).length;
}
