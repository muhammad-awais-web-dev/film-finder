// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get('page') || '1';
  const route = searchParams.get('route') || 'movie/popular';

  try {
    // Construct the full URL for the fetch request
    const url = `https://api.themoviedb.org/3/${route}?page=${page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API}`
      },
      // Next.js specific caching option:
      // This caches the fetch response for 3600 seconds (1 hour).
      next: { revalidate: 3600 } 
    });

    // Native fetch requires manual error checking for non-2xx statuses
    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching data from TMDB API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}