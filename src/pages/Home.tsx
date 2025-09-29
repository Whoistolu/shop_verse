import Header from '../components/Header.js';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Welcome to Shop Verse
        </h1>
        <p className="text-lg text-center text-gray-600">
          Discover amazing products from various brands.
        </p>
      </div>
    </div>
  );
}
