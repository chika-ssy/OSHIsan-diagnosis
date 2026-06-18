// 初期スコア
let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

// ユーザーが回答するたびに加点
// 例：Q1で【E】を選んだら scores.E += 1

// 最終的なMBTIタイプの判定
let mbti = "";
mbti += scores.E >= scores.I ? "E" : "I";
mbti += scores.S >= scores.N ? "S" : "N";
mbti += scores.T >= scores.F ? "T" : "F";
mbti += scores.J >= scores.P ? "J" : "P";

// 例：結果が「INTP」ならオオサンショウウオのデータを表示！

// 1. 各種JSONファイルをインポート
import salamanderDataJson from '../public/data/salamanders.json';
import questionsJson from '../public/data/questions.json';

// 2. 型定義
export interface Salamander {
  name: string;
  features: string[];
  mbti: string;
  personality: string[];
  catchphrase: string;
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  }[];
}

// 3. 型アサーションをしてエクスポート
export const SALAMANDER_DATA = salamanderDataJson as Record<string, Salamander>;
export const QUESTIONS = questionsJson as Question[];

// 4. 結果計算ロジック（変更なし）
export function calculateResult(answers: ('E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P')[]): Salamander {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  
  answers.forEach(type => {
    if (type in counts) {
      counts[type]++;
    }
  });

  let mbti = "";
  mbti += counts.E >= counts.I ? "E" : "I";
  mbti += counts.S >= counts.N ? "S" : "N";
  mbti += counts.T >= counts.F ? "T" : "F";
  mbti += counts.J >= counts.P ? "J" : "P";

  return SALAMANDER_DATA[mbti];
}