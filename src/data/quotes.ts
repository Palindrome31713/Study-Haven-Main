export interface Quote { text: string; author: string; }

export const QUOTES: Quote[] = [
  { text: "Dream is not that which you see while sleeping; it is something that does not let you sleep.", author: "Dr. A.P.J. Abdul Kalam" },
  { text: "Arise, awake, and stop not till the goal is reached.", author: "Swami Vivekananda" },
  { text: "You have a right to perform your duty, but you are not entitled to the fruits of your actions.", author: "Bhagavad Gita, 2.47" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "When you fail, that is when you get closer to success.", author: "Anand Mahindra" },
  { text: "The path from dreams to success does exist. May you have the vision to find it.", author: "Kalpana Chawla" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't limit your challenges. Challenge your limits.", author: "Jerry Dunn" },
  { text: "If you are born with fame, it is an accident. If you die with fame, it is an achievement.", author: "Harishchandra Prabhakar" },
  { text: "Learning gives creativity, creativity leads to thinking, thinking provides knowledge.", author: "Dr. Abdul Kalam" },
  { text: "Miles to go before I sleep — and promises to keep.", author: "Robert Frost" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Whether you think you can, or you think you can't — you're right.", author: "Henry Ford" },
  { text: "Small steps in the right direction can turn out to be the biggest step of your life.", author: "Naeem Callaway" },
  { text: "Sapno ko sach karne ka hunar, neend mein nahi mehnat mein hota hai.", author: "Study Haven proverb" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Your present circumstances don't determine where you go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Education is not the learning of facts, but the training of the mind to think.", author: "Albert Einstein" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Manzil unhi ko milti hai, jinke sapno mein jaan hoti hai.", author: "Harivansh Rai Bachchan" },
  { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Padhai wahi jo zindagi badal de; baaki toh sirf time-pass hai.", author: "Study Haven proverb" },
];

export function randomQuote(exclude?: number): { quote: Quote; index: number } {
  let i = Math.floor(Math.random() * QUOTES.length);
  if (i === exclude && QUOTES.length > 1) i = (i + 1 + Math.floor(Math.random() * (QUOTES.length - 1))) % QUOTES.length;
  return { quote: QUOTES[i], index: i };
}
