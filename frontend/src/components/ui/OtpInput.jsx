import { useRef } from "react";

// Interactive 6-box OTP entry — matches the visual style of OtpBox
// (used as a static demo on the landing page) but with real input logic.
export default function OtpInput({ length = 6, value, onChange }) {
  const inputsRef = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (i, char) => {
    if (!/^[0-9]?$/.test(char)) return;
    const next = [...digits];
    next[i] = char;
    onChange(next.join(""));
    if (char && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          maxLength={1}
          inputMode="numeric"
          className={`h-[50px] w-[42px] rounded-lg border bg-ink text-center font-mono text-xl focus:outline-none focus:ring-1 focus:ring-blue ${
            d ? "border-green text-green" : "border-line text-fg"
          }`}
        />
      ))}
    </div>
  );
}