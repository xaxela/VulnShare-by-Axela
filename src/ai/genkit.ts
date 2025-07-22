
import {genkit, GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];

if (process.env.GOOGLE_API_KEY) {
  plugins.push(googleAI());
  // Let the client know that the API key is available for AI features.
  process.env.NEXT_PUBLIC_API_KEY_SET = 'true';
} else {
  console.warn(
    'GOOGLE_API_KEY environment variable not set. Genkit will not use Google AI.'
  );
}

export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-2.0-flash',
});
