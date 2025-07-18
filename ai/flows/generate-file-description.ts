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
  fileContentSummary: z.string().describe('A summary of the file content.').optional(),
});
export type GenerateFileDescriptionInput = z.infer<typeof GenerateFileDescriptionInputSchema>;

const GenerateFileDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise and informative description of the file.'),
});
export type GenerateFileDescriptionOutput = z.infer<typeof GenerateFileDescriptionOutputSchema>;

export async function generateFileDescription(input: GenerateFileDescriptionInput): Promise<GenerateFileDescriptionOutput> {
  return generateFileDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFileDescriptionPrompt',
  input: {schema: GenerateFileDescriptionInputSchema},
  output: {schema: GenerateFileDescriptionOutputSchema},
  prompt: `You are an AI assistant that writes brief, informative descriptions for files based on their metadata.

  Analyze the file name and type below to generate a single-sentence description.

  For example:
  - If the file is "Q3-Financial-Report.pdf", a good description would be: "The third-quarter financial report, provided in PDF format."
  - If the file is "Project-Phoenix-Brief.docx", a good description would be: "A document outlining the project brief for Project Phoenix."
  - If the file is "website_backup_latest.zip", a good description would be: "A compressed archive containing the latest backup of the website."

  File Name: {{{fileName}}}
  File Type: {{{fileType}}}

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

    