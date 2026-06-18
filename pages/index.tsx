import { useState } from 'react';
import Head from 'next/head';
import { QUESTIONS, calculateResult, Salamander } from '../utils/diagnosis';

type ScreenState = 'START' | 'QUESTION' | 'RESULT';

export default function Home() {
  // 画面の状態管理 ('START' | 'QUESTION' | 'RESULT')
  const [screen, setScreen] = useState<ScreenState>('START');
  // 現在何問目か (0 〜 11)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // ユーザーの回答履歴を溜める配列
  const [userAnswers, setUserAnswers] = useState<('E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P')[]>([]);
  // 最終的な診断結果データ
  const [result, setResult] = useState<Salamander | null>(null);

  // 診断をスタートする
  const handleStart = () => {
    setScreen('QUESTION');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResult(null);
  };

  // 選択肢がクリックされたときの処理
  const handleAnswer = (type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P') => {
    const updatedAnswers = [...userAnswers, type];
    setUserAnswers(updatedAnswers);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      // 次の質問へ
      setCurrentQuestionIndex(nextIndex);
    } else {
      // すべて解き終わったら結果を計算して画面を切り替える
      const finalResult = calculateResult(updatedAnswers);
      setResult(finalResult);
      setScreen('RESULT');
    }
  };

  // 最初からやり直す
  const handleRestart = () => {
    setScreen('START');
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800 font-sans flex flex-col justify-between">
      <Head>
        <title>推しサンショウウオ診断</title>
        <meta name="description" content="16タイプ（MBTI）ベースの推しサンショウウオ診断" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ヘッダー */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-700 cursor-pointer" onClick={handleRestart}>
          🦎 推しサンショウウオ診断
        </h1>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-medium">16タイプMBTIベース</span>
      </header>

      {/* メインコンテンツエリア */}
      <main className="flex-grow flex items-center justify-center p-4 max-w-2xl mx-auto w-full">
        
        {/* 1. スタート画面 */}
        {screen === 'START' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full text-center border border-emerald-100">
            <div className="text-6xl mb-6 animate-bounce">🦎</div>
            <h2 className="text-3xl font-black text-emerald-800 mb-4 tracking-tight">
              あなたをサンショウウオに例えると？
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              簡単な12の質問に答えるだけで、あなたの性格を分析！<br />
              日本や世界の魅力的なサンショウウオ16種類の中から、あなたに最もシンクロする「推しサンショウウオ」を導き出します。
            </p>
            <button
              onClick={handleStart}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-12 py-4 rounded-xl shadow-lg transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              診断を始める（無料）
            </button>
          </div>
        )}

        {/* 2. 質問画面 */}
        {screen === 'QUESTION' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full border border-emerald-100">
            {/* プログレスバー */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                <span>質問 {currentQuestionIndex + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100)}% 完了</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* 質問文 */}
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8 leading-snug">
              {QUESTIONS[currentQuestionIndex].text}
            </h3>

            {/* 選択肢ボタン */}
            <div className="space-y-4">
              {QUESTIONS[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.type)}
                  className="w-full text-left bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200 hover:border-emerald-300 rounded-xl p-5 text-base font-medium transition duration-150 leading-relaxed group"
                >
                  <div className="flex items-start">
                    <span className="bg-white border border-slate-300 group-hover:border-emerald-400 text-slate-400 group-hover:text-emerald-600 rounded-lg w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 shrink-0 mt-0.5">
                      {index === 0 ? 'A' : 'B'}
                    </span>
                    <span className="text-slate-700 group-hover:text-emerald-900">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. 結果画面 */}
        {screen === 'RESULT' && result && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full border border-emerald-100">
            <div className="text-center mb-6">
              <span className="text-xs font-bold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                診断結果・あなたのタイプ
              </span>
              <div className="text-lg font-bold text-slate-400 mt-2 tracking-wide">{result.mbti} タイプ</div>
              <h2 className="text-3xl sm:text-4xl font-black text-emerald-800 mt-1 mb-2">
                {result.name}
              </h2>
              <p className="text-lg font-bold text-amber-600 bg-amber-50 inline-block px-4 py-1.5 rounded-lg border border-amber-200 my-2 italic">
                「{result.catchphrase}」
              </p>
            </div>

            {/* キャラクター画像用プレースホルダー */}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 text-slate-400 text-sm">
              🎨 ここにサンショウウオのイラスト（画像）が入ります<br />
              <span className="text-xs text-slate-400 font-mono">public/images/salamanders/{result.mbti.toLowerCase()}.png</span>
            </div>

            {/* 性格タグ */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">あなたの基本的な性格</h4>
              <div className="flex flex-wrap gap-2">
                {result.personality.map((tag, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                    ✨ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 生態・特徴 */}
            <div className="mb-8 bg-emerald-50/50 rounded-xl p-5 border border-emerald-100/60">
              <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-3">生態とあなたとのシンクロ要素</h4>
              <ul className="space-y-2.5 text-slate-600 text-sm sm:text-base leading-relaxed">
                {result.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-500 mr-2 select-none">◆</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
              <button
                onClick={handleRestart}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow text-center"
              >
                もう一度診断する
              </button>
              {/* SNSシェアなどの拡張もここで行えます */}
            </div>
          </div>
        )}

      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © 2026 推しサンショウウオ診断 All Rights Reserved.
      </footer>
    </div>
  );
}