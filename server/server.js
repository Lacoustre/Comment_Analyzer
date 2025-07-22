require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 4000;


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


app.post('/api/analyze', async (req, res) => {
  try {
    const { text, selectedLanguage } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }


    const analyzeTextLocally = (text) => {
      const lowerText = text.toLowerCase();
      

      const toxicWords = [

        'hate', 'idiot', 'stupid', 'dumb', 'moron', 'retard', 'kill', 'die', 'ugly',
        'fat', 'loser', 'pathetic', 'worthless', 'trash', 'garbage', 'useless',
        'shut up', 'screw you', 'damn', 'hell', 'crap', 'ass', 'asshole', 'bitch',
        'bastard', 'fuck', 'shit', 'dick', 'pussy', 'cunt', 'whore', 'slut',
        'retarded', 'gay', 'fag', 'queer', 'homo', 'nigger', 'nigga', 'chink', 'spic',
        'kike', 'wetback', 'terrorist', 'nazi', 'racist', 'sexist', 'rape', 'disgusting',
        

        'kwasea', 'gyimigyimi', 'aboa', 'kwasia', 'obonsam', 'sɛbe', 'wo maame tw3', 
        'wo se', 'mede wo bɔ dam', 'wɔnini', 'soanni', 'odwan', 'ɔkwadu', 'akyiwade',
        'gyimii', 'bodamfoɔ', 'ɔtafoc', 'ɔbonsam ba', 'ɔkwasiampanin', 'nkwasiasɛm'
      ];
      
      const positiveWords = [
  
        'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'terrific',
        'outstanding', 'exceptional', 'superb', 'brilliant', 'awesome', 'fabulous',
        'incredible', 'marvelous', 'spectacular', 'splendid', 'stupendous', 'phenomenal',
        'love', 'like', 'enjoy', 'appreciate', 'happy', 'glad', 'pleased', 'delighted',
        'thrilled', 'excited', 'enthusiastic', 'grateful', 'thankful', 'satisfied',
        'content', 'cheerful', 'joyful', 'elated', 'ecstatic', 'blissful',
        
  
        'papa', 'eye', 'fɛ', 'ɔdɔ', 'ayɛ', 'anigye', 'nhyira', 'asomdwoe',
        'ayeyi', 'medaase', 'meda w\'ase', 'akwaaba', 'yiedie', 'nkwa', 'ahoɔden',
        'anuonyam', 'animuonyam', 'ahoɔfɛ', 'ahomka', 'ahosɛpɛw'
      ];
      
      const negativeWords = [
  
        'bad', 'terrible', 'horrible', 'awful', 'dreadful', 'poor', 'subpar',
        'mediocre', 'disappointing', 'unsatisfactory', 'inadequate', 'inferior',
        'deficient', 'unacceptable', 'appalling', 'atrocious', 'abysmal', 'lousy',
        'hate', 'dislike', 'detest', 'despise', 'loathe', 'abhor', 'sad', 'unhappy',
        'upset', 'disappointed', 'frustrated', 'annoyed', 'irritated', 'angry', 'mad',
        'furious', 'enraged', 'disgusted', 'depressed', 'miserable',
        
  
        'bɔne', 'ɛyɛ hu', 'ɛyɛ ya', 'mmusu', 'ɔhaw', 'abufuo', 'awerɛhow',
        'ɔtan', 'ɛyɛ tan', 'ɛyɛ nwonwa', 'ɛyɛ yaw', 'ɛyɛ basaa', 'ɛyɛ fi',
        'ɛyɛ atantanne', 'ɛyɛ aniwu', 'ɛyɛ ateetee', 'ɛyɛ atantannede'
      ];
      

      let toxicCount = 0;
      let positiveCount = 0;
      let negativeCount = 0;
      

      toxicWords.forEach(word => {
        if (lowerText.includes(word)) toxicCount++;
      });
      

      positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveCount++;
      });
      
      negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeCount++;
      });
      

      const criticalPhrases = [

        'fuck you', 'kill yourself', 'rape', 'die', 'go to hell',
        

        'wo maame tw3', 'wo se', 'mede wo bɔ dam', 'kwasia', 'gyimigyimi',
        'wo yɛ aboa', 'me ko wu', 'wo bɛ wu', 'wo yɛ kwasea'
      ];
      
      let hasCriticalPhrase = false;
      criticalPhrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
          toxicCount += 3;
          hasCriticalPhrase = true;
        }
      });
      

      let isToxic = toxicCount > 0 || hasCriticalPhrase;
      const toxicityScore = Math.min(toxicCount * 15, 100);
      

      const sentiment = positiveCount > negativeCount ? 'positive' : 
                       negativeCount > positiveCount ? 'negative' : 'neutral';
      

      let riskLevel = 'low';
      if (toxicityScore > 70 || hasCriticalPhrase) {
        riskLevel = 'high';
      } else if (toxicityScore > 30) {
        riskLevel = 'medium';
      }
      

      let harassmentScore = 0;
      let hateSpeechScore = 0;
      let profanityScore = 0;
      let threatScore = 0;
      let identityAttackScore = 0;
      let sexuallyExplicitScore = 0;
      

      const harassmentWords = ['idiot', 'stupid', 'dumb', 'moron', 'loser', 'pathetic', 'worthless', 'useless', 'ugly', 'disgusting', 'fat'];
      const hateSpeechWords = ['hate', 'nigger', 'nigga', 'chink', 'spic', 'kike', 'wetback', 'terrorist', 'nazi', 'racist', 'sexist'];
      const profanityWords = ['fuck', 'shit', 'damn', 'hell', 'crap', 'ass', 'asshole', 'bitch', 'bastard'];
      const threatWords = ['kill', 'die', 'murder', 'suicide', 'rape'];
      const identityAttackWords = ['gay', 'fag', 'queer', 'homo', 'retard', 'retarded'];
      const sexuallyExplicitWords = ['pussy', 'cunt', 'whore', 'slut', 'dick', 'rape'];
      

      toxicWords.forEach(word => {
        if (lowerText.includes(word)) {
          if (harassmentWords.includes(word)) harassmentScore += 15;
          if (hateSpeechWords.includes(word)) hateSpeechScore += 20;
          if (profanityWords.includes(word)) profanityScore += 15;
          if (threatWords.includes(word)) threatScore += 25;
          if (identityAttackWords.includes(word)) identityAttackScore += 20;
          if (sexuallyExplicitWords.includes(word)) sexuallyExplicitScore += 20;
        }
      });
      

      if (lowerText.includes('fuck you')) {
        harassmentScore += 30;
        profanityScore += 20;
      }
      
      if (lowerText.includes('kill yourself') || lowerText.includes('kys')) {
        threatScore += 50;
      }
      

      harassmentScore = Math.min(harassmentScore, 100);
      hateSpeechScore = Math.min(hateSpeechScore, 100);
      profanityScore = Math.min(profanityScore, 100);
      threatScore = Math.min(threatScore, 100);
      identityAttackScore = Math.min(identityAttackScore, 100);
      sexuallyExplicitScore = Math.min(sexuallyExplicitScore, 100);
      

      if (lowerText.includes('disgusting')) {
        isToxic = true;
        riskLevel = 'medium';
        harassmentScore = Math.max(harassmentScore, 50);
      }
      

      if (lowerText.includes('rape')) {
        isToxic = true;
        riskLevel = 'high';
        threatScore = Math.max(threatScore, 70);
        sexuallyExplicitScore = Math.max(sexuallyExplicitScore, 70);
      }
      

      if (!isToxic) {
        harassmentScore = Math.min(harassmentScore, 5);
        hateSpeechScore = Math.min(hateSpeechScore, 3);
        profanityScore = Math.min(profanityScore, 5);
        threatScore = Math.min(threatScore, 2);
        identityAttackScore = Math.min(identityAttackScore, 3);
        sexuallyExplicitScore = Math.min(sexuallyExplicitScore, 2);
      }
      
      return {
        isToxic,
        confidence: isToxic ? toxicityScore : 100 - toxicityScore,
        toxicityLevels: {
          harassment: harassmentScore,
          hateSpeech: hateSpeechScore,
          profanity: profanityScore,
          threat: threatScore,
          identity_attack: identityAttackScore,
          sexually_explicit: sexuallyExplicitScore
        },
        sentiment,
        riskLevel
      };
    };
    

    const detectLanguage = (text) => {

      const twiWords = [
        'me', 'wo', 'yen', 'mo', 'won', 'ne', 'na', 'anaa', 'sɛ', 'yɛ', 'wɔ',
        'nti', 'ɛno', 'ɛnnɛ', 'ɔkyena', 'nnora', 'da', 'anadwo', 'anɔpa',
        'kwasea', 'gyimigyimi', 'aboa', 'kwasia', 'obonsam', 'sɛbe', 'wo maame tw3',
        'papa', 'eye', 'fɛ', 'ɔdɔ', 'ayɛ', 'anigye', 'nhyira', 'asomdwoe',
        'bɔne', 'ɛyɛ hu', 'ɛyɛ ya', 'mmusu', 'ɔhaw', 'abufuo', 'awerɛhow',
        'akwaaba', 'yɛfrɛ me', 'mepa wo kyɛw', 'medaase', 'meda wo ase'
      ];
      

      const lowerText = text.toLowerCase();
      let twiWordCount = 0;
      
      twiWords.forEach(word => {
        if (lowerText.includes(word)) {
          twiWordCount++;
        }
      });
      

      const wordCount = text.split(/\s+/).length;
      return (twiWordCount > 2 || (twiWordCount / wordCount) > 0.15) ? 'Twi (Ghana)' : 'English';
    };
    

    const analysisResult = analyzeTextLocally(text);
    

    const detectedLanguage = detectLanguage(text);
    analysisResult.detectedLanguage = detectedLanguage;
    

    if (detectedLanguage === 'Twi (Ghana)') {
      if (analysisResult.isToxic) {
        analysisResult.feedback = 'Nsɛm a woaka no nyɛ. Mepa wo kyɛw, ka nsɛm pa.';
      } else {
        analysisResult.feedback = 'Nsɛm a woaka no yɛ. Medaase pii.';
      }
    } else {
      if (analysisResult.isToxic) {
        analysisResult.feedback = 'Your message contains inappropriate content. Please use respectful language.';
      } else {
        analysisResult.feedback = 'Your message appears to be appropriate. Thank you for keeping it respectful.';
      }
    }
    

    console.log('Text analyzed:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    console.log('Analysis results:', {
      isToxic: analysisResult.isToxic,
      confidence: analysisResult.confidence.toFixed(1) + '%',
      sentiment: analysisResult.sentiment,
      riskLevel: analysisResult.riskLevel
    });
    

    setTimeout(() => {
      res.json(analysisResult);
    }, 2000);

  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Using local text analysis (no external API required)');
  console.log('- Analyzing text for toxic content and sentiment');
  console.log('- Processing comments in real-time');
});