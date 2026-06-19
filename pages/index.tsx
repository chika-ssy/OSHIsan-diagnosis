import { useState, useEffect } from 'react';
import Head from 'next/head';
import { QUESTIONS, calculateResult, Salamander } from '../utils/diagnosis';

type ScreenState = 'START' | 'QUESTION' | 'RESULT';

export default function Home() {
  const [screen, setScreen] = useState<ScreenState>('START');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<('E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P')[]>([]);
  const [result, setResult] = useState<Salamander | null>(null);
  
  // 画像の読み込みエラーを状態として管理（最適化）
  const [imageError, setImageError] = useState<boolean>(false);

  // 画面が切り替わるときに画像エラーの状態をリセット
  useEffect(() => {
    if (screen === 'RESULT') {
      setImageError(false);
    }
  }, [screen]);

  const handleStart = () => {
    setScreen('QUESTION');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResult(null);
  };

  const [isCopied, setIsCopied] = useState(false);

const handleShareGeneral = async () => {
  if (!result) return;

  const title = '推しサンショウウオ診断 🦎';
  const text = `【推しサンショウウオ診断】\n私のタイプは…【${result.name}】でした！\n「${result.catchphrase}」\n\nきみも自分のタイプを診断してみよう！✨\n`;
  const url = window.location.origin; // 今のサイトのURLを自動取得

  // 1. スマホなどの標準シェア機能が使える場合（Web Share API）
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: url,
      });
    } catch (error) {
      console.log('シェアがキャンセルされました', error);
    }
  } 
  // 2. パソコンなど、標準シェア機能がない場合はクリップボードにコピー
  else {
    try {
      await navigator.clipboard.writeText(`${text}${url}`);
      setIsCopied(true);
      // 3秒後に「コピーしました」の表示を消す
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      alert('コピーに失敗しました。URLを直接コピーしてください。');
    }
  }
};

  const handleAnswer = (type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P') => {
    const updatedAnswers = [...userAnswers, type];
    setUserAnswers(updatedAnswers);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      const finalResult = calculateResult(updatedAnswers);
      setResult(finalResult);
      setScreen('RESULT');
    }
  };

  const handleRestart = () => {
    setScreen('START');
  };

  return (
    <div className="min-h-screen bg-[#EBF7FC] text-slate-700 font-['Zen_Maru_Gothic'] flex flex-col justify-between antialiased">
      <Head>
        <title>推しサンショウウオ診断 🦎</title>
        <meta name="description" content="きみはどのタイプ？ゆるかわサンショウウオの仲間たちに例える16タイプ診断" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ヘッダー */}
      <header className="bg-white border-b-4 border-slate-700 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <h1 
          onClick={handleRestart}
          className="text-xl sm:text-2xl font-black text-slate-800 cursor-pointer flex items-center gap-2 select-none active:scale-95 transition duration-100"
        >
          <span className="text-2xl">🦎</span> 推しサンショウウオ診断
        </h1>
        <span className="text-xs font-bold bg-[#BCE6F8] text-slate-700 border-2 border-slate-700 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(51,65,85,1)]">
          16タイプ診断
        </span>
      </header>

      {/* メインコンテンツエリア */}
      <main className="flex-grow flex items-center justify-center p-4 max-w-xl mx-auto w-full my-4">
        
        {/* 1. スタート画面 */}
        {screen === 'START' && (
          <div className="bg-white border-4 border-slate-700 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(51,65,85,1)] p-8 sm:p-12 w-full text-center relative overflow-hidden">
            <div className="w-48 h-48 bg-[#D6F0FC] rounded-full mx-auto mb-8 border-4 border-slate-700 flex items-center justify-center shadow-inner relative overflow-hidden group">
              <div className="text-7xl group-hover:scale-110 transition duration-300 select-none">🦎</div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4 tracking-tight leading-snug">
              あなたをサンショウウオに<br />例えると…？
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mb-8 leading-relaxed font-medium">
              簡単な12の質問に答えるだけ！<br />
              きみの性格にぴったりシンクロする<br />
              「推しサンショウウオ」を見つけよう。
            </p>

            <button
              onClick={handleStart}
              className="w-full sm:w-auto bg-[#99DCFA] hover:bg-[#BCE6F8] active:bg-[#72cdfa] text-slate-800 font-black text-lg px-12 py-4 rounded-2xl border-4 border-slate-700 shadow-[4px_4px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_rgba(51,65,85,1)]"
            >
              診断を始める ➔
            </button>
          </div>
        )}

        {/* 2. 質問画面 */}
        {screen === 'QUESTION' && (
          <div className="bg-white border-4 border-slate-700 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(51,65,85,1)] p-6 sm:p-10 w-full">
            {/* プログレスバー */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span className="text-slate-600 bg-[#BCE6F8] border-2 border-slate-700 px-2 py-0.5 rounded-lg">しつもん {currentQuestionIndex + 1} / {QUESTIONS.length}</span>
                <span className="font-mono">{Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full border-2 border-slate-700 p-0.5 overflow-hidden">
                <div 
                  className="bg-[#99DCFA] h-full rounded-full border-r-2 border-slate-700 transition-all duration-200"
                  style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* 質問文の吹き出し風デザイン */}
            <div className="bg-[#FFF9E6] border-4 border-slate-700 rounded-2xl p-5 mb-8 relative shadow-[3px_3px_0px_0px_rgba(51,65,85,1)]">
              <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-relaxed">
                {QUESTIONS[currentQuestionIndex].text}
              </h3>
            </div>

            {/* 選択肢ボタン */}
            <div className="space-y-4">
              {QUESTIONS[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={`${currentQuestionIndex}-${index}`} // keyを最適化
                  onClick={() => handleAnswer(option.type)}
                  className="w-full text-left bg-white hover:bg-[#EBF7FC] border-4 border-slate-700 rounded-2xl p-5 font-bold transition-all duration-100 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] group"
                >
                  <div className="flex items-center">
                    <span className="bg-[#F4F9F1] group-hover:bg-[#99DCFA] border-2 border-slate-700 text-slate-700 rounded-xl w-7 h-7 flex items-center justify-center text-xs font-black mr-4 shrink-0 transition-colors">
                      {index === 0 ? 'A' : 'B'}
                    </span>
                    <span className="text-slate-700 leading-relaxed text-sm sm:text-base">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. 結果画面 */}
        {screen === 'RESULT' && result && (
          <div className="bg-white border-4 border-slate-700 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(51,65,85,1)] p-6 sm:p-8 w-full relative">
            
            <div className="text-center mb-6">
              <span className="text-[11px] font-black tracking-wider text-slate-500 bg-slate-100 border-2 border-slate-700 px-3 py-1 rounded-full uppercase">
                診断結果
              </span>
              <div className="text-xs font-mono font-bold text-slate-400 mt-3 tracking-widest">
                — {result.mbti} TYPE —
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 mb-3">
                {result.name}
              </h2>
              
              <div className="px-5 py-2.5 bg-[#FFF9E6] rounded-xl border-2 border-slate-700 shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] inline-block max-w-full">
                <p className="text-xs sm:text-sm font-black text-amber-900">
                  「{result.catchphrase}」
                </p>
              </div>
            </div>

            {/* キャラクターイラスト表示エリアの最適化 */}
            <div className="bg-[#D6F0FC] border-4 border-slate-700 rounded-2xl p-4 text-center mb-6 shadow-inner flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group">
              {!imageError ? (
                <img 
                  src={`/images/salamanders/${result.mbti.toLowerCase()}.png`} 
                  alt={result.name} 
                  className="w-100 h-100 object-contain group-hover:scale-105 transition duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                  onError={() => setImageError(true)} // React流のエラーハンドリングに最適化
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl mb-2 animate-pulse select-none">🎨</div>
                  <p className="font-black text-slate-600 text-xs sm:text-sm">イラスト準備中…</p>
                  <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-300 px-2 py-0.5 rounded mt-2">
                    /images/salamanders/{result.mbti.toLowerCase()}.png
                  </span>
                </div>
              )}
            </div>

            {/* 基本の性格 */}
            <div className="mb-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">◆ 基本のせいかく</h4>
              <div className="flex flex-wrap gap-2">
                {result.personality.map((tag, i) => (
                  <span 
                    key={`tag-${i}`}
                    className="bg-white text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-slate-700 shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] flex items-center gap-1"
                  >
                    <span>🌱</span> {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 生態・とくちょう */}
            <div className="mb-8 bg-[#BCE6F8]/40 rounded-2xl p-5 border-2 border-slate-700 shadow-[2px_2px_0px_0px_rgba(51,65,85,1)]">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-1">
                <span>🍃</span> 生態とシンクロ要素
              </h4>
              <ul className="space-y-2 text-slate-600 text-xs sm:text-sm font-bold leading-relaxed">
                {result.features.map((feature, i) => (
                  <li key={`feature-${i}`} className="flex items-start">
                    <span className="text-emerald-600 mr-2 select-none">●</span>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ★シェアボタン★ */}
            <div className="mb-4 relative">
              <button
                onClick={handleShareGeneral}
                className="w-full bg-sky-700 hover:bg-sky-800 text-white font-black py-3.5 px-6 rounded-xl border-4 border-slate-700 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] text-center text-sm flex items-center justify-center gap-2"
              >
                <span>📢</span> 結果をシェアする
              </button>
            </div>

            {/* アクションボタン */}
            <div className="pt-2">
              <button
                onClick={handleRestart}
                className="w-full bg-[#BCE6F8] hover:bg-[#99DCFA] text-slate-800 font-black py-3.5 px-6 rounded-xl border-4 border-slate-700 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] text-center text-sm"
              >
                もういちど診断する
              </button>
            </div>
          </div>
        )}

      </main>

      {/* フッター */}
      <footer className="bg-white border-t-4 border-slate-700 py-4 text-center text-[11px] font-bold text-slate-400 select-none tracking-wider">
        © 2026 推しサンショウウオ診断 All Rights Reserved.
      </footer>
    </div>
  );
}