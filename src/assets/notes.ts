import type Video from "../utils/videos.ts";

const videoNotes : Record<string, string> = {
  // DEMONDICE
  "OWDcn7hl16A": `
The melody is catchy and all, but the only real reason I've got this here is the cowbell.
Reminds me of TAK's "Psycho Mode" and Ginger Root's "Loretta". Cowbell's a good percussion
instrument, what can I say?`
};

// Trim the leading and trailing whitespace introduced by me using the string literal syntax
for (const key in videoNotes)
{
  videoNotes[key] = videoNotes[key].trim();
}

function updateNotes (videos : Video[])
{
  for (const video of videos)
  {
    video.note = videoNotes[video.videoId];
  }
}

export { videoNotes as notes, updateNotes };
