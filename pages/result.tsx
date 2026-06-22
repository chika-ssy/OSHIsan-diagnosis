import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { calculateResult, Salamander } from '../utils/diagnosis';

export default function ResultPage() {
  const router = useRouter();
  const { mbti } = router.query;
  const [result, setResult] = useState<Salamander | null>(null);
  
  // 以前のHomeから引き継いだ必要なステート群
  const [imageError, setImageError] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // URLのクエリパラメータ「?mbti=xxx」からデータを復元
  useEffect(() => {
    if (!router.isReady || !mbti) return;

    const mbtiParam = Array.isArray(mbti) ? mbti[0] : mbti;
    const mbtiLetters = mbtiParam.toUpperCase().split('') as ('E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P')[];

    try {
      const restoredResult = calculateResult(mbtiLetters);
      if (restoredResult) {
        setResult(restoredResult);
        setImageError(false);
      }
    } catch (e) {
      console.error("結果の復元に失敗しました", e);
    }
  }, [mbti, router.isReady]);

  // 汎用シェア・コピー用関数
  const handleShareGeneral = async () => {
    if (!result) return;

    const title = '推しサンショウウオ診断 🦎';
    const text = `【推しサンショウウオ診断】\n私のタイプは…【${result.name}】でした！\n「${result.catchphrase}」\n\nきみも自分のタイプを診断してみよう！✨\n`;
    const url = `${window.location.origin}/result?mbti=${result.mbti.toLowerCase()}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('シェアがキャンセルされました', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}${url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      } catch (err) {
        alert('コピーに失敗しました。URLを直接コピーしてください。');
      }
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#EBF7FC] flex items-center justify-center font-['Zen_Maru_Gothic']">
        <p className="text-slate-500 font-bold animate-pulse">診断結果を読み込み中... 🦎</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF7FC] text-slate-700 font-['Zen_Maru_Gothic'] flex flex-col justify-between antialiased">
      <Head>
        <title>{result.name} | 推しサンショウウオ診断 🦎</title>
      </Head>

      {/* 固定ヘッダー */}
      <header className="bg-white border-b-4 border-slate-700 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link href="/" passHref legacyBehavior>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 cursor-pointer flex items-center gap-2 select-none active:scale-95 transition duration-100">
            <span className="text-2xl">🦎</span> 推しサンショウウオ診断
          </h1>
        </Link>
        <span className="text-xs font-bold bg-[#BCE6F8] text-slate-700 border-2 border-slate-700 px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(51,65,85,1)]">
          16タイプ診断
        </span>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow flex items-center justify-center p-4 max-w-xl mx-auto w-full my-4">
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

          {/* イラストエリア */}
          <div className="bg-[#D6F0FC] border-4 border-slate-700 rounded-2xl p-6 text-center mb-6 shadow-inner flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            {!imageError ? (
              <img 
                src={`/images/salamanders/${result.mbti.toLowerCase()}.png`}
                alt={result.name} 
                className="w-100 h-100 object-contain group-hover:scale-105 transition duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="text-6xl mb-3 animate-pulse select-none">🎨</div>
                <p className="font-black text-slate-600 text-sm">イラスト準備中…</p>
              </div>
            )}
          </div>

          {/* ◆ 基本のせいかく (タグ風レイアウト) */}
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

          {/* ◆ 生態・とくちょう */}
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
              <span>{isCopied ? '✔️' : '📢'}</span> {isCopied ? 'コピーしました！' : '結果をシェアする'}
            </button>
          </div>

          {/* アクションボタン */}
          <div className="pt-2">
            <Link href="/" passHref legacyBehavior>
              <button
                className="w-full bg-[#BCE6F8] hover:bg-[#99DCFA] text-slate-800 font-black py-3.5 px-6 rounded-xl border-4 border-slate-700 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] text-center text-sm"
              >
                もういちど診断する
              </button>
            </Link>
          </div>

          {/* 性格一覧ボタン */}
          <div className="mt-4 text-center">
            <Link href={`/types?from=${result.mbti.toLowerCase()}`} className="text-xs font-black text-slate-500 hover:text-slate-800 underline decoration-2 underline-offset-4">
              🔍 サンショウウオの性格一覧を見る
            </Link>
          </div>

        </div>
      </main>

      {/* 固定フッター */}
      <footer className="bg-white border-t-4 border-slate-700 py-4 text-center text-[11px] font-bold text-slate-400 select-none tracking-wider">
        © 2026 推しサンショウウオ診断 All Rights Reserved.
      </footer>
    </div>
  );
}