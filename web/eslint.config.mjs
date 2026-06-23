import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 생성물·의존성은 린트 대상에서 제외 (CI 게이트가 생성 파일 때문에 깨지지 않게)
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "lib/database.types.ts", // GENERATED (supabase gen types) — 수기 편집·린트 금지
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // AC3 — snake_case 와이어 공존 네이밍 규칙 (architecture.md#Naming Patterns)
  //   · 와이어(서버 데이터) 객체 프로퍼티는 snake_case 허용 (format: null)
  //   · 로컬 변수/훅/핸들러는 camelCase 유지, snake_case도 허용(서버 데이터 구조분해 대비)
  {
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "property", format: null }, // 와이어 필드(user_id, as_of) 통과
        {
          selector: "variableLike",
          format: ["camelCase", "snake_case", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allowSingleOrDouble",
        },
      ],
    },
  },
  // 설정 파일은 CommonJS require 허용 (tailwind.config.ts 등)
  {
    files: ["*.config.{ts,js,mjs,cjs}", "tailwind.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
