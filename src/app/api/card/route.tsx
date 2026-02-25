import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import ProfileCard from '@/components/card/ProfileCard';
import { GitHubService } from '@/services/github';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response('Username is required', { status: 400 });
    }

    // Add a 10s timeout to the entire data fetching process to prevent Edge Runtime timeouts
    const statsPromise = GitHubService.getInstance().getStats(username);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('GitHub API request timed out')), 10000)
    );

    const stats = await Promise.race([statsPromise, timeoutPromise]) as any;
    
    return new ImageResponse(
      (
        <ProfileCard 
          stats={stats}
          config={{
            username,
            bio: stats.bio,
          }}
        />
      ),
      {
        width: 1200, // Banner Width
        height: 400,  // Banner Height
        headers: {
          'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=60',
        },
      }
    );
  } catch (e: any) {
    const isTimeout = e.message.includes('timed out');
    console.error(`[API ERROR] ${isTimeout ? 'Timeout' : 'Generation'}: ${e.message}`);
    return new Response(`Failed to generate image: ${e.message}`, { 
      status: isTimeout ? 504 : 500,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    });
  }
}
