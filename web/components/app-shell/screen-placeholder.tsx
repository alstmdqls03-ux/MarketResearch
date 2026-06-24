// 피처 화면이 들어오기 전의 빈상태 플레이스홀더 (후속 스토리 1.4~1.7·4.x가 대체).
export function ScreenPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-[17px] font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
