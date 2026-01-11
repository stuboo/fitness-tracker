import EntryForm from '@/components/EntryForm';
import affirmationsData from '../data/affirmations.json';

// Get a random affirmation
const affirmations = affirmationsData.affirmations;
const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto pt-12 pb-24 px-4">
        {/* Random Affirmation */}
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-2xl font-semibold text-gray-700 italic">
            "{randomAffirmation.text}"
          </p>
        </div>

        {/* Form */}
        <EntryForm />
      </div>
    </div>
  );
}
