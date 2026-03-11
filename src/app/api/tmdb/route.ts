// app/api/users/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';


export async function GET(request: Request) {

  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get('page') || '1';
  const route = searchParams.get('route') || 'movie/popular';


  try{
    const response = await axios.get(`https://api.themoviedb.org/3/${route}`, {
      headers:{
        Authorization: `Bearer ${process.env.TMDB_API}`
      },
      params: {
        page: page
      }
    })
    const data = response.data;
    return NextResponse.json(data);
  }
  catch(error){
    console.error('Error fetching data from TMDB API:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}