import Link from "next/link";

export default function HomePage() {
  return (
    <section className='py-12 px-4'>
      <div className='container mx-auto text-center'>
        <h1 className='text-4xl font-bold mb-6'>Welcome to NovaRace</h1>
        <p className='text-gray-600 mb-8 max-w-2xl mx-auto'>
          Join the community of runners, cyclists, and fitness enthusiasts
          across India. Discover and register for exciting upcoming events!
        </p>
        <Link
          href='/events'
          className='inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
        >
          Browse Events
        </Link>
      </div>
    </section>
  );
}
