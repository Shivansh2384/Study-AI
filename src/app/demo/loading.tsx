export default function DemoLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-neuro-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 animate-pulse" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 opacity-20 animate-ping" />
        </div>
        <p className="text-xs text-slate-600 font-mono uppercase tracking-widest">
          Preparing Demo
        </p>
      </div>
    </div>
  );
}
