import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; 
import salamanderData from '../public/data/salamanders.json';

// 💡 ESLintエラーを回避するためにサンショウウオデータの型を定義
interface SalamanderCharacter {
  name: string;
  features: string[];
  mbti: string;
  personality: string[];
  catchphrase: string;
}

export default function TypesPage() {
  const router = useRouter();
  const { from } = router.query; 

  // キャストして型を厳格に定義します
  const allCharacters = salamanderData 
    ? (Object.values(salamanderData) as SalamanderCharacter[]) 
    : [];

  const handleBack = () => {
    if (from) {
      // 💡 トップではなく、直接そのMBTIの結果ページに戻す
      router.push(`/result?mbti=${from}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF7FC] text-slate-800 p-6 font-['Zen_Maru_Gothic'] selection:bg-[#99DCFA] antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* ヘッダーエリア */}
        <div className="text-center mb-10 pt-4">
          <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-wider flex items-center justify-center gap-2 select-none">
            <span className="text-3xl">🦎</span> 推しサンショウウオ 一覧
          </h1>
          <p className="text-sm font-bold text-slate-500">
            全 {allCharacters.length} 種類の個性豊かなキャラクターたち
          </p>
        </div>

        {/* グリッドレイアウト */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {allCharacters.map((char) => (
            /* ★カード全体をリンクで包むスタイルに修正 */
            <Link 
              key={char.mbti}
              href={`/result?mbti=${char.mbti.toLowerCase()}`}
              className="block group" // 子要素のアニメーションを連動させるため group クラスを付与
            >
              {/* ホバー・クリックアニメーションの最適化:
                hover:translate-x-[1px] hover:translate-y-[1px]（1px押し込み）
                active:translate-x-[3px] active:translate-y-[3px]（さらに深く押し込み）
              */}
              <div className="h-full bg-white border-4 border-slate-700 rounded-[2rem] p-5 shadow-[4px_4px_0px_0px_rgba(51,65,85,1)] flex flex-col items-center cursor-pointer select-none transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_rgba(51,65,85,1)]">
                
                {/* イラストエリア */}
                <div className="w-40 h-40 bg-[#D6F0FC] border-4 border-slate-700 rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center shadow-inner shrink-0">
                  <img 
                    src={`/images/salamanders/${char.mbti.toLowerCase()}.png`}
                    alt={char.name}
                    className="w-32 h-32 object-contain group-hover:scale-105 transition duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.03)]"
                  />
                </div>

                {/* バッジ（MBTIタイプ） */}
                <span className="bg-[#99DCFA] border-2 border-slate-700 text-xs font-black px-2.5 py-0.5 rounded-full mb-2 shadow-[1px_1px_0px_0px_rgba(51,65,85,1)] uppercase tracking-wider font-mono">
                  {char.mbti}
                </span>

                {/* キャラ名 & キャッチコピー */}
                <h2 className="text-lg font-black text-slate-800 mb-1 text-center group-hover:text-sky-800 transition-colors">
                  {char.name}
                </h2>
                <p className="text-xs font-bold text-slate-400 text-center line-clamp-2 px-2 mb-4">
                  「{char.catchphrase}」
                </p>

                {/* 生態・性格の特徴リスト */}
                <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-left text-xs space-y-1 mt-auto">
                  <div className="font-black text-slate-500 mb-1 flex items-center gap-1">
                    <span>🧬</span> 特徴:
                  </div>
                  {char.features.slice(0, 2).map((feat: string, i: number) => (
                    <div key={i} className="text-slate-600 flex items-start gap-1 leading-relaxed font-bold">
                      <span className="text-slate-400 select-none">•</span> <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 戻るボタンエリア */}
        <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={handleBack}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-black py-3.5 px-8 rounded-xl border-4 border-slate-700 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] text-sm"
          >
            {from ? '⬅️ 診断結果に戻る' : '⬅️ 前のページに戻る'}
          </button>

          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full bg-[#BCE6F8] hover:bg-[#99DCFA] text-slate-800 font-black py-3.5 px-8 rounded-xl border-4 border-slate-700 shadow-[3px_3px_0px_0px_rgba(51,65,85,1)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(51,65,85,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0px_0px_0px_0px_rgba(51,65,85,1)] text-sm">
              🏠 トップに戻る
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}