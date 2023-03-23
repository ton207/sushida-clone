const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typingSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");


// inputテキスト入力。合っているかどうかの判定。
typeInput.addEventListener("input",() => {

    // タイプ音をつける
    typingSound.play();
    typingSound.currentTime = 0;

    // ディスプレイと入力の文字の比較
    // ディスプレイに表示されているspanタグを取得
    const sentenceArray = typeDisplay.querySelectorAll("span");
    // console.log(sentenceArray);
    // 自分で打ち込んだテキストを取得
    const arrayValue = typeInput.value.split("");
    // console.log(arrayValue);
    let correct = true; 
    sentenceArray.forEach((characterSpan,index) => {
        if((arrayValue[index] == null)) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        }
        else if(characterSpan.innerText == arrayValue[index]) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        }else {
            characterSpan.classList.add("incorrect");  
            characterSpan.classList.remove("correct");  

            wrongSound.volume = 0.3;
            wrongSound.play();
            wrongSound.currentTime = 0;

            correct = false;
        }
    });

    // 次の章へ
    if(correct == true) {
        correctSound.play();
        correctSound.currentTime = 0;
      RenderNextSentence();
    }
});

// ちゃんとthenかawaitで待たないと欲しいデータが入らない
/* 非同期でランダムな文章を取得する */
function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
      .then((response) => response.json())
      .then(
          (data) => 
    //   ここでならちゃんと文字情報を扱える
      data.content
      );
  }

// 次のランダムな文章を取得し、表示
async function RenderNextSentence() {
    const sentence = await GetRandomSentence();
    console.log(sentence);
    typeDisplay.innerText = "";

    // ディスプレイに表示（最初はsenteceが入ってた）
    // 文章を1文字ずつ分解し、spanタグ生成（class付与目的）
    let oneText = sentence.split("");
    
    oneText.forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        // console.log(characterSpan);
        typeDisplay.appendChild(characterSpan);
        // characterSpan.classList.add("correct");
    });

    // テキストボックスの中身を消す
    typeInput.value = "";

    // タイマーのリセット
    StartTimer();
}

  let startTime; 
  let originTime = 60;
//   カウントダウンを開始
  function StartTimer() {
      timer.innerText = originTime;
    　  startTime = new Date(); //   現在時刻を表示
    //   console.log(startTime);
      setInterval(() => {
        timer.innerText = originTime - getTimerTime();// 1秒ずれて呼び出される
        if(timer.innerText <= 0) TimeUp();
    },1000);
    
  }

  function getTimerTime() {
      return Math.floor((new Date() - startTime) / 1000);
  }// 現在の時刻-1秒前の時刻=1s

  function TimeUp() {
      RenderNextSentence();
  }

RenderNextSentence();
