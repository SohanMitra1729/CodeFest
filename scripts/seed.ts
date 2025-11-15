/**
 * Seed script to populate Supabase tables with mock data.
 * Run once from the root directory:
 *   npx tsx scripts/seed.ts
 * 
 * NOTE: This script uses Supabase environment variables.
 * Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env
 */

import { createClient } from '@supabase/supabase-js';
import { mockTeams, mockRounds, mockMCQs, mockCodingProblems, mockRound2Problem, mockCertificates } from '../data/mockData';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedTeams() {
  console.log('📦 Seeding teams...');
  const teamData = mockTeams.map(t => ({
    id: t.id,
    name: t.name,
    college: t.college,
    payment_screenshot_url: t.paymentScreenshotUrl,
    status: t.status,
  }));
  const { error } = await supabase.from('teams').upsert(teamData);
  if (error) console.error('  ❌ Error seeding teams:', error);
  else console.log(`  ✅ Seeded ${teamData.length} teams`);
}

async function seedRounds() {
  console.log('📦 Seeding rounds...');
  const roundData = mockRounds.map(r => ({
    id: r.id,
    name: r.name,
    status: r.status,
    duration_in_minutes: r.durationInMinutes || null,
  }));
  const { error } = await supabase.from('rounds').upsert(roundData);
  if (error) console.error('  ❌ Error seeding rounds:', error);
  else console.log(`  ✅ Seeded ${roundData.length} rounds`);
}

async function seedMCQs() {
  console.log('📦 Seeding MCQs and options...');
  for (const mcq of mockMCQs) {
    const { error: mcqError } = await supabase.from('mcqs').upsert({
      id: mcq.id,
      question: mcq.question,
      correct_answer_id: mcq.correctAnswerId,
    });
    if (mcqError) {
      console.error('  ❌ Error seeding MCQ', mcq.id, mcqError);
      continue;
    }

    const optionData = mcq.options.map(opt => ({
      id: opt.id,
      mcq_id: mcq.id,
      text: opt.text,
    }));
    const { error: optError } = await supabase.from('mcq_options').upsert(optionData);
    if (optError) console.error('  ❌ Error seeding options for MCQ', mcq.id, optError);
  }
  console.log(`  ✅ Seeded ${mockMCQs.length} MCQs with options`);
}

async function seedCodingProblems() {
  console.log('📦 Seeding coding problems and test cases...');
  for (const problem of mockCodingProblems) {
    const { error: probError } = await supabase.from('coding_problems').upsert({
      id: problem.id,
      title: problem.title,
      description: problem.description,
    });
    if (probError) {
      console.error('  ❌ Error seeding problem', problem.id, probError);
      continue;
    }

    // Seed displayed test cases (is_hidden = false)
    const displayedTestCases = problem.displayedTestCases.map(tc => ({
      problem_id: problem.id,
      input: tc.input,
      expected_output: tc.expectedOutput,
      is_hidden: false,
    }));

    // Seed hidden test cases (is_hidden = true)
    const hiddenTestCases = problem.hiddenTestCases.map(tc => ({
      problem_id: problem.id,
      input: tc.input,
      expected_output: tc.expectedOutput,
      is_hidden: true,
    }));

    const allTestCases = [...displayedTestCases, ...hiddenTestCases];
    const { error: tcError } = await supabase.from('coding_problem_test_cases').insert(allTestCases);
    if (tcError) console.error('  ❌ Error seeding test cases for problem', problem.id, tcError);
  }
  console.log(`  ✅ Seeded ${mockCodingProblems.length} coding problems with test cases`);
}

async function seedRound2Problem() {
  console.log('📦 Seeding Round 2 problem...');
  const { error } = await supabase.from('round2_problem').insert({
    title: mockRound2Problem.title,
    description: mockRound2Problem.description,
    url: mockRound2Problem.url,
  });
  if (error) console.error('  ❌ Error seeding Round 2 problem:', error);
  else console.log('  ✅ Seeded Round 2 problem');
}

async function seedCertificates() {
  console.log('📦 Seeding certificates...');
  const certData = mockCertificates.map(c => ({
    team_id: c.teamId,
    team_name: c.teamName,
    type: c.type,
    awarded_at: c.awardedAt.toISOString(),
  }));
  const { error } = await supabase.from('certificates').insert(certData);
  if (error) console.error('  ❌ Error seeding certificates:', error);
  else console.log(`  ✅ Seeded ${certData.length} certificates`);
}

async function main() {
  console.log('\n🌱 Starting Supabase seed...\n');
  try {
    await seedTeams();
    await seedRounds();
    await seedMCQs();
    await seedCodingProblems();
    await seedRound2Problem();
    await seedCertificates();
    console.log('\n✨ Seeding complete!\n');
  } catch (e) {
    console.error('\n❌ Seeding failed:', e);
    process.exit(1);
  }
}

main();
