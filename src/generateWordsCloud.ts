import axios from 'axios';
import wordcloud from 'wordcloud';
import { removeStopwords } from 'stopword';

interface WordFreq {
  [key: string]: number;
}

interface Post {
  title: string;
  content: string;
  description: string;
}

interface FetchOptions {
  method: string,
  url: string,
  params: {language: string, q: string},
  headers: {'X-RapidAPI-Key': string, 'X-RapidAPI-Host': string},
  page: string
}

type ListEntry = [string, number, ...any[]];


export default async function generateWordsCloud(query: string) {
  console.log(query)
  var newsText = "";
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

  try {
    for (let i = 0 ; i < 5; i++) {
      newsText +=  await fetchNewsData(options)
    }
    var wordsArr = removeStopwords(newsText.split(' '));

    console.log(wordsArr)

    // Convert the array of words into an object with word frequencies
    var wordFrequencies: WordFreq = {};
    wordsArr.forEach(function (word: string) {
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
          ,wordFrequencies[word]
        ]);
      }
    }

    let element: HTMLElement;

    const existingElement = document.getElementById('wordsclod');
    if (existingElement) {
      element = existingElement;
    } else {
      element = document.createElement('div');
    }

    console.log(wordCloudData)
    // Generate the word cloud
    wordcloud(element, {
      list: wordCloudData,
    });

  } catch (error) {
    console.error(error);
  }
}

async function fetchNewsData(options: FetchOptions) {
  const { data } = await axios.request(options);
  var newsText = ""
  options.page = data?.nextPage
  data.results.forEach((post: Post) => {
    newsText += `${post.title} ${post.content} ${post.description}`;
    newsText.replace(/[^\w\s]/g, ' ');
  });

  return newsText
}