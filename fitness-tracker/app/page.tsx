import EntryForm from '@/components/EntryForm';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto pt-12 pb-24 px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--focus-indigo)] to-[var(--focus-violet)] mb-4 shadow-lg animate-float">
            <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-3">
            Track Your Vitality
          </h1>
          <p className="text-gray-600 text-lg">
            Log today's progress and watch your health flourish
          </p>
        </div>

        {/* Form */}
        <EntryForm />
      </div>
    </div>
  );
}
