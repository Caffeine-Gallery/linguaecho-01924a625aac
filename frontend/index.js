import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const outputText = document.getElementById('outputText');
const speakBtn = document.getElementById('speakBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakText);
clearHistoryBtn.addEventListener('click', clearHistory);

async function translateText() {
    const text = inputText.value.trim();
    const lang = targetLanguage.value;
    
    if (!text) {
        showMessage('Please enter some text to translate.', 'error');
        return;
    }

    showMessage('Translating...', 'info');

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
        const data = await response.json();
        
        if (data.responseStatus === 200) {
            const translatedText = data.responseData.translatedText;
            outputText.textContent = translatedText;
            showMessage('Translation complete!', 'success');
            
            await backend.addTranslation(text, translatedText, lang);
            updateHistory();
        } else {
            showMessage('Translation failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Translation error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

function speakText() {
    const text = outputText.textContent;
    if (!text) {
        showMessage('No text to read.', 'error');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage.value;
    speechSynthesis.speak(utterance);
    showMessage('Reading aloud...', 'info');
}

async function updateHistory() {
    const translations = await backend.getTranslations();
    historyList.innerHTML = '';
    translations.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${t.original}</strong> → ${t.translated} <em>(${getLanguageName(t.targetLanguage)})</em>`;
        historyList.appendChild(li);
    });
}

async function clearHistory() {
    await backend.clearTranslations();
    updateHistory();
    showMessage('History cleared.', 'success');
}

function showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    document.body.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

function getLanguageName(code) {
    const languages = {
        'de': 'German',
        'fr': 'French',
        'es': 'Spanish'
    };
    return languages[code] || code;
}

// Initial history load
updateHistory();
