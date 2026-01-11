import EntryForm from '@/components/EntryForm';

export default function Home() {
  return (
    <div className="max-w-md mx-auto pt-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Daily Entry
      </h1>
      <EntryForm />
    </div>
  );
}
