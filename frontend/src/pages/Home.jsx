import RoastBox from '../components/RoastBox';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔥 AI Roast Machine</h1>
          <p className="text-gray-600">Get ready to be roasted by our AI!</p>
        </div>
        <RoastBox />
      </div>
    </div>
  );
}
