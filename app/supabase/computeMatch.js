import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxxx.supabase.co';
const supabaseKey = 'PUBLIC_ANON_OR_SERVICE_KEY'; // use service role key for server side
const sb = createClient(supabaseUrl, supabaseKey);

// call RPC
async function getTopMentors(menteeId, topN = 3) {
  // Using RPC function created earlier
  const { data, error } = await sb.rpc('get_matches', {
    p_mentee_id: menteeId,
    p_top_n: topN,
    p_threshold_percent: 50,
    p_skill_w: 0.7,
    p_role_w: 0.3
  });

  if (error) {
    console.error('RPC error', error);
    throw error;
  }
  // data is an array of rows
  return data;
}

// Alternatively: client-side compute (fetch mentors, compute in JS)
async function getTopMentorsClientCompute(menteeId) {
  // 1. fetch mentee + mentors (filtered by verified, active, location)
  const { data: mentee } = await sb
    .from('mentees')
    .select('*')
    .eq('id', menteeId)
    .single();

  const { data: mentors } = await sb
    .from('mentors')
    .select('*')
    .eq('verified', true)
    .eq('active', true)
    .eq('location', mentee.location); // or use ilike/contains for regions

  const computeScore = (mentee, mentor) => {
    const desiredSkills = (mentee.desired_skills || []).map(s => s.toLowerCase());
    const mentorSkills = (mentor.skills || []).map(s => s.toLowerCase());
    const matchedSkills = mentorSkills.filter(s => desiredSkills.includes(s));
    const skillScore = desiredSkills.length ? (matchedSkills.length / desiredSkills.length) : 0;
    const roleMatch = (mentor.roles || []).some(r => (mentee.desired_roles || []).map(x => x.toLowerCase()).includes(r.toLowerCase())) ? 1 : 0;
    const total = 0.7 * skillScore + 0.3 * roleMatch;
    return {
      mentor,
      scorePercent: Math.round(total * 100 * 100) / 100, // keep 2 decimals
      matchedSkills: matchedSkills.length,
      desiredCount: desiredSkills.length
    };
  };

  const scored = mentors.map(m => computeScore(mentee, m));
  const filtered = scored.filter(s => s.scorePercent >= 50); // threshold
  filtered.sort((a, b) => b.scorePercent - a.scorePercent);
  return filtered.slice(0, 3).map(x => ({
    id: x.mentor.id,
    name: x.mentor.name,
    score: x.scorePercent,
    matchedSkills: x.matchedSkills
  }));
}