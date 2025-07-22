'use server';

/**
 * @fileOverview Generates a file description using AI.
 *
 * - generateFileDescription - A function that handles the file description generation process.
 * - GenerateFileDescriptionInput - The input type for the generateFileDescription function.
 * - GenerateFileDescriptionOutput - The return type for the generateFileDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFileDescriptionInputSchema = z.object({
  fileName: z.string().describe('The name of the file.'),
  fileType: z.string().describe('The type of the file (e.g., pdf, txt, zip).'),
  fileContentSummary: z.string().describe('A summary of the file content.'),
});
export type GenerateFileDescriptionInput = z.infer<typeof GenerateFileDescriptionInputSchema>;

const GenerateFileDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated description of the file.'),
});
export type GenerateFileDescriptionOutput = z.infer<typeof GenerateFileDescriptionOutputSchema>;

export async function generateFileDescription(input: GenerateFileDescriptionInput): Promise<GenerateFileDescriptionOutput> {
  return generateFileDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFileDescriptionPrompt',
  input: {schema: GenerateFileDescriptionInputSchema},
  output: {schema: GenerateFileDescriptionOutputSchema},
  prompt: `You are an AI assistant that generates descriptions for files.

  Given the file name, file type, and a summary of the file content, generate a concise and informative description for the file. The description should include the file type.

  File Name: {{{fileName}}}
  File Type: {{{fileType}}}
  File Content Summary: {{{fileContentSummary}}}

  Description:`,
});

const generateFileDescriptionFlow = ai.defineFlow(
  {
    name: 'generateFileDescriptionFlow',
    inputSchema: GenerateFileDescriptionInputSchema,
    outputSchema: GenerateFileDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
