import axios from 'axios';
import wordcloud from 'wordcloud';
import { removeStopwords, eng } from 'stopword';

interface WordFreq {
  [key: string]: number;
}

interface Post {
  title: string;
  content: string;
  description: string;
}

type ListEntry = [string, number, ...any[]];


export default async function generateWordsCloud(query: string, element: HTMLDivElement) {
  try {
    const newsText = await fetchNewsData(query, 5)
    const googleStopWords = "a about above after again against all am an and any are aren't as at be because been before being below between both but by can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves"
    var wordsArr = removeStopwords(newsText.split(' ').filter(Boolean), [...eng, ...googleStopWords.split(' ')]);

    // Convert the array of words into an object with word frequencies
    var wordFrequencies: WordFreq = {};
    wordsArr.forEach(function (word: string) {
      wordFrequencies[word] = wordFrequencies[word] ? wordFrequencies[word] + 1 : 1
      if (wordFrequencies[word]) {
        wordFrequencies[word]++;
      } else {
        wordFrequencies[word] = 1;
      }
    });

    // Convert the word frequencies into an array of word objects
    var wordCloudData: ListEntry[] = [];
    for (var word in wordFrequencies) {
      if (wordFrequencies.hasOwnProperty(word)) {
        wordCloudData.push([
          word
          , wordFrequencies[word]
        ]);
      }
    }
    // Generate the word cloud
    wordcloud(element, {
      list: wordCloudData,
    });

  } catch (error) {
    console.error(error);
  }
}

async function fetchNewsData(query: string, pageCount: number) {
  const options = {
    method: 'GET',
    url: 'https://newsdata2.p.rapidapi.com/news',
    params: {
      language: 'en',
      q: query
    },
    headers: {
      'X-RapidAPI-Key': '72ea6bea93msh2730cbd0bb48781p173bedjsn7858a2e9b9ef',
      'X-RapidAPI-Host': 'newsdata2.p.rapidapi.com'
    },
    page: ''
  };
  let newsText = ""
  for (let i = 0; i < pageCount; i++) {
    const { data } = await axios.request<{ results: Post[]; nextPage: string }>(options);
    newsText += getTextFromResults(data.results)
    options.page = data?.nextPage
  }
  return newsText
}
function getTextFromResults(results: Post[]) {
  return results.reduce((acc, post) => {
    let text = `${post.title} ${post.content} ${post.description}`;
    return acc += text.replace(/[^a-z|A-Z|\s]/g, '')
  }, '')
}