import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // ★ インポートを追加
import salamanderData from '../public/data/salamanders.json';

export default function TypesPage() {
  const router = useRouter();
  
  // URLの「?from=xxx」の部分をNext.jsの機能で自動取得します
  const { from } = router.query; 

  const allCharacters = salamanderData ? Object.values(salamanderData) : [];

  // ★ 戻るボタンを押したときの処理
  const handleBack = () => {
    if (from) {
      // 💡 URLにタイプを乗せてトップページに戻る
      // トップページ側（index.tsx）が、URLにmbtiがあるときに結果画面を開くロジックに対応している場合
      router.push(`/?mbti=${from}`);
    } else {
      // 普通にトップから来た場合は普通にトップへ戻す
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF7FC] text-slate-800 p-6 font-sans selection:bg-[#99DCFA]">
      <div className="max-w-5xl mx-auto">
        
        {/* ヘッダーエリア */}
        <div className="text-center mb-10 pt-4">
          <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-wider flex items-center justify-center gap-2">
            🦎 推しサンショウウオ 一覧
          </h1>
          <p className="text-sm font-bold text-slate-500">
            全 {allCharacters.length} 種類の個性豊かなキャラクターたち
          </p>
        </div>

        {/* グリッドレイアウト */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {allCharacters.map((char: any) => (
            <div 
              key={char.mbti}
              className="bg-white border-4 border-slate-700 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(51,65,85,1)] flex flex-col items-center group transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(51,65,85,1)]"
            >
              {/* イラストエリア */}
              <div className="w-40 h-40 bg-[#D6F0FC] border-4 border-slate-700 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center shadow-inner">
                <img 
                  src={`/images/salamanders/${char.mbti.toLowerCase()}.png`}
                  alt={char.name}
                  className="w-32 h-32 object-contain group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* バッジ（MBTIタイプ） */}
              <span className="bg-[#99DCFA] border-2 border-slate-700 text-xs font-black px-2.5 py-0.5 rounded-full mb-2 shadow-[1px_1px_0px_0px_rgba(51,65,85,1)]">
                {char.mbti.toUpperCase()}
              </span>

              {/* キャラ名 & キャッチコピー */}
              <h2 className="text-lg font-black text-slate-800 mb-1 text-center">
                {char.name}
              </h2>
              <p className="text-xs font-bold text-slate-500 text-center line-clamp-2 px-2 mb-3">
                「{char.catchphrase}」
              </p>

              {/* 生態・性格の特徴リスト */}
              <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-left text-xs space-y-1">
                <div className="font-black text-slate-600 mb-1">🧬 特徴:</div>
                {char.features.slice(0, 2).map((feat: string, i: number) => (
                  <div key={i} className="text-slate-600 flex items-start gap-1">
                    <span>•</span> <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 戻るボタンエリア */}
        <div className="text-center space-x-4">
          <button 
            onClick={handleBack} // ★書き換えた関数を呼び出す
            className="bg-white hover:bg-slate-50 text-slate-800 font-black py-3 px-8 rounded-xl border-4 border-slate-700 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] text-sm"
          >
            {from ? '⬅️ 診断結果に戻る' : '⬅️ 前のページに戻る'}
          </button>

          <Link href="/">
            <button className="bg-slate-800 hover:bg-slate-900 text-white font-black py-3 px-8 rounded-xl border-4 border-slate-700 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] text-sm">
              🏠 トップに戻る
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}