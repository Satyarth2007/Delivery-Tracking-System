export default function OtpBox({ digit }) {
  return (
    <div className="flex h-[50px] w-[42px] items-center justify-center rounded-lg border border-green bg-ink font-mono text-xl text-green">
      {digit}
    </div>
  );
}