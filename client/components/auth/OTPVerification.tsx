'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onComplete: (otp: string) => void;
  onResend: () => void;
  loading?: boolean;
}

export default function OTPVerification({ onComplete, onResend, loading }: Props) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    if (next.every(d => d) && next.join('').length === 6) {
      onComplete(next.join(''));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(''));
      onComplete(text);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setDigits(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
    onResend();
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            disabled={loading}
            className="w-12 h-14 text-center text-xl font-black text-white rounded-xl border transition-all outline-none disabled:opacity-50"
            style={{
              backgroundColor: '#160078',
              borderColor: d ? '#7226FF' : '#7226FF30',
              boxShadow: d ? '0 0 12px rgba(114,38,255,0.3)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-bold transition-colors"
            style={{ color: '#7226FF' }}
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-white/40 text-sm">
            Resend in <span className="text-white/70 font-bold">{countdown}s</span>
          </p>
        )}
      </div>
    </div>
  );
}
