import { useState } from 'react';
import Head from 'next/head';
import { QUESTIONS, calculateResult } from '../utils/diagnosis';
import Link from 'next/link';
import { useRouter } from 'next/router'; // ★ ページ遷移のために追加

type ScreenState = 'START' | 'QUESTION'; // ★ 'RESULT' を削除

export default function Home() {
  const router = useRouter(); // ★ ルーターの初期化
  const [screen, setScreen] = useState<ScreenState>('START');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<('E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P')[]>([]);

  const handleStart = () => {
    setScreen('QUESTION');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  };

  const handleAnswer = (type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P') => {
    const updatedAnswers = [...userAnswers, type];
    setUserAnswers(updatedAnswers);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      // 💡 すべての質問に答え終わったら、結果を計算してリザルトページ（/result）へ飛ばす
      const finalResult = calculateResult(updatedAnswers);
      if (finalResult) {
        const mbtiString = finalResult.mbti.toLowerCase();
        router.push(`/result?mbti=${mbtiString}`); // 例: /result?mbti=infj
      }
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

            {/* 性格一覧ボタン */}
            <div className="mt-4 text-center">
              <Link 
                href="/types" 
                className="text-xs font-black text-slate-500 hover:text-slate-800 underline decoration-2 underline-offset-4"
              >
                🔍 サンショウウオの性格一覧を見る
              </Link>
            </div>
          </div>
        )}

        {/* 2. 質問画面 */}
        {screen === 'QUESTION' && (
          <div className="bg-white border-4 border-slate-700 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(51,65,85,1)] p-6 sm:p-10 w-full">
            {/* プログレスバー */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span className="text-slate-600 bg-[#BCE6F8] border-2 border-slate-700 px-2 py-0.5 rounded-lg">質問 {currentQuestionIndex + 1} / {QUESTIONS.length}</span>
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
                  key={`${currentQuestionIndex}-${index}`}
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

      </main>

      {/* フッター */}
      <footer className="bg-white border-t-4 border-slate-700 py-4 text-center text-[11px] font-bold text-slate-400 select-none tracking-wider">
        © 2026 推しサンショウウオ診断 All Rights Reserved.
      </footer>
    </div>
  );
}